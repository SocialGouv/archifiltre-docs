const path = require("path");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
require("dotenv").config();

const isDev = (mode) => mode === "development";

module.exports = (env, argv = {}) => ({
  devServer: {
    writeToDisk: true,
  },
  devtool: isDev(argv.mode) ? "eval-cheap-module-source-map" : "source-map",
  entry: {
    main: "./src/electron-main.ts",
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
    path: path.resolve(__dirname, "dist"),
    pathinfo: false,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({
      REACT_DEV_TOOLS_PATH: JSON.stringify(
        process.env.REACT_DEV_TOOLS_PATH || ""
      ),
      SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
      SENTRY_MINIDUMP_URL: JSON.stringify(process.env.SENTRY_MINIDUMP_URL),
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
    modules: ["node_modules"],
  },
  target: "electron-main",
});
