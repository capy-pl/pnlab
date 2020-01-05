import dotenv from 'dotenv';
import e from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const { SECRET_KEY } = process.env;

import { Logger } from '../../core/util';
import User from '../../models/User';

interface SignUpRequestBody {
  email: string;
  password: string;
}

/**
 * Signup a user.
 * @api /auth/signup
 * @method GET
 * @apiName SignUp
 * @apiGroup Auth
 * @apiParam email {String} User's email.
 * @apiParam password {String} User's password.
 * @response 201 Created.
 * @response 400 Missing params.
 * @response 409 Conflict.
 */
export async function SignUp(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
): Promise<void | e.Response> {
  const { email, password } = req.body as SignUpRequestBody;
  if (!(email && password)) {
    res.status(400).send({ message: 'Lack of email or password.' });
    return;
  }

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  if (!(trimmedEmail && trimmedPassword)) {
    res.status(400).send({ message: 'Lack of email or password.' });
    return;
  }

  const duplicate = await User.findOne({ email: trimmedEmail });
  if (duplicate) {
    return res.status(409).send({ message: 'Email already exists.' });
  }

  try {
    const user = new User({ email: trimmedEmail });
    await user.setPassword(trimmedPassword);
    await user.save();
    res.status(201).send({
      message: 'Created.',
    });
  } catch (err) {
    next(err);
  }
}

interface LogInRequestBody {
  email: string;
  password: string;
}

/**
 * Log in the user and send a JWT token if authenticated.
 * @api /auth/login
 * @method POST
 * @apiName LogIn
 * @apiGroup Auth
 * @apiParam email {String} User's email.
 * @apiParam password {String} User's password.
 * @response 200 Login success.
 * @response 400 Missing params.
 * @response 401 Login fail.
 */
export async function LogIn(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
): Promise<void> {
  const { email, password } = req.body as LogInRequestBody;
  if (!(email && password)) {
    res.status(400).json({ message: 'Email or password not provided.' });
    return;
  }
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (!(trimmedEmail && trimmedPassword)) {
    res.status(400).json({ message: 'Email or password not provided.' });
    return;
  }

  try {
    const userInstance = await User.findOne({ email: trimmedEmail });
    if (!userInstance) {
      Logger.error(new Error('Email or password error.'));
      res.status(401).json({ message: 'Email or password error.' });
      return;
    }

    const { user, error } = await userInstance.authenticate(trimmedPassword);

    if (error) {
      Logger.error(error);
      res.status(401).json({ message: 'Email or password error.' });
      return;
    }

    const token = jwt.sign({ sub: user.id }, SECRET_KEY as string, {
      expiresIn: process.env.EXPIRED_IN,
    });
    res.json({ token });
  } catch (error) {
    return next(error);
  }
}

/**
 * Validate user's jwt token. If the user has jwt token in their browser memory,
 * need to validate whether the token is valid in order to decide whether use should
 * log in again. The function check Authorization header.
 * @api /auth/validate
 * @method GET
 * @apiName Validate
 * @apiGroup Auth
 * @response 201 No content.
 */
export function Validation(req: e.Request, res: e.Response): void {
  res.status(204).end();
}
