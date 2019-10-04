import * as express from 'express';
import * as mongoose from 'mongoose';
import { string } from 'prop-types';

declare module 'express' {
  interface Request {
    object?: mongoose.Document | null;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      VERSION: string;
      MONGO_DB_NAME: string;
      MONGO_PORT: number;
      PORT: number;
      SECRET_KEY: string;
      EXPIRED_IN: string;
      HOME: string;
    }
  }
  const STATIC: string;
  const BUILDED: boolean;
  const CLIENT_PATH: string;
  const COMPNENT_PATH: string;
}
