const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const env = process.env.NODE_ENV;

module.exports = (env, argv) => ({
  devtool: "source-map",
  entry: {
    app: "./src/app.js",
    react: ["react", "react-dom"],
    immutable: ["immutable"]
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
      MODE: JSON.stringify(argv.mode)
    })
  ],

  target: "electron-renderer",

  devServer: {
    contentBase: "./dist",
    https: true,
    port: 8000,
    compress: true,
    hot: false,
    inline: false
  },

  optimization: {
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: true
  },

  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader"
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
              includePaths: ["./node_modules"]
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
