import { Router } from 'express';

import { loginRequired } from '../../core/auth';
import { checkExist } from '../../core/middleware';
import Promotion from '../../models/Promotions';

import {
  AddPromotion,
  DeletePromotion,
  GetPromotion,
  GetPromotions,
  UpdatePromotion,
} from './controller';

const router = Router();

router
  .route('/')
  .all(loginRequired)
  .get(GetPromotions)
  .post(AddPromotion);

router
  .route('/:id')
  .all(loginRequired)
  .all(checkExist(Promotion))
  .get(GetPromotion)
  .put(UpdatePromotion)
  .delete(DeletePromotion);

export default router;
