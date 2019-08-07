const dotenv = require('dotenv');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

dotenv.config();

const baseConfig = {
  mode: 'development',
  devtool: "cheap-module-eval-source-map",
  stats: {
    errors: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};

const clientConfig = {
  entry:{
    client: 
    [
       path.resolve(__dirname, '..', 'client', 'ts', 'index.tsx'),
      'webpack-hot-middleware/client?reload=true&&noInfo=true',
    ]
  },
  resolve: {
    alias: {
      Component: path.resolve(__dirname, '..', 'client', 'ts', 'components'),
    },
    extensions: ['.ts', '.js', '.jsx', '.tsx', '.json', '.scss', '.css'],
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist', 'client'),
    filename: '[name].bundle.js',
    publicPath: '/static'
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        options: {
          // This equals to 512 KB.
          limit: 524288,
        }
      },
      {
        test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
        loader: 'file-loader',
      },
    ]
  },
  externals: {
    jquery: 'jQuery',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify(process.env.NODE_ENV),
    })
  ]
};

const serverConfig = {
  target: 'node',
  entry: {
    server: path.resolve(__dirname, '..', 'server', 'index.ts')
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [{
        test: /\.ts/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist', 'server'),
    filename: '[name].bundle.js',
  },
  externals: [nodeExternals()]
};

module.exports = {
  clientConfig: Object.assign({}, baseConfig, clientConfig),
  serverConfig: Object.assign({}, baseConfig, serverConfig)
};
