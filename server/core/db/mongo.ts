import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { Logger } from '../util';

// Register all module
import '../../models';

dotenv.config();

const {
  MONGO_DB_ADDRESS,
  MONGO_PORT,
  MONGO_DB_NAME,
  MONGO_DB_PASS,
  MONGO_DB_USER,
} = process.env;

export default async function connectMongo(): Promise<mongoose.Connection | undefined> {
  try {
    const connection = await mongoose.connect(
      `mongodb://${MONGO_DB_ADDRESS}:${MONGO_PORT}/${MONGO_DB_NAME}`,
      {
        useNewUrlParser: true,
        user: MONGO_DB_USER,
        pass: MONGO_DB_PASS,
      },
    );
    Logger.info('Successfully connect to mongodb.');
    return connection.connection;
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
  return undefined;
}

export async function connectTestMongo(): Promise<mongoose.Connection | undefined> {
  try {
    const connection = await mongoose.connect(
      `mongodb://${MONGO_DB_ADDRESS}:${MONGO_PORT}/${MONGO_DB_NAME}_test`,
      {
        useNewUrlParser: true,
        user: MONGO_DB_USER,
        pass: MONGO_DB_PASS,
      },
    );
    Logger.info('Successfully connect to mongodb.');
    return connection.connection;
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
  return undefined;
}
