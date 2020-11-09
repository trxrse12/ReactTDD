// by default, if I specify no output, the bundle will be saved to /dist/main.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node-modules/,
      loader: 'babel-loader'
    }]
  }
};