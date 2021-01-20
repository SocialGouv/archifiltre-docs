const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const glob = require("glob");
require("dotenv").config();

const isDev = (mode) => mode === "development";

/**
 * Return code that will compute the path of the folder containing worker file,
 * which is the electron/dist folder in development mode, and the app.asar/electron/dist
 * folder in production mode
 * Note : the prod mode method gives archifiltre/electron/electron/dist folder in dev mode
 * @param mode - the build mode. "development" or "production".
 * @returns {string}
 */
const workerRootFolder = (mode) =>
  isDev(mode)
    ? JSON.stringify(path.join(__dirname, "electron/dist/"))
    : "require('path').join(require('electron').remote.app.getAppPath(),'/electron/dist/')";

const workers = glob
  .sync("./**/*.fork.ts")
  .map((filePath) => [
    path.basename(filePath, path.extname(filePath)),
    filePath,
  ])
  .reduce((acc, [name, filePath]) => {
    acc[name] = filePath;
    return acc;
  }, {});

module.exports = (env, argv = {}) => ({
  devServer: {
    compress: true,
    contentBase: path.resolve(__dirname, "electron/dist"),
    hot: true,
    inline: false,
    port: 8000,
    writeToDisk: (name) => /(\.(fork)\.[jt]s|main\.js|\.node)$/.test(name),
  },
  devtool: isDev(argv.mode) ? "eval-cheap-module-source-map" : false,

  entry: {
    app: "./src/app.tsx",
    ...workers,
  },
  externals: {
    "iconv-lite": "require('iconv-lite')",
  },

  module: {
    rules: [
      {
        include: path.resolve(__dirname, "src"),
        loader: "awesome-typescript-loader",
        test: /\.[tj]sx?$/,
      },
      {
        enforce: "pre",
        include: path.resolve(__dirname, "src"),
        loader: "source-map-loader",
        test: /\.js$/,
      },
      {
        loader: "node-loader",
        test: /.node$/,
      },
      {
        include: [
          path.resolve(__dirname, "src/css"),
          path.resolve(__dirname, "static/fonts"),
        ],
        test: /\.css$|\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["./node_modules"],
              },
            },
          },
        ],
      },
      {
        include: path.resolve(__dirname, "node_modules/react-notifications"),
        test: /\.svg/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 1024,
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        include: [
          path.resolve(__dirname, "static/fonts"),
          path.resolve(__dirname, "node_modules/react-notifications/lib/fonts"),
        ],
        test: /\.(otf|ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1000,
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
      {
        include: [path.resolve(__dirname, "static/imgs")],
        loader: "url-loader",
        test: /\.(png|jpg)$/,
      },
    ],
  },

  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "electron/dist"),
    pathinfo: false,
    publicPath: isDev(argv.mode) ? "/" : "./",
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: ["node_modules/fswin"],
    }),
    ...(isDev(argv.mode)
      ? []
      : [new CopyWebpackPlugin({ patterns: ["static"] })]),
    new HtmlWebpackPlugin({
      excludeChunks: Object.keys(workers),
      filename: "index.html",
      inject: "head",
      template: "static/index.html",
    }),
    new webpack.DefinePlugin({
      ARCHIFILTRE_SITE_URL: JSON.stringify(process.env.ARCHIFILTRE_SITE_URL),
      AUTOLOAD: argv.autoload
        ? JSON.stringify(argv.autoload)
        : JSON.stringify(""),
      FORCE_TRACKING: JSON.stringify(process.env.FORCE_TRACKING === "true"),
      MATOMO_APPLICATION_ID: process.env.MATOMO_APPLICATION_ID,
      MATOMO_URL: JSON.stringify(process.env.MATOMO_URL),
      MODE: JSON.stringify(argv.mode || "development"),
      SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
      STATIC_ASSETS_PATH: isDev(argv.mode)
        ? JSON.stringify("static/")
        : "__dirname",
      WORKER_ROOT_FOLDER: workerRootFolder(argv.mode),
      WRITE_DEBUG: process.env.WRITE_DEBUG,
    }),
  ],

  resolve: {
    cacheWithContext: false,
    extensions: [".mjs", ".ts", ".tsx", ".js", ".json"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    symlinks: false,
  },

  target: "electron-main",
});
