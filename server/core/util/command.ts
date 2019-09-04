import commander from 'commander';

const program = new commander.Command();

program.version(process.env.VERSION as string).option(
  '-d, --disable-python',
  `
Do not open python script as subprocess. During front development and production\
in docker(will seperate python process in another docker container).
`,
);

export default program;
