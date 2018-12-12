const path = require('path');

module.exports = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  entry: path.join(__dirname, '/example/app.tsx'),
  output: {
    filename: 'app.js',
    path: __dirname,
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'ts-loader'
      }]
    }]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"]
  },
  devServer: {
    overlay: true,
    stats: "minimal",
  }
};