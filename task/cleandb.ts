import dotenv from 'dotenv';
import connectMongo from '../server/core/db';
import { Logger } from '../server/core/util';

dotenv.config();

(async () => {
  const connection = await connectMongo();
  if (connection) {
    try {
      await connection.dropCollection('items');
      Logger.info('items collection dropped.');
    } catch (err) {
      Logger.info('items collection not found, continue.');
    }

    // drop organization
    try {
      await connection.dropCollection('transactions');
      Logger.info('transactions collection dropped.');
    } catch (err) {
      Logger.info('transactions collection not found, continue.');
    }
  } else {
    throw new Error('Connection failed.');
  }
  process.exit();
})();
