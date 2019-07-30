import e from 'express';
import { connection } from 'mongoose';
import { Logger } from '../../core/util';
import { Category } from '../../models';
import { CategoryInterface } from '../../models/Category';

export interface GetCategoriesResponseBody {
  items: CategoryInterface[];
}

export async function GetCategories(req: e.Request, res: e.Response): Promise<void> {
  const categories = await Category.find({});
  res.send(categories);
}

export interface AddCategoryRequestBody extends CategoryInterface {
}

export async function AddCategory(req: e.Request, res: e.Response): Promise<void> {
  const { body } = req;
  const { name, items } = body as AddCategoryRequestBody;
  if (!(name && name.length) && (items && items.length)) {
    return res.status(422).end();
  }
  for (const item of items) {
    const hasFound = await connection.db.collection('items').findOne({ 單品名稱: item });
    if (!hasFound) {
      Logger.error(new Error(`Cannot not found item "${item}".`));
      return res.status(404).end();
    }
  }
  const category = new Category({
    name,
    items,
  });
  try {
    await category.save();
    return res.status(201).end();
  } catch (error) {
    Logger.error(error);
    res.status(422).end();
  }
}

export async function GetCategory(req: e.Request, res: e.Response): Promise<void> {
  try {
    const { object } = req.params;
    res.send(object);
  } catch (error) {
    Logger.error(error);
    res.status(400).end();
  }
}

export async function ModifyCategory(req: e.Request, res: e.Response) {
  const object = req.params.object as CategoryInterface;
  const body = req.body;
  try {
    for (const key in body) {
      if (key in object) {
        object[key] = body[key];
      } else {
        throw new Error(`${key} does not exist on category object.`);
      }
    }
    await object.save();
    res.status(200).end();
  } catch (error) {
    Logger.error(error);
    res.status(422).end();
  }
}

export async function DeleteCategory(req: e.Request, res: e.Response): Promise<void> {
  const object = req.params.object as CategoryInterface;
  try {
    await object.remove();
    res.status(200).end();
  } catch (error) {
    Logger.error(error);
    res.status(400).end();
  }
}
