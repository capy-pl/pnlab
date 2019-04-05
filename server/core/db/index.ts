import mongoose from 'mongoose';
import connectMongo from './mongo';

export default async function connect(): Promise<mongoose.Connection | undefined> {
  return await connectMongo();
}
