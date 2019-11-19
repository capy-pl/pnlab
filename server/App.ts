import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import path from 'path';
import { command, Logger } from './core/util';

// import routes
import API from './api';

const app = express();

app.use(helmet());
app.use(compression());
if (!(process.env.NODE_ENV === 'test')) {
  app.use(morgan('combined'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.resolve(__dirname, 'templates'));

// Configure template engine.
nunjucks.configure(path.resolve(__dirname, 'templates'), {
  autoescape: true,
  express: app,
});

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
  app.use('/static/', express.static(path.resolve(__dirname, '..', 'dist', 'client')));
} else {
  app.use('/static/', express.static(path.resolve(__dirname, '..', 'client')));
}

// // Serve media files.
app.use(
  '/static',
  express.static(path.resolve(__dirname, 'static'), {
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
app.use('/api/upload', API.Upload);

app.get('/*', (req, res) => {
  res.render('index.html');
});

app.use((err: Error, req: express.Request, res: express.Response) => {
  Logger.error(err);
  res.status(500);
});

export default app;
