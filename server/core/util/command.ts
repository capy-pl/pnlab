import commander from 'commander';

const program = new commander.Command();

program
  .version(process.env.VERSION as string)
  .option(
    '-p, --python',
    `
Open python task queue as a subprocess. The option is convenient when developing).
`,
  )
  .option(
    '-w, --watch',
    `
Watch front end files's change.
`,
  );

program.version;
export default program;
