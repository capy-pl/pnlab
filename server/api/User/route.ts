import { Router } from 'express';

import passport from '../../auth';
import {
  Info,
} from './controller';

const router = Router();

router.get('/info', passport.authenticate('jwt', { session: false }), Info);

export default router;
