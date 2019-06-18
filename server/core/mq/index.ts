import amqplib from 'amqplib';

let channel: amqplib.Channel;

export async function amqpConnect(): Promise<void> {
  console.log('Connect to RabbitMQ...');
  const connection = await amqplib.connect('amqp://localhost');
  channel = await connection.createChannel();
  channel.assertQueue('pn', {
    durable: true,
  });
  console.log('Connection Established.');
}

export function getChannel(): amqplib.Channel {
  return channel;
}
