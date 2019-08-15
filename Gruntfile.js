module.exports = function (grunt) {
  const devConfig = require('./config/webpack.dev');
  const prodConfig = require('./config/webpack.prod');
  const eslintConfig = {
    options: {
      configuration: './.eslintrc',
      fix: true,
      quiet: true,
    },
    client: {
      files: {
        src: [
          'client/ts/**/*.ts',
          'client/ts/**/*.tsx',
          'spec/client/**/*.ts'
        ]
      }
    },
    server: {
      files: {
        src: [
          'server/**/*.ts',
          'spec/server/**/*.ts'
        ]
      }
    },
  };

  const webpackConfig = {
    serverWatch: Object.assign({
      watch: true
    }, devConfig.serverConfig),
    clientWatch: Object.assign({
      watch: true
    }, devConfig.clientConfig),
    server: devConfig.serverConfig,
    client: devConfig.clientConfig,
    prodServer: prodConfig.serverConfig,
    prodClient: prodConfig.clientConfig,
  };

  const execConfig = {
    test: {
      command: 'jest',
      stdout: true,
      exitCode: 0,
    },
    run: {
      command: 'nodemon',
    },
    prodRun: {
      command: 'node dist/server/server.bundle.js'
    },
    testClient: {
      command: 'jest spec/client',
      stdout: true,
      exitCode: 0,
    },
    testServer: {
      command: 'jest spec/server',
      stdout: true,
      exitCode: 0,
    },
    initdb: {
      command: 'ts-node scripts/initdb.ts',
      stdout: true,
      exitCode: 0,
    },
  };

  grunt.initConfig({
    eslint: eslintConfig,
    webpack: webpackConfig,
    exec: execConfig,
  });

  grunt.task.registerTask('watch:client', ['webpack:clientWatch']);
  grunt.task.registerTask('build:client', ['webpack:client']);
  grunt.task.registerTask('build:server', ['webpack:server']);
  grunt.task.registerTask('build:prodServer', ['webpack:prodServer']);
  grunt.task.registerTask('build:prodClient', ['webpack:prodClient']);
  grunt.task.registerTask('build', ['eslint', 'webpack:client', 'webpack:server']);
  grunt.task.registerTask('test', ['eslint', 'exec:test']);
  grunt.task.registerTask('test:client', ['eslint:client', 'exec:testClient']);
  grunt.task.registerTask('test:server', ['eslint:server', 'exec:testServer']);
  grunt.task.registerTask('initdb', ['exec:initdb']);
  grunt.task.registerTask('run', ['build:client', 'exec:run']);
  grunt.task.registerTask('prodRun', ['build', 'exec:prodRun']);
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-exec');
}