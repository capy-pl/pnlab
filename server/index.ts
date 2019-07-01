import dotenv from 'dotenv';
import http from 'http';

import app from './App';
import dbConnect from './core/db';
import amqpConnect from './core/mq';
import { startPythonWorker } from './core/process';
import startSocketServer from './core/ws';

// Inject environment variable from .env
dotenv.config();

const server = http.createServer(app);
const pyConsumers = startPythonWorker();

server.listen(process.env.PORT, async () => {
  await Promise.all([amqpConnect(), dbConnect()]);
  startSocketServer(server, () => {
    console.log('Websocket server is listening.');
  });
  console.log(`Server is available on 127.0.0.1:${process.env.PORT}`);
});

server.on('error', (err) => {
  console.error(err);
});

server.on('close', () => {
  pyConsumers.kill();
});
