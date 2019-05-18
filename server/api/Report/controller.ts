
import e from 'express';
import { connection } from 'mongoose';

interface SearchItemQuery {
  query: string;
}

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
    res.send(items);
  } catch(err) {
    res.status(400);
    console.error(err);
  }
}

export function GetConditions(req: e.Request, res: e.Response, next: e.NextFunction): void {
  const conditions = [{}]
}