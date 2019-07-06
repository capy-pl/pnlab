import amqplib from 'amqplib';
import { Logger } from '../util';
let channel: amqplib.Channel;

export default async function amqpConnect(): Promise<void> {
  Logger.log('Connect to RabbitMQ...');
  const connection = await amqplib.connect('amqp://localhost');
  channel = await connection.createChannel();
  channel.assertQueue('pn', {
    durable: true,
  });
  Logger.log('Connection Established.');
}

export function getChannel(): amqplib.Channel {
  return channel;
}
