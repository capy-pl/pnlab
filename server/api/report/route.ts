import { Router } from 'express';
import { loginRequired } from '../../core/auth';
import Report from '../../models/Report';
import { checkExist, httpMethodNotSupport, Pager } from '../../core/middleware';
import {
  AddReport,
  GetConditions,
  GetCommunityInfo,
  GetReport,
  GetReports,
  SearchItem,
  DeleteReport,
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
  .delete(DeleteReport)
  .all(httpMethodNotSupport);

router
  .route('/:id/community/:communityId')
  .all(loginRequired, checkExist(Report, { communities: 1 }))
  .get(GetCommunityInfo)
  .all(httpMethodNotSupport);

export default router;
