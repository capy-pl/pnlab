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
 * @response 409 Conflict.
 * @response 422 Missing params.
 * @response 201 Created.
 */
export async function SignUp(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
): Promise<void | e.Response> {
  const { email, password } = req.body as SignUpRequestBody;
  if (!(email && password)) {
    res.status(422).send({ message: 'Lack of email or password.' });
  } else {
    const duplicate = await User.findOne({ email });
    if (duplicate) {
      return res.status(409).send({ message: 'Email already exists.' });
    }
    const user = new User({ email });
    await user.setPassword(password);
    await user.save();
    res.status(201).send({
      message: 'created.',
    });
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
 */
export async function LogIn(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
): Promise<void> {
  const { email, password } = req.body as LogInRequestBody;
  if (!(email && password)) {
    res.status(422).json({ message: 'email or password not provided.' });
  } else {
    try {
      const userInstance = await User.findOne({ email });
      if (!userInstance) {
        throw new Error('user not exist');
      }
      const { user, error } = await userInstance.authenticate(password);
      if (error) {
        throw error;
      }
      const token = jwt.sign({ sub: user.id }, SECRET_KEY as string, {
        expiresIn: process.env.EXPIRED_IN,
      });
      res.json({ token });
    } catch (error) {
      Logger.error(error);
      res.status(401).json({ message: 'Email or password error.' });
    }
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
 */
export function Validation(req: e.Request, res: e.Response, next: e.NextFunction): void {
  res.status(204).send();
}
