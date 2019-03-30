import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const { MONGO_PORT, MONGO_DB_NAME } = process.env;

export default async function connectMongo(): Promise<void> {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:${MONGO_PORT}/${MONGO_DB_NAME}`, {
      useNewUrlParser: true,
    });
    console.log('Successfully connect to mongodb.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
