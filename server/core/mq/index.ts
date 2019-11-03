import amqplib from 'amqplib';
import { Logger } from '../util';
let channel: amqplib.Channel;

export default async function amqpConnect(): Promise<void> {
  Logger.info('Connect to RabbitMQ...');
  const connection = await amqplib.connect(`amqp://${process.env.RABBIT_MQ_ADDRESS}`);
  channel = await connection.createChannel();
  channel.assertQueue('pn', {
    durable: true,
  });
  Logger.info('RabbitMQ connection Established.');
}

export function getChannel(): amqplib.Channel {
  return channel;
}
