import { ChildProcess, spawn } from 'child_process';

export function startPythonWorker(): ChildProcess {
  console.log('Spawn python consumers.');
  const ps = spawn(
  'python',
  ['./pyscript/index.py'],
  {
    env: process.env,
  });

  ps.on('exit', (code) => {
    console.log(`Python process exited with code ${code}`);
  });

  if (ps.stdout) {
    ps.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
  }

  ps.on('err', (err) => {
    console.error(err);
  });

  return ps;
}
