const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: path.join(__dirname, '/src/index.ts'),
  output: {
    filename: 'app.js',
    path: __dirname,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
};