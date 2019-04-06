import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Register all module
import '../../models';

dotenv.config();

const { MONGO_PORT, MONGO_DB_NAME } = process.env;

export default async function connectMongo(): Promise<mongoose.Connection | undefined> {
  try {
    const connection = await mongoose.connect(`mongodb://127.0.0.1:${MONGO_PORT}/${MONGO_DB_NAME}`, {
      useNewUrlParser: true,
    });
    console.log('Successfully connect to mongodb.');
    return connection.connection;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  return undefined;
}
