import { Router } from 'express';
import { loginRequired } from '../../core/auth';

import {
  SearchItem,
  GetConditions,
  AddReport
} from './controller';

const router = Router();

router.get('/searchItem', SearchItem);
router.get('/conditions', loginRequired, GetConditions);

router
  .route('/')
  .all(loginRequired)
  .post(AddReport);

export default router;
