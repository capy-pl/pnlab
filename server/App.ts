import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import path from 'path';
import compression from 'compression';

import { command, Logger } from './core/util';
import serveGzip from './core/middleware/serveGzip';

// import routes
import API from './api';
import webpack from 'webpack';

const app = express();

app.use(helmet());

if (!(process.env.NODE_ENV === 'test')) {
  app.use(morgan('combined'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

command.parse(process.argv);

// Use webpack-dev-middleware to watch on client files.
if (command.watch) {
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotModuleMiddleware = require('webpack-hot-middleware');
  const { clientConfig } = require('../config/webpack.dev');

  if (typeof BUNDLED !== 'undefined') {
    clientConfig.entry.client[0] = CLIENT_PATH;
    clientConfig.resolve.alias.Component = COMPNENT_PATH;
  }

  const compiler = webpack(clientConfig as webpack.Configuration);
  app.use(
    devMiddleware(compiler, {
      logLevel: 'error',
      noInfo: true,
      publicPath: clientConfig.output.publicPath,
      writeToDisk: true,
    }),
  );

  app.use(
    hotModuleMiddleware(compiler, {
      noInfo: true,
      quiet: true,
    }),
  );
}

const templatePath =
  typeof BUNDLED === 'undefined'
    ? path.resolve(__dirname, '..', 'dist', 'server', 'templates')
    : path.resolve(__dirname, 'templates');

app.set('views', templatePath);

// Configure template engine.
nunjucks.configure(templatePath, {
  autoescape: true,
  express: app,
});

// Serve static files.
const staticPath =
  typeof BUNDLED === 'undefined'
    ? path.resolve(__dirname, '..', 'dist', 'client')
    : path.resolve(__dirname, '..', 'client');

app.get('*.js', serveGzip('text/javascript', staticPath));
app.get('*.css', serveGzip('text/css', staticPath));
app.use('/static/', express.static(staticPath));

// // Serve media files.
app.use(
  '/static',
  express.static(path.resolve(__dirname, 'static'), {
    immutable: true,
    maxAge: '0.5y',
  }),
);

app.use(compression());

// Register Router
app.use('/api/auth', API.Auth);
app.use('/api/user', API.User);
app.use('/api/report', API.Report);
app.use('/api/promotion', API.Promotion);
app.use('/api/analysis', API.Analysis);
app.use('/api/upload', API.Upload);

app.use((err: Error, req: express.Request, res: express.Response, next) => {
  Logger.error(err);
  res.status(500).send({ message: 'Internal Server Error.' });
  return;
});

app.get('/*', (req, res) => {
  res.render('index.html');
});

export default app;
