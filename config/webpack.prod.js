const dotenv = require('dotenv');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

dotenv.config();

const baseConfig = {
  mode: 'production',
  stats: {
    errors: true,
  },
  optimization: {
    minimizer: [new TerserPlugin({})],
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
  },
};

const clientConfig = {
  entry: {
    client: path.resolve(__dirname, '..', 'client', 'ts', 'index.tsx'),
  },
  resolve: {
    alias: {
      Component: path.resolve(__dirname, '..', 'client', 'ts', 'components'),
    },
    extensions: ['.ts', '.js', '.jsx', '.tsx', '.json', '.scss', '.css'],
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist', 'client'),
    filename: '[contenthash].js',
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
    new OptimizeCSSAssetsPlugin({}),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
    new CompressionPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify('production'),
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
      minify: true,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      reportFilename: 'client-report.html',
    }),
  ],
};

const serverConfig = {
  target: 'node',
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
    }],
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
      },
      {
        from: path.resolve(__dirname, '..', '.env'),
        to: path.resolve(__dirname, '..', 'dist'),
      },
      {
        from: path.resolve(__dirname, '..', 'package.json'),
        to: path.resolve(__dirname, '..', 'dist', 'package.json'),
      },
    ]),
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