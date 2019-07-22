 // tslint:disable-next-line: no-reference
 /// <reference path="./index.d.ts" /> #
import dotenv from 'dotenv';
import http from 'http';

import { ChildProcess } from 'child_process';
import app from './App';
import dbConnect from './core/db';
import amqpConnect from './core/mq';
import { startPythonWorker } from './core/process';
import { Logger } from './core/util';
import startSocketServer from './core/ws';

// Inject environment variable from .env
dotenv.config();

const server = http.createServer(app);
let pyConsumers: ChildProcess;

server.listen(process.env.PORT, async () => {
  try {
    pyConsumers = await startPythonWorker();
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
  await Promise.all([amqpConnect(), dbConnect()]);
  startSocketServer(server, () => {
    Logger.log('Websocket server is listening.');
  });
  Logger.log(`Server is available on 127.0.0.1:${process.env.PORT}`);
});

server.on('error', (err) => {
  Logger.error(err);
});

server.on('close', () => {
  pyConsumers.kill();
});
