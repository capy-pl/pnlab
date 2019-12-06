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
  (async function() {
    const webpack = await import('webpack');
    const devMiddleware = await import('webpack-dev-middleware');
    const { clientConfig } = await import('../config/webpack.dev');
    const hotModuleMiddleware = await import('webpack-hot-middleware');

    if (typeof BUNDLED !== 'undefined') {
      clientConfig.entry.client[0] = CLIENT_PATH;
      clientConfig.resolve.alias.Component = COMPNENT_PATH;
    }
    const compiler = webpack.default(clientConfig);
    app.use(
      devMiddleware.default(compiler, {
        logLevel: 'error',
        publicPath: clientConfig.output.publicPath,
        stats: {
          colors: true,
        },
      }),
    );

    app.use(
      hotModuleMiddleware.default(compiler, {
        publicPath: clientConfig.output.publicPath,
      }),
    );
  })();
}

// Serve static files.
if (typeof BUNDLED === 'undefined') {
  const staticPath = path.resolve(__dirname, '..', 'dist', 'client');
  app.get('*.js', serveGzip('text/javascript', staticPath)); // !
  app.get('*.css', serveGzip('text/css', staticPath)); // !
  app.use('/static/', express.static(staticPath));
} else {
  const staticPath = path.resolve(__dirname, '..', 'client');
  app.get('*.js', serveGzip('text/javascript', staticPath)); // !
  app.get('*.css', serveGzip('text/css', staticPath)); // !
  app.use('/static/', express.static(staticPath));
}

// // Serve media files.
app.use(
  '/static',
  express.static(path.resolve(__dirname, 'static'), {
    immutable: true,
    maxAge: '0.5y',
  }),
);

app.use(compression());
app.set('views', path.resolve(__dirname, 'templates'));

// Configure template engine.
nunjucks.configure(path.resolve(__dirname, 'templates'), {
  autoescape: true,
  express: app,
});

// Register Router
app.use('/api/auth', API.Auth);
app.use('/api/user', API.User);
app.use('/api/report', API.Report);
app.use('/api/promotion', API.Promotion);
app.use('/api/analysis', API.Analysis);
app.use('/api/upload', API.Upload);

app.get('/*', (req, res) => {
  res.render('index.html');
});

app.use((err: Error, req: express.Request, res: express.Response) => {
  Logger.error(err);
  res.status(500);
});

export default app;
