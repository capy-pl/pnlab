import { Router } from 'express';

import { loginRequired } from '../../auth';
import {
  Info,
} from './controller';

const router = Router();

router.get('/info', loginRequired, Info);

export default router;
