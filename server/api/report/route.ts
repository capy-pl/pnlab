import { Router } from 'express';
import { loginRequired } from '../../core/auth';
import Report from '../../models/Report';
import { httpMethodNotSupport, Pager } from '../../core/middleware';
import {
  AddReport,
  GetConditions,
  GetReport,
  GetReports,
  SearchItem,
} from './controller';

const router = Router();

router.get('/searchItem', SearchItem);
router.get('/conditions', loginRequired, GetConditions);

router
  .route('/')
  .all(loginRequired)
  .post(AddReport)
  .get(GetReports)
  .all(httpMethodNotSupport);

router
  .route('/page')
  .all(loginRequired)
  .get(Pager(Report))
  .all(httpMethodNotSupport);

router
  .route('/:id')
  .all(loginRequired)
  .get(GetReport)
  .all(httpMethodNotSupport);

export default router;
