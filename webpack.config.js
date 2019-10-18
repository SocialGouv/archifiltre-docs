const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

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
        argv.mode === "development" ? JSON.stringify(".") : "__dirname"
    })
  ],

  target: "electron-renderer",

  devServer: {
    contentBase: path.resolve(__dirname, "electron/dist"),
    port: 8000,
    compress: true,
    hot: true,
    inline: false
  },

  optimization: {
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: true
  },

  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },

  module: {
    rules: [
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
