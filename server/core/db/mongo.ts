import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { Logger } from '../util';

// Register all module
import '../../models';

dotenv.config();

const { MONGO_PORT, MONGO_DB_NAME } = process.env;

export default async function connectMongo(): Promise<mongoose.Connection | undefined> {
  try {
    const connection = await mongoose.connect(`mongodb://127.0.0.1:${MONGO_PORT}/${MONGO_DB_NAME}`, {
      useNewUrlParser: true,
    });
    Logger.log('Successfully connect to mongodb.');
    return connection.connection;
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
  return undefined;
}

export async function connectTestMongo(): Promise<mongoose.Connection | undefined> {
  try {
    const connection = await mongoose.connect(`mongodb://127.0.0.1:${MONGO_PORT}/${MONGO_DB_NAME}_test`, {
      useNewUrlParser: true,
    });
    Logger.log('Successfully connect to mongodb.');
    return connection.connection;
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
  return undefined;
}
