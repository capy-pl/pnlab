import { Router } from 'express';

import {
  LogIn,
  SignUp,
} from '../controllers/auth';

const router = Router();

router.post('/login', LogIn);
router.post('/signup', SignUp);

export default router;
