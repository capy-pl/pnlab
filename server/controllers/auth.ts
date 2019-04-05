import dotenv from 'dotenv';
import e from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const { SECRET_KEY }  = process.env;

import User from '../models/User';

/**
 * Signup a user.
 * @api {get} /auth/signup
 * @apiName SignUp
 * @apiGroup Auth
 * @apiParam email {String} User's email.
 * @apiParam password {String} User's password.
 */
export async function SignUp(req: e.Request, res: e.Response, next: e.NextFunction): Promise<void> {
  const { email, password } = req.body;
  if (!(email && password)) {
    res.status(400).send({ message: 'lack of email or password.'});
  } else {
    const user = new User({ email });
    await user.setPassword(password);
    try {
      await user.save();
      res.status(201).send({
        message: 'created.',
      });
    } catch (err) {
      res.status(400).end('User already exists.');
    }
  }
}

/**
 * Log in the user and send a JWT token if authenticated.
 * @api {get} /auth/login
 * @apiName LogIn
 * @apiGroup Auth
 * @apiParam email {String} User's email.
 * @apiParam password {String} User's password.
 */
export async function LogIn(req: e.Request, res: e.Response, next: e.NextFunction): Promise<void> {
  const { email, password } = req.body;
  if (!(email && password)) {
    res.status(400).json({ message: 'email or password not provided.' });
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
    } catch (err) {
      res.status(400).json({ message: 'Email or password error.' });
    }
  }
}

export function Validation(req: e.Request, res: e.Response, next: e.NextFunction): void {
  res.status(204).send();
}
