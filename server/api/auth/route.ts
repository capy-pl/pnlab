import { Router } from 'express';
import { loginRequired } from '../../core/auth';
import {
  LogIn,
  SignUp,
  Validation,
} from './controller';

const router = Router();

router.post('/login', LogIn);
router.post('/signup', SignUp);
router.get('/validate', loginRequired, Validation);

export default router;
