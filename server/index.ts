// tslint:disable-next-line: no-reference
/// <reference path="./index.d.ts" /> #
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { ChildProcess } from 'child_process';
import app from './App';
import dbConnect from './core/db';
import amqpConnect from './core/mq';
import { startPythonWorker } from './core/process';
import { command, Logger } from './core/util';
import startSocketServer from './core/ws';

// Inject environment variable from .env
dotenv.config();

command.parse(process.argv);

const server = http.createServer(app);
let pyConsumers: ChildProcess;

try {
  fs.mkdirSync(path.resolve(__dirname, '..', 'logs'));
  Logger.info('Logs directory created.');
} catch (err) {
  Logger.info('logs directory already exists. Skip...');
}

server.listen(process.env.PORT, async () => {
  if (!command.disablePython) {
    try {
      pyConsumers = await startPythonWorker();
    } catch (error) {
      Logger.error(error);
      process.exit(1);
    }
  }

  await Promise.all([amqpConnect(), dbConnect()]);
  startSocketServer(server, () => {
    Logger.info('Websocket server is listening.');
  });
  Logger.info(`Server is available on 127.0.0.1:${process.env.PORT}`);
});

server.on('error', (err) => {
  Logger.error(err);
});

server.on('close', () => {
  if (pyConsumers) {
    pyConsumers.kill();
  }
});
