import { ChildProcess, spawn } from 'child_process';
import { Logger } from '../util';

export function startPythonWorker(): Promise<ChildProcess> {
  let finish = false;
  return new Promise((resolve, reject) => {
    Logger.log('Spawn python consumers.');
    const ps = spawn(
      'python',
      ['./index.py'],
      {
        env: process.env,
      });

    ps.on('exit', (code) => {
      if (code === 1) {
        reject(new Error(`Python process exited with code ${code}`));
      } else {
        Logger.log(`Python process exited with code ${code}`);
      }
    });

    if (ps.stdout) {
      ps.stdout.on('data', (chunk) => {
        Logger.log(chunk.toString().replace('\n', ''));
        if (!finish) {
          finish = true;
          resolve(ps);
        }
      });
    }

    ps.on('error', (err) => {
      Logger.error(err);
    });

    return ps;
  });
}
