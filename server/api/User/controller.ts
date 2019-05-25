import e from 'express';
import { ItemGroup } from '../../models';
import { connection } from 'mongoose';
import { ItemGroupInterface } from '../../models/ItemGroup';

/**
 * Get user info.
 * @api /user/info
 * @method GET
 * @apiName Info
 * @apiGroup User
 */
export function Info(req: e.Request, res: e.Response, next: e.NextFunction): void {
  const { user } = req;
  res.send(user);
}

export interface GetGroupsResponseBody {
  items: ItemGroupInterface[];
}

export async function GetGroups(req: e.Request, res: e.Response, next: e.NextFunction): Promise<void> {
  const groups = await ItemGroup.find({});
  res.send(groups);
}

export interface AddGroupsRequestBody extends ItemGroupInterface {
}

export async function AddGroups(req: e.Request, res: e.Response, next: e.NextFunction): Promise<void> {
  const { body } = req;
  const { name, items, startTime, endTime } = body as AddGroupsRequestBody;
  if (!((name && name.length) && (items && items.length) && startTime && endTime)) {
    return res.status(422).end();
  }
  for (const item of items) {
    const hasFound = await connection.db.collection('items').findOne({'單品名稱': item });
    if (!hasFound) {
      return res.status(422).send({ message: `Cannot not found item "${item}".`}).end();
    }
  }
  const newGroup = new ItemGroup({
    name,
    items,
    startTime,
    endTime
  });
  try {
    await newGroup.save();
    return res.status(201).end();
  } catch (err) {
    res.status(422).send({ message: err.message });
  }
}
