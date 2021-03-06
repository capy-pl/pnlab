const dotenv = require('dotenv');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

dotenv.config();

const baseConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  stats: {
    errors: true,
  },
};

const clientConfig = {
  entry: {
    client: [
      path.resolve(__dirname, '..', 'client', 'ts', 'index.tsx'),
      'webpack-hot-middleware/client',
    ],
  },
  resolve: {
    alias: {
      Component: path.resolve(__dirname, '..', 'client', 'ts', 'components'),
    },
    extensions: ['.ts', '.js', '.jsx', '.tsx', '.json', '.scss', '.css'],
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist', 'client'),
    filename: '[name].js',
    publicPath: '/static/',
  },
  module: {
    rules: [{
        test: /\.tsx?/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              filename: '[name].css',
              hmr: true,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        options: {
          // This equals to 512 KB.
          limit: 524288,
        },
      },
      {
        test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
        loader: 'file-loader',
      },
    ],
  },
  externals: {
    jquery: 'jQuery',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify('development'),
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[hash].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'server', 'templates', 'index.html'),
      filename: path.resolve(
        __dirname,
        '..',
        'dist',
        'server',
        'templates',
        'index.html',
      ),
      inject: 'head',
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: 'client-report.html',
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },
};

const serverConfig = {
  target: 'node',
  devtool: 'inline-source-map',
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: {
    server: path.resolve(__dirname, '..', 'server', 'index.ts'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [{
      test: /\.[jt]s/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, ],
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist', 'server'),
    filename: '[name].bundle.js',
  },
  externals: [nodeExternals()],
  plugins: [
    new CopyPlugin([{
      from: path.resolve(__dirname, '..', 'server', 'static'),
      to: path.resolve(__dirname, '..', 'dist', 'server', 'static'),
    }, ]),
    new webpack.DefinePlugin({
      BUNDLED: JSON.stringify(true),
      CLIENT_PATH: JSON.stringify(
        path.resolve(__dirname, '..', 'client', 'ts', 'index.tsx'),
      ),
      COMPNENT_PATH: JSON.stringify(
        path.resolve(__dirname, '..', 'client', 'ts', 'components'),
      ),
      STATIC: JSON.stringify(path.resolve(__dirname, '..', 'dist', 'client')),
    }),
  ],
};

module.exports = {
  clientConfig: Object.assign({}, baseConfig, clientConfig),
  serverConfig: Object.assign({}, baseConfig, serverConfig),
};