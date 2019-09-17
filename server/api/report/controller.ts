import e from 'express';
import { connection } from 'mongoose';
import { getChannel } from '../../core/mq';
import { Logger } from '../../core/util';
import { Action, Analysis, Promotion, Report } from '../../models';
import { ReportInterface, Community } from '../../models/Report';
import { FieldSchemaInterface } from '../../models/ImportSchema';
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
 * @query {string} items
 * @apiName SearchItem
 * @apiGroup Report
 */
export async function SearchItem(req: e.Request, res: e.Response): Promise<void> {
  const { query } = req.query as SearchItemQuery;
  try {
    const items = await connection.db
      .collection('items')
      .find({
        單品名稱: { $regex: query },
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
  } catch (error) {
    res.status(400).end();
    Logger.error(error);
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
export async function GetConditions(req: e.Request, res: e.Response): Promise<void> {
  try {
    const { user } = req;
    const { org } = user as UserSchemaInterface;
    const { transactionFields, itemFields } = org.importSchema;
    const promotions = await Promotion.find({}, { name: 1 });
    const conditions: FieldSchemaInterface[] = transactionFields.concat(itemFields);
    const promotionField: FieldSchemaInterface = {
      name: '促銷',
      type: 'promotion',
      belong: 'promotion',
      actions: ['delete'],
      values: promotions.map((promotion) => promotion.name),
    };

    const methodField: FieldSchemaInterface = {
      name: '權重方法',
      type: 'method',
      belong: 'method',
      actions: [],
      values: ['frequency', 'adjust-frequency', 'adjust-price'],
    };

    conditions.push(promotionField);
    conditions.push(methodField);
    res.send({
      conditions,
    });
  } catch (error) {
    Logger.error(error);
    res.status(500).end();
  }
}

export interface AddReportRequestBody {
  conditions: FieldSchemaInterface[];
}

export interface AddReportResponseBody {
  id: string;
}

export async function AddReport(req: e.Request, res: e.Response): Promise<void> {
  const { user } = req;
  const { org } = user as UserSchemaInterface;
  try {
    const { conditions } = req.body as AddReportRequestBody;
    const mapping: { [key: string]: FieldSchemaInterface } = {};
    const report = new Report({
      conditions: [],
      created: new Date(),
      modified: new Date(),
      status: 'pending',
    });
    const action = new Action({
      type: 'report',
      created: new Date(),
      modified: new Date(),
      status: 'pending',
    });

    for (const field of org.importSchema.transactionFields) {
      mapping[field.name] = field;
    }

    for (const field of org.importSchema.itemFields) {
      mapping[field.name] = field;
    }

    // tslint:disable-next-line: no-string-literal
    mapping['促銷'] = {
      name: '促銷',
      type: 'promotion',
      belong: 'promotion',
      actions: ['delete'],
    };

    mapping['權重方法'] = {
      name: '權重方法',
      type: 'method',
      belong: 'method',
      actions: [],
    };

    for (const condition of conditions) {
      if (condition.name in mapping && condition.type === mapping[condition.name].type) {
        report.conditions.push(condition);
      }
    }
    await report.save();
    res.status(201).send({ id: report.id });

    action.targetId = report.id;
    await action.save();

    const channel = getChannel();
    channel.sendToQueue('pn', Buffer.from(action.id));
  } catch (error) {
    Logger.error(error);
    res.status(400).send({ message: error.message });
  }
}

export async function GetReport(req: e.Request, res: e.Response): Promise<void> {
  const id = req.params.id as string;
  try {
    const report = await Report.findOne({ _id: id });
    if (!report) {
      throw Error('Not found');
    }
    res.json(report);
  } catch (error) {
    Logger.error(error);
    res.status(404).send({ message: error.message });
  }
}

export interface GetReportsRequestQuery {
  limit?: string;
  page?: string;
}

export type ReportPreview = Pick<
  ReportInterface,
  '_id' | 'created' | 'conditions' | 'modified' | 'status' | 'errorMessage'
>;
export interface GetReportsResponseBody {
  reports: ReportPreview[];
}

export async function GetReports(req: e.Request, res: e.Response): Promise<void> {
  const { limit, page } = req.query as GetReportsRequestQuery;
  const projection = {
    conditions: 1,
    status: 1,
    errMessage: 1,
    created: 1,
    modified: 1,
  };
  try {
    let reports: ReportPreview[];
    if (limit && page) {
      reports = await Report.find({}, projection)
        .sort({ created: -1 })
        .skip(parseInt(limit) * (parseInt(page) - 1))
        .limit(parseInt(limit));
    } else {
      reports = await Report.find({}, projection).sort({ created: -1 });
    }
    res.send({ reports });
  } catch (error) {
    Logger.error(error);
    res.status(500).end();
  }
}

export async function DeleteReport(req: e.Request, res: e.Response): Promise<void> {
  const id = req.params.id as string;
  const isUsed = await Analysis.findOne({ report: id }).count();
  if (isUsed) {
    return res.status(403).end();
  }
  try {
    const report = await Report.findOne({ _id: id });
    if (!report) {
      throw Error('Document Not found');
    }
    await report.remove();
    res.status(200).end();
  } catch (err) {
    Logger.error(err);
    res.status(500).end();
  }
}

interface CommunityInfo extends Community {
  averagePrice: number;
  tags: string[];
}

export async function GetCommunityInfo(req: e.Request, res: e.Response): Promise<void> {
  const object = req.object as ReportInterface;
  const { communityId } = req.params;
  const filterCommunities = object.communities.filter(
    (community) => community.id === parseInt(communityId),
  );
  if (!filterCommunities.length) {
    res.status(404).end();
    return;
  }
  const [community] = filterCommunities;
  const items = await connection.db
    .collection('items')
    .find({
      單品名稱: {
        $in: Array.from(community.items.map((item) => item['name'])),
      },
    })
    .toArray();
  const averagePrice = items.reduce<number>((current, prev) => {
    return current + prev['銷售單價'];
  }, 0);
  const tagsArr = items.map((item) => item['群號-群名稱']);
  const tagsSet = new Set<string>(tagsArr);
  const tags = Array.from(tagsSet);
  res.send({
    id: community.id,
    items: community.items,
    core: community.core,
    weight: community.weight,
    averagePrice,
    tags,
  });
}
