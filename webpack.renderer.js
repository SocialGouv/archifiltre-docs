const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

/**
 * Return code that will compute the path of the folder containing worker file,
 * which is the electron/dist folder in development mode, and the app.asar/electron/dist
 * folder in production mode
 * Note : the prod mode method gives archifiltre/electron/electron/dist folder in dev mode
 * @param mode - the build mode. "development" or "production".
 * @returns {string}
 */
const workerRootFolder = mode =>
  mode === "development"
    ? JSON.stringify(path.join(__dirname, "electron/dist/"))
    : "require('path').join(require('electron').remote.app.getAppPath(),'/electron/dist/')";

module.exports = (env, argv = {}) => ({
  devtool: "source-map",
  entry: {
    app: "./src/app.js"
  },

  externals: {
    "iconv-lite": "require('iconv-lite')"
  },
  plugins: [
    new CopyWebpackPlugin(["static"]),
    new HtmlWebpackPlugin({
      inject: "head",
      filename: "index.html",
      template: "static/index.html",
      excludeChunks: ["stats"]
    }),
    new webpack.DefinePlugin({
      MODE: JSON.stringify(argv.mode || "development"),
      STATIC_ASSETS_PATH:
        argv.mode === "development" ? JSON.stringify("static/") : "__dirname",
      AUTOLOAD: argv.autoload
        ? JSON.stringify(argv.autoload)
        : JSON.stringify(""),
      MATOMO_APPLICATION_ID: process.env.MATOMO_APPLICATION_ID,
      MATOMO_URL: JSON.stringify(process.env.MATOMO_URL),
      FORCE_TRACKING: !!JSON.stringify(process.env.FORCE_TRACKING),
      ARCHIFILTRE_SITE_URL: JSON.stringify(process.env.ARCHIFILTRE_SITE_URL),
      SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN)
    })
  ],

  target: "electron-renderer",

  devServer: {
    writeToDisk: name => /(\.fork\.[jt]s|main\.bundle\.js)$/.test(name),
    contentBase: path.resolve(__dirname, "electron/dist"),
    port: 8000,
    compress: true,
    hot: true,
    inline: false
  },

  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".mjs", ".ts", ".tsx", ".js", ".jsx", ".json"]
  },

  module: {
    rules: [
      // This loader won't work if it is not defined before the typescript loader
      {
        test: /\.fork\.[jt]s$/,
        use: {
          loader: "webpack-fork-loader",
          options: {
            publicPath: workerRootFolder(argv.mode),
            evalPath: true
          }
        }
      },
      {
        test: /\.[tj]sx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre"
      },
      {
        test: /\.css$|\.scss$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["./node_modules"]
              }
            }
          }
        ]
      },
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" }
      },
      {
        test: /\.svg/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 1024,
              name: "[name].[ext]"
            }
          },
          "image-webpack-loader"
        ]
      },
      {
        test: /\.(otf|ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1000,
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      }
    ]
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "electron/dist")
  }
});
