import connectMongo from './mongo';

export default async function connect(): Promise<void> {
  await connectMongo();
}
