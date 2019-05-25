
import e from 'express';
import { connection } from 'mongoose';
import { UserSchemaInterface } from '../../models/User';
import { FieldSchemaInterface } from '../../models/ImportSchema';

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
      '單品名稱':
      { '$regex': query }
    })
    .project({
      '_id': 0,
      '單品名稱': 1
    })
    .limit(10)
    .toArray();
    res.send({
      items: items.map(item => item['單品名稱'])
    });
  } catch(err) {
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
  const { user } = req;
  const { org } = user as UserSchemaInterface;
  const { transactionFields } = org.importSchema;
  res.send({
    conditions: transactionFields
  });
}
