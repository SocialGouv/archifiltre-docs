const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  mode: "development",
  entry: {
    main: "./src/electron-main.js"
  },
  target: "electron-main",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "electron/dist")
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  node: {
    __dirname: false
  },
  devServer: {
    writeToDisk: true
  },
  plugins: [
    new webpack.DefinePlugin({
      SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
      SENTRY_MINIDUMP_URL: JSON.stringify(process.env.SENTRY_MINIDUMP_URL),
      REACT_DEV_TOOLS_PATH: process.env.REACT_DEV_TOOLS_PATH
        ? JSON.stringify(process.env.REACT_DEV_TOOLS_PATH)
        : '""'
    })
  ],
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "awesome-typescript-loader"
      }
    ]
  }
};
