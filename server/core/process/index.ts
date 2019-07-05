import { ChildProcess, spawn } from 'child_process';

export function startPythonWorker(): Promise<ChildProcess> {
  let finish = false;
  return new Promise((resolve, reject) => {
    console.log('Spawn python consumers.');
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
        console.log(`Python process exited with code ${code}`);
      }
    });

    if (ps.stdout) {
      ps.stdout.on('data', (chunk) => {
        console.log(chunk.toString());
        if (!finish) {
          finish = true;
          resolve(ps);
        }
      });
    }

    ps.on('error', (err) => {
      console.error(err);
    });

    return ps;
  });
}
