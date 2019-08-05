import * as express from 'express';
import * as mongoose from 'mongoose';

declare module 'express' {
  interface Request {
    object?: mongoose.Document | null;
  }
}
