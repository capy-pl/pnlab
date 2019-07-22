import { Router } from 'express';

import { loginRequired } from '../../core/auth';
import { checkExist } from '../../core/middleware';
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
  .post(AddCategory);

router
  .route('/:id')
  .all(loginRequired, checkExist(Category))
  .get(GetCategory)
  .put(ModifyCategory)
  .delete(DeleteCategory);

export default router;
