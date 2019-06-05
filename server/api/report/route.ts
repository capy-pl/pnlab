import { Router } from 'express';
import { loginRequired } from '../../core/auth';

import {
  SearchItem,
  GetConditions,
  AddReport,
  GetReport
} from './controller';

const router = Router();

router.get('/searchItem', SearchItem);
router.get('/conditions', loginRequired, GetConditions);

router
  .route('/')
  .all(loginRequired)
  .post(AddReport);

router
  .route('/:id')
  .all(loginRequired)
  .get(GetReport)

export default router;
