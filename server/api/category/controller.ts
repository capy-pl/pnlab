import e from 'express';
import { connection } from 'mongoose';
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
      return res.status(404).send({ message: `Cannot not found item "${item}".` }).end();
    }
  }
  const category = new Category({
    name,
    items,
  });
  try {
    await category.save();
    return res.status(201).end();
  } catch (err) {
    res.status(422).send({ message: err.message });
  }
}
