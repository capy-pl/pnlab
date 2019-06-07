import { Router } from 'express';

import { loginRequired } from '../../core/auth';
import {
  AddGroups,
  GetGroups,
  Info,
} from './controller';

const router = Router();

router
  .route('/info')
  .all(loginRequired)
  .get(Info);

router
  .route('/group')
  .all(loginRequired)
  .get(GetGroups)
  .post(AddGroups);

export default router;
