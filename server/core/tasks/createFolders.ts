import fs from 'fs';
import path from 'path';

import { Logger } from '../util';

function makeRootFolder(): Promise<void> {
  return new Promise((resolve) => {
    fs.mkdir(path.resolve(process.env.HOME, 'pnlab'), (err) => {
      if (err) {
        Logger.info('Project root folder already exists.');
      } else {
        Logger.info('Project root folder created.');
      }
      resolve();
    });
  });
}

function makeLoggingFolder(): Promise<void> {
  return new Promise((resolve) => {
    fs.mkdir(path.resolve(process.env.HOME, 'pnlab', 'logs'), (err) => {
      if (err) {
        Logger.info('Project logs folder already exists.');
      } else {
        Logger.info('Project logs folder created.');
      }
      resolve();
    });
  });
}

function makeFileFolder(): Promise<void> {
  return new Promise((resolve) => {
    fs.mkdir(path.resolve(process.env.HOME, 'pnlab', 'files'), (err) => {
      if (err) {
        Logger.info('Project files folder already exists.');
      } else {
        Logger.info('Project files folder created.');
      }
      resolve();
    });
  });
}

function makeTempFileFolder(): Promise<void> {
  return new Promise((resolve) => {
    fs.mkdir(path.resolve(process.env.HOME, 'pnlab', 'temp'), (err) => {
      if (err) {
        Logger.info('Project temp files folder already exists.');
      } else {
        Logger.info('Project temp files folder created.');
      }
      resolve();
    });
  });
}

// The function will create necessary folder.
export async function createFolders(): Promise<void> {
  await makeRootFolder();
  await Promise.all([makeLoggingFolder(), makeFileFolder(), makeTempFileFolder()]);
}
