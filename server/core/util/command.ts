import commander from 'commander';

const program = new commander.Command();

program.version(process.env.VERSION as string).option(
  '-d, --disable-python',
  `
Do not open python script as subprocess. When front development and production, \
may need to use this option to speed up initial startup.`,
);

export default program;
