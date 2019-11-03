import { Router } from 'express';
import { loginRequired } from '../../core/auth';
import { checkExist, httpMethodNotSupport, Pager } from '../../core/middleware';
import { Analysis } from '../../models';
import {
  AddAnalysis,
  AddAnalysisComment,
  DeleteAnalysis,
  DeleteAnalysisComment,
  GetAnalyses,
  GetAnalysis,
  GetAnalysisComment,
  ModifyAnalysis,
  ModifyAnalysisComment,
} from './controller';

const router = Router();

router
  .route('/')
  .all(loginRequired)
  .get(GetAnalyses)
  .post(AddAnalysis)
  .all(httpMethodNotSupport);

router
  .route('/page')
  .all(loginRequired)
  .get(Pager(Analysis))
  .all(httpMethodNotSupport);

router
  .route('/:id')
  .all(loginRequired, checkExist(Analysis))
  .get(GetAnalysis)
  .put(ModifyAnalysis)
  .delete(DeleteAnalysis)
  .all(httpMethodNotSupport);

router
  .route('/:id/comment/')
  .all(loginRequired, checkExist(Analysis))
  .post(AddAnalysisComment)
  .all(httpMethodNotSupport);

router
  .route('/:id/comment/:comment_id')
  .all(loginRequired, checkExist(Analysis))
  .get(GetAnalysisComment)
  .put(ModifyAnalysisComment)
  .delete(DeleteAnalysisComment)
  .all(httpMethodNotSupport);

export default router;
