import e from 'express';
import { Document, Model } from 'mongoose';

/**
 * Remember to use :id in router params. The middleware will also attach the corresponding
 * object to 'object' in request.
 */
export function checkExist<T extends Document>(model: Model<T>): e.Handler {
return async (req: e.Request, res: e.Response, next: e.NextFunction): Promise<void> => {
    const id = req.params.id as string;
    try {
      const obj = await model.findById(id);
      req.object = obj;
      next();
    } catch (err) {
      res.status(404).end();
    }
  };
}
