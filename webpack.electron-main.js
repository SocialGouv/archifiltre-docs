const path = require("path");

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
