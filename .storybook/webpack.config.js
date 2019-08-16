const {
  clientConfig
} = require('../config/webpack.dev');

module.exports = ({
  config,
  mode
}) => {
  config.module = clientConfig.module;
  config.resolve = clientConfig.resolve;
  return config;
};