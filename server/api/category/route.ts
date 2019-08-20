import { Router } from 'express';

import { loginRequired } from '../../core/auth';
import { checkExist, httpMethodNotSupport } from '../../core/middleware';
import { Category } from '../../models';
import {
  AddCategory,
  DeleteCategory,
  GetCategories,
  GetCategory,
  ModifyCategory,
} from './controller';

const router = Router();

router
  .route('/')
  .all(loginRequired)
  .get(GetCategories)
  .post(AddCategory)
  .all(httpMethodNotSupport);

router
  .route('/:id')
  .all(loginRequired, checkExist(Category))
  .get(GetCategory)
  .put(ModifyCategory)
  .delete(DeleteCategory)
  .all(httpMethodNotSupport);

export default router;
