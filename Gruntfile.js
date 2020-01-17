module.exports = function (grunt) {
  const devConfig = require('./config/webpack.dev');
  const prodConfig = require('./config/webpack.prod');

  const eslintConfig = {
    options: {
      configFile: './package.json',
      fix: true,
      quiet: false,
    },
    client: {
      files: {
        src: ['client/ts/**/*.ts', 'client/ts/**/*.tsx', 'spec/client/**/*.ts'],
      },
    },
    server: {
      files: {
        src: ['server/**/*.ts', 'spec/server/**/*.ts'],
      },
    },
  };

  const webpackConfig = {
    serverWatch: Object.assign({
        watch: true,
      },
      devConfig.serverConfig,
    ),
    clientWatch: Object.assign({
        watch: true,
      },
      devConfig.clientConfig,
    ),
    server: devConfig.serverConfig,
    client: devConfig.clientConfig,
    serverProduction: prodConfig.serverConfig,
    clientProduction: prodConfig.clientConfig,
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
      command: 'node dist/server/server.bundle.js',
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
      command: 'ts-node task/initdb.ts',
      stdout: true,
      exitCode: 0,
    },
    populate: {
      command: 'ts-node task/populateSchemaValue.ts',
      stdout: true,
      exitCode: 0,
    },
    cleandb: {
      command: 'ts-node task/cleandb.ts',
      stdout: true,
      exitCode: 0,
    },
    'clean:client': {
      command: 'rm -rf dist/client',
    },
    'clean:server': {
      command: 'rm -rf dist/server',
    },
    clean: {
      command: 'rm -rf dist',
    },
  };

  grunt.initConfig({
    eslint: eslintConfig,
    webpack: webpackConfig,
    exec: execConfig,
  });

  const production = grunt.option('production');

  grunt.task.registerTask('clean:client', ['exec:clean:client']);
  grunt.task.registerTask('clean:server', ['exec:clean:server']);
  grunt.task.registerTask('watch:client', ['webpack:clientWatch']);
  grunt.task.registerTask('build:server', () => {
    if (production) {
      grunt.task.run(['eslint:server', 'webpack:serverProduction']);
    } else {
      grunt.task.run(['eslint:server', 'webpack:server']);
    }
  });
  grunt.task.registerTask('build:client', () => {
    if (production) {
      grunt.task.run(['eslint:client', 'webpack:clientProduction']);
    } else {
      grunt.task.run(['eslint:client', 'webpack:client']);
    }
  });
  grunt.task.registerTask('build', () => {
    grunt.task.run(['eslint']);
    if (production) {
      grunt.task.run(['webpack:clientProduction', 'webpack:serverProduction']);
    } else {
      grunt.task.run(['webpack:client', 'webpack:server']);
    }
  });
  grunt.task.registerTask('test', ['eslint', 'exec:test']);
  grunt.task.registerTask('test:client', ['eslint:client', 'exec:testClient']);
  grunt.task.registerTask('test:server', ['eslint:server', 'exec:testServer']);
  grunt.task.registerTask('cleandb', ['exec:cleandb']);
  grunt.task.registerTask('clean', ['exec:clean']);
  grunt.task.registerTask('initdb', ['exec:initdb']);
  grunt.task.registerTask('populate', ['exec:populate']);
  grunt.task.registerTask('upgrade', ['exec:initdb', 'exec:populate']);
  grunt.task.registerTask('run', ['build:client', 'exec:run']);
  grunt.task.registerTask('prodRun', ['build', 'exec:prodRun']);
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-exec');
};