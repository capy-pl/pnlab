import dotenv from 'dotenv';
import passportJWT from 'passport-jwt';

import User from '../models/User';

dotenv.config();

const { SECRET_KEY }  = process.env;
const { Strategy, ExtractJwt } = passportJWT;

export default new Strategy(
  {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
  },
  (jwtPayload, cb) => {
    const { sub } = jwtPayload;
    return User.findById(sub)
      .populate('org')
      .exec()
      .then(user => {
        cb(null, user);
      })
      .catch(err => {
        cb(err);
      });
  });
