const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    app: ["./server/src/server.js"]
  },
  target: "node",
  mode: 'development',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node-modules/,
      loader: 'babel-loader'
    },{
      test: /\.graphql$/,
      exclude: /node-modules/,
      loader: 'raw-loader'
    }]
  },
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "dist/server"),
    filename: "bundle.js"
  },
};