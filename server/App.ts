import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import path from 'path';

// import routes
import API from './api';
import { Logger } from './core/util';

dotenv.config();

const app = express();

app.use(helmet());
app.use(compression());
if (!(process.env.NODE_ENV === 'test')) {
  app.use(morgan('combined'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', 'server/templates');

// Configure template engine.
nunjucks.configure('server/templates', {
  autoescape: true,
  express: app,
});

// Use webpack-dev-middleware to watch on client files.
if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const { clientConfig } = require('../config/webpack.dev');
  const compiler = webpack(clientConfig);
  app.use(
    devMiddleware(compiler, {
      logLevel: 'error',
      publicPath: clientConfig.output.publicPath,
      stats: {
        colors: true,
      },
    }),
  );

  const hotModuleMiddleware = require('webpack-hot-middleware');
  app.use(
    hotModuleMiddleware(compiler, {
      publicPath: clientConfig.output.publicPath,
    }),
  );
}

// Serve static files.
app.use('/static/', express.static(path.resolve(__dirname, '..', 'dist', 'client')));

// // Serve media files.
app.use(
  '/',
  express.static('static', {
    immutable: true,
    maxAge: '0.5y',
  }),
);

// Register Router
app.use('/api/auth', API.Auth);
app.use('/api/user', API.User);
app.use('/api/report', API.Report);
app.use('/api/category', API.Category);
app.use('/api/promotion', API.Promotion);
app.use('/api/analysis', API.Analysis);

app.get('/*', (req, res) => {
  res.render('index.html');
});

app.use((err: Error, req: express.Request, res: express.Response) => {
  Logger.error(err);
  res.status(500);
});

export default app;
