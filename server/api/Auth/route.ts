import { Router } from 'express';

import passport from '../../auth';
import {
  LogIn,
  SignUp,
  Validation,
} from './controller';

const router = Router();

router.post('/login', LogIn);
router.post('/signup', SignUp);
router.get('/validate', passport.authenticate('jwt', { session: false }), Validation);

export default router;
