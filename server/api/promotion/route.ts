import { Router } from 'express';

import { loginRequired } from '../../core/auth';
import {
  AddPromotion,
  GetPromotions,
} from './controller';

const router = Router();

router
  .route('/')
  .all(loginRequired)
  .get(GetPromotions)
  .post(AddPromotion);

export default router;
