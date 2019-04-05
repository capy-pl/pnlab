import passport from 'passport';
import User from '../models/User';

import JWTStrategy from './jwtStrategy';

passport.use(JWTStrategy);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export default passport;
