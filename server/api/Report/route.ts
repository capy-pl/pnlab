import { Router } from 'express';
import { loginRequired } from '../../auth';

import {
  SearchItem,
  GetConditions
} from './controller';

const router = Router();

router.get('/searchItem', SearchItem);
router.get('/conditions', loginRequired, GetConditions);

export default router;
