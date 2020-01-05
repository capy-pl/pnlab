/// <reference path="./index.d.ts" />

import dotenv from 'dotenv';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { ChildProcess } from 'child_process';
import app from './App';
import dbConnect from './core/db';
import amqpConnect from './core/mq';
import { createFolders, syncdb } from './core/tasks';
import { startPythonWorker } from './core/process';
import { command, Logger } from './core/util';
import startSocketServer from './core/ws';

// Inject environment variable from .env
dotenv.config();

command.parse(process.argv);

const httpServer = http.createServer(app);

// const httpsServer = https.createServer(
//   {
//     key: fs.readFileSync(path.resolve(__dirname, '..', 'certificates', 'rootCA.key')),
//     cert: fs.readFileSync(path.resolve(__dirname, '..', 'certificates', 'rootCA.pem')),
//   },
//   app,
// );

let pyConsumers: ChildProcess;

(async function() {
  await Promise.all([amqpConnect(), dbConnect(), createFolders()]);
  await syncdb();

  if (command.python) {
    try {
      pyConsumers = startPythonWorker();
    } catch (error) {
      Logger.error(error);
      process.exit(1);
    }
  }

  httpServer.listen(process.env.PORT, () => {
    startSocketServer(httpServer);
    Logger.info(`HTTP server is available on 127.0.0.1:${process.env.PORT}`);
  });

  // httpsServer.listen(process.env.HTTPS_PORT, async () => {
  //   startSocketServer(httpsServer);
  //   Logger.info(`HTTP server is available on 127.0.0.1:${process.env.HTTPS_PORT}`);
  // });

  httpServer.on('error', (err) => {
    Logger.error(err);
  });

  // httpsServer.on('error', (err) => {
  //   Logger.error(err);
  // });
})();

process.on('exit', () => {
  if (pyConsumers) {
    pyConsumers.kill();
  }
});
