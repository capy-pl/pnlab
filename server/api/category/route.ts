import { Router } from 'express';

import { loginRequired } from '../../core/auth';
import {
  AddCategory,
  GetCategories,
} from './controller';

const router = Router();

router
  .route('/')
  .all(loginRequired)
  .get(GetCategories)
  .post(AddCategory);

export default router;
