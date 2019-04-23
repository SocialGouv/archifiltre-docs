const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const FlowWebpackPlugin = require("flow-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
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
        test: /\.css$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            query: {
              modules: true,
              localIdentName: "[name]__[local]___[hash:base64:5]"
            }
          }
        ]
      },
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" }
      }
    ]
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
