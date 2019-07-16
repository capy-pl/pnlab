import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import nunjucks from 'nunjucks';

// import routes
import API from './api';

dotenv.config();

const app = express();

app.use(helmet());
app.use(compression());
if (!(process.env.NODE_ENV === 'test')) {
  app.use(morgan('combined'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('templates'));

// Configure template engine.
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

// Use webpack-dev-middleware to watch on client files.
if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const {
    clientConfig,
  } = require('../webpack.config.js');
  const compiler = webpack(clientConfig);
  app.use(devMiddleware(compiler, {
    logLevel: 'error',
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
    },
  }));

  const hotModuleMiddleware = require('webpack-hot-middleware');
  app.use(hotModuleMiddleware(compiler, {
      publicPath: clientConfig.output.publicPath,
  }));
}

// Serve static files.
app.use('/static/', express.static('dist/client/'));

// // Serve media files.
app.use('/', express.static('static', {
  immutable: true,
  maxAge: '0.5y',
}));

app.get('/', (req, res) => {
  res.render('index.html');
});

// Register Router
app.use('/auth', API.Auth);
app.use('/user', API.User);
app.use('/report', API.Report);
app.use('/category', API.Category);
app.use('/promotion', API.Promotion);

app.use((
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
    console.error(err.stack);
    res.status(500);
  });

export default app;
