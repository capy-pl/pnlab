import e from 'express';
import { connection } from 'mongoose';

import Promotion, {
  PromotionInterface,
  PromotionType,
} from '../../models/Promotions';

interface AddPromotionBody extends PromotionInterface {
}

export async function AddPromotion(req: e.Request, res: e.Response): Promise<void> {
  const body = req.body as AddPromotionBody;
  if (!(body.name && body.groupOne && body.startTime && body.endTime)) {
    return res.status(400).send({  message: 'Missing field.' }).end();
  }

  try {
    body.startTime = new Date(body.startTime);
    body.endTime = new Date(body.endTime);
  } catch (err) {
    return res.status(400).send({ message: 'startTime or endTime is not correct or provided.' }).end();
  }

  for (const item of body.groupOne) {
    const hasFound = await connection.db.collection('items').findOne({ 單品名稱: item });
    if (!hasFound) {
      return res.status(404).send({ message: `Cannot not found item "${item}".` }).end();
    }
  }

  if (body.type === 'combination') {
    if (body.groupTwo) {
      for (const item of body.groupOne) {
        const hasFound = await connection.db.collection('items').findOne({ 單品名稱: item });
        if (!hasFound) {
          return res.status(404).send({ message: `Cannot not found item "${item}".` }).end();
        }
      }
    } else {
      return res.status(400).send({ message: 'groupTwo is required when type equals to combinations.' }).end();
    }
  }

  try {
    const promotion = new Promotion(body);
    await promotion.save();
    return res.status(201).end();
  } catch (error) {
    return res.status(422).send({ message: error.message }).end();
  }
}

interface GetPromotionsQuery {
  type?: PromotionType;
  limit?: number;
}

export async function GetPromotions(req: e.Request, res: e.Response): Promise<void> {
  const query = req.query as GetPromotionsQuery;
  if (query.type) {
    const promotions = await Promotion.find({
      type: query.type,
    });
    return res.send({ promotions }).end();
  } else {
    const promotions = await Promotion.find({});
    return res.send({ promotions }).end();
  }
}
