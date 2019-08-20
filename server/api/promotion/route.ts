import { Router } from 'express';

import { loginRequired } from '../../core/auth';
import { checkExist, httpMethodNotSupport } from '../../core/middleware';
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
  .post(AddPromotion)
  .all(httpMethodNotSupport);

router
  .route('/:id')
  .all(loginRequired, checkExist(Promotion))
  .get(GetPromotion)
  .put(UpdatePromotion)
  .delete(DeletePromotion)
  .all(httpMethodNotSupport);

export default router;
