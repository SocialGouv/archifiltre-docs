const path = require("path");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
require("dotenv").config();

module.exports = {
  devServer: {
    writeToDisk: true,
  },
  entry: {
    main: "./src/electron-main.js",
  },
  module: {
    rules: [
      {
        include: path.resolve(__dirname, "src"),
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
        test: /\.[tj]sx?$/,
      },
    ],
  },
  node: {
    __dirname: false,
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "electron/dist"),
    pathinfo: false,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({
      REACT_DEV_TOOLS_PATH: process.env.REACT_DEV_TOOLS_PATH
        ? JSON.stringify(process.env.REACT_DEV_TOOLS_PATH)
        : '""',
      SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
      SENTRY_MINIDUMP_URL: JSON.stringify(process.env.SENTRY_MINIDUMP_URL),
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  target: "electron-main",
};
