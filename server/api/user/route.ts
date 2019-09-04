import { Router } from 'express';

import { loginRequired } from '../../core/auth';
import { Info } from './controller';

const router = Router();

router
  .route('/info')
  .all(loginRequired)
  .get(Info);

export default router;
