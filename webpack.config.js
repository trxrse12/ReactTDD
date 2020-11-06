const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: "./src/index.js",
  mode: 'development',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node-modules/,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: [".js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  }
};