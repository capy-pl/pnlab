import e, { NextFunction } from 'express';
import { connection } from 'mongoose';

import { Logger } from '../../core/util';
import Promotion, { PromotionInterface, PromotionType } from '../../models/Promotions';
import { MongoError } from 'mongodb';

/**
 * Add a promotion.
 * @api POST /api/promotion
 * @apiName AddPromotion
 * @apiGroup Promotion
 * @apiSuccess (201)
 * @apiFail (400) Missing or invalid fields are given or duplicate error.
 * @apiFail (404) The item provided is not found in database.
 */
export async function AddPromotion(
  req: e.Request,
  res: e.Response,
  next: NextFunction,
): Promise<void> {
  const body = req.body as PromotionInterface;
  if (!(body.name && body.groupOne && body.startTime && body.endTime)) {
    return res
      .status(400)
      .send({ message: 'Missing field.' })
      .end();
  }

  try {
    body.startTime = new Date(body.startTime);
    body.endTime = new Date(body.endTime);
  } catch (error) {
    Logger.error(error);
    return res
      .status(400)
      .send({ message: 'startTime or endTime is not correct or provided.' })
      .end();
  }

  for (const item of body.groupOne) {
    const hasFound = await connection.db.collection('items').findOne({ 單品名稱: item });
    if (!hasFound) {
      return res
        .status(404)
        .send({ message: `Cannot not found item "${item}".` })
        .end();
    }
  }

  if (body.type === 'combination') {
    if (body.groupTwo) {
      for (const item of body.groupTwo) {
        const hasFound = await connection.db
          .collection('items')
          .findOne({ 單品名稱: item });
        if (!hasFound) {
          res
            .status(404)
            .send({ message: `Cannot not found item "${item}".` })
            .end();
        }
      }
    } else {
      res
        .status(400)
        .send({ message: 'groupTwo is required when type equals to combinations.' })
        .end();
    }
  }

  try {
    const promotion = new Promotion(body);
    await promotion.save();
    res.status(201).send({ id: promotion._id });
  } catch (error) {
    if (error instanceof MongoError) {
      res.status(400).send({ message: 'Duplicate name.' });
      return;
    }
    return next(error);
  }
}

interface GetPromotionsQuery {
  type?: PromotionType;
  limit?: string;
  page?: string;
}

/**
 * Get promotion list.
 * Get latest promotion list. If the page and limit is not set,
 * The api will return the newest 50 records.
 * @api GET /api/promotion
 * @apiName GetPromotions
 * @apiGroup Promotion
 * @apiQuery type
 * @apiQuery limit
 * @api page
 * @apiSuccess (200)
 * @apiFail (404) The analysis is not found(handle by middleware).
 */
export async function GetPromotions(req: e.Request, res: e.Response): Promise<void> {
  const { type, limit, page } = req.query as GetPromotionsQuery;
  const query: any = {};
  if (type) {
    query.type = type;
  }
  if (limit && page) {
    const promotions = await Promotion.find(query)
      .sort({ created: -1 })
      .skip(parseInt(limit) * (parseInt(page) - 1))
      .limit(parseInt(limit));
    res.send(promotions).end();
    return;
  } else {
    const promotions = await Promotion.find(query)
      .sort({ created: -1 })
      .limit(50);
    res.send(promotions).end();
    return;
  }
}

/**
 * Get a promotion.
 * @api GET /api/promotion/:id
 * @apiName GetPromotion
 * @apiGroup Promotion
 * @apiParam id {String} The promotion's id.
 * @apiSuccess (200)
 * @apiFail (404) The analysis is not found(handle by middleware).
 */
export async function GetPromotion(req: e.Request, res: e.Response): Promise<void> {
  const { object } = req;
  res.send(object);
}

/**
 * Modify a promotion.
 * @api PUT /api/promotion/:id
 * @apiName ModifyPromotion
 * @apiGroup Promotion
 * @apiParam id {String} The analysis's id.
 * @apiSuccess (200)
 * @apiFail (400) Missing field or duplicate name.
 * @apiFail (404) The analysis is not found(handle by middleware).
 */
export async function UpdatePromotion(
  req: e.Request,
  res: e.Response,
  next: NextFunction,
): Promise<void> {
  const object = req.object as PromotionInterface;
  const body = req.body as PromotionInterface;
  if (!(body.name && body.groupOne && body.startTime && body.endTime)) {
    return res
      .status(400)
      .send({ message: 'Missing field.' })
      .end();
  }

  try {
    body.startTime = new Date(body.startTime);
    body.endTime = new Date(body.endTime);
  } catch (error) {
    Logger.error(error);
    return res
      .status(400)
      .send({ message: 'startTime or endTime is not correct or provided.' })
      .end();
  }
  if (object) {
    for (const key in body) {
      if (key in object) {
        object[key] = body[key];
      }
    }

    if (object.type === 'direct') {
      object.groupTwo = [];
    }

    try {
      await object.save();
      res.status(200).end();
    } catch (error) {
      if (error instanceof MongoError) {
        res.status(400).send({ message: 'Duplicate name.' });
        return;
      }
      return next(error);
    }
  }
}

/**
 * Delete a promotion.
 * @api DELETE /api/promotion/:id
 * @apiName DeletePromotion
 * @apiGroup Promotion
 * @apiParam id {String} The analysis's id.
 * @apiSuccess (200)
 * @apiFail (404) The promotion is not found(handle by middleware).
 */
export async function DeletePromotion(
  req: e.Request,
  res: e.Response,
  next: NextFunction,
): Promise<void> {
  const { object } = req;
  try {
    if (object) {
      await object.remove();
      res.status(200).end();
    }
  } catch (error) {
    return next(error);
  }
}
