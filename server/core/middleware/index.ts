import e from 'express';
import { Document, Model } from 'mongoose';

/**
 * Remember to use :id in router params. The middleware will also attach the corresponding
 * object to 'object' in request.
 */
export function checkExist<T extends Document>(
  model: Model<T>,
  projection: any = {},
): e.Handler {
  return async (req: e.Request, res: e.Response, next: e.NextFunction): Promise<void> => {
    const id = req.params.id as string;
    try {
      const obj = await model.findById(id, projection);
      req.object = obj;
      next();
    } catch (err) {
      res.status(404).end();
    }
  };
}

export function httpMethodNotSupport(req: e.Request, res: e.Response): void {
  res.status(405).end();
}

interface PagerQuery {
  startPage: number; // page start number.
  pageLimit: number; // how many pages can be displayed.
  limit: number; // how many records a page can show.
}

interface PagerResponse {
  // If true, remain page number is enough to display next `pageLimit` pages.
  hasNext: boolean;
  // When hasNext is false, it return how many remained pages can be displayed.
  leftNumber?: number;
}

export function Pager<T extends Document>(model: Model<T>): e.Handler {
  return async function(req: e.Request, res: e.Response) {
    for (const key in req.query) {
      req.query[key] = parseInt(req.query[key]);
    }
    const { startPage, pageLimit, limit } = req.query as PagerQuery;
    if (startPage && pageLimit && limit) {
      const nums = await model
        .find({}, { _id: 1 })
        .skip((startPage - 1) * limit)
        .limit(pageLimit * limit)
        .count();
      if (nums === pageLimit * limit) {
        res.json({
          hasNext: true,
        });
      } else {
        res.json({
          hasNext: false,
          leftNumber: Math.ceil(nums / limit),
        });
      }
    } else {
      res.status(400).end();
    }
  };
}
