import e from 'express';
import { connection } from 'mongoose';
import { getChannel } from '../../core/mq';
import {
  Report,
} from '../../models';
import { FieldSchemaInterface } from '../../models/ImportSchema';
import {
  Condition, ReportInterface,
} from '../../models/Report';
import { UserSchemaInterface } from '../../models/User';

interface SearchItemQuery {
  query: string;
}

export interface SearchItemResponseBody {
  items: string[];
}

/**
 * Search item by name.
 * @api /report/searchItem
 * @method GET
 * @query items {string}
 * @apiName SearchItem
 * @apiGroup Report
 */
export async function SearchItem(req: e.Request, res: e.Response, next: e.NextFunction): Promise<void> {
  const { query } = req.query as SearchItemQuery;
  try {
    const items = await connection.db.collection('items')
    .find({
      單品名稱:
      { $regex: query },
    })
    .project({
      _id: 0,
      單品名稱: 1,
    })
    .limit(10)
    .toArray();
    res.send({
      items: items.map((item) => item.單品名稱),
    });
  } catch (err) {
    res.status(400);
    console.error(err);
  }
}

export interface GetConditionsResponseBody {
  conditions: FieldSchemaInterface[];
}

/**
 * Get report's conditions.
 * @api /report/conditions
 * @method GET
 * @apiName GetConditions
 * @apiGroup Report
 */
export async function GetConditions(req: e.Request, res: e.Response, next: e.NextFunction): Promise<void> {
  try {
    const { user } = req;
    const { org } = user as UserSchemaInterface;
    const { transactionFields } = org.importSchema;
    res.send({
      conditions: transactionFields,
    });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}

export interface AddReportRequestBody {
  conditions: FieldSchemaInterface[];
}

export interface AddReportResponseBody {
  id: string;
}

export async function AddReport(req: e.Request, res: e.Response, next: e.NextFunction): Promise<void> {
  const { user } = req;
  const { org } = user as UserSchemaInterface;
  try {
    const { conditions } = req.body as AddReportRequestBody;
    const mapping: { [key: string]: FieldSchemaInterface  } = {};
    const report = new Report({
      conditions: [],
      created: new Date(),
      modified: new Date(),
      status: 'pending',
    });

    for (const field of org.importSchema.transactionFields) {
      mapping[field.name] = field;
    }

    for (const condition of conditions) {
      if (condition.name in mapping) {
        if (condition.type === mapping[condition.name].type) {
          report.conditions.push(condition);
        }
      }
    }
    await report.save();
    res.status(201).send({ id: report.id });
    const channel = getChannel();
    channel.sendToQueue('pn', Buffer.from(report.id));
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
}

export interface GetReportResponseBody extends ReportInterface {
}

export async function GetReport(req: e.Request, res: e.Response, next: e.NextFunction): Promise<void> {
  const id = req.params.id as string;
  try {
    const report = await Report.findOne({ _id: id }).exec();
    if (!report) {
      throw Error('Not found');
    }
    res.json(report);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
}

export interface GetReportsRequestQuery {
  limit?: number;
}

export interface ProjectedReport {
  _id: string;
  created: Date;
  conditions: Condition[];
  modified: Date;
  status: 'error' | 'pending' | 'success';
  errorMessage: string;
  startTime: Date;
  endTime: Date;
}

export interface GetReportsResponseBody {
  reports: ProjectedReport[];
}

export async function GetReports(req: e.Request, res: e.Response, next: e.NextFunction): Promise<void> {
  const { limit } = req.query as GetReportsRequestQuery;
  const projection = {
    conditions: 1,
    status: 1,
    errMessage: 1,
    created: 1,
    modified: 1,
    startTime: 1,
    endTime: 1,
  };
  try {
    let reports: ProjectedReport[];
    if (limit) {
      reports = await Report.find({}, projection).limit(limit).sort({ created: -1 });
    } else {
      reports = await Report.find({}, projection).sort({ created: -1 });
    }
    res.send({ reports });
  } catch (err) {
    res.status(500).end();
  }
}
