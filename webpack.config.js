const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FlowWebpackPlugin = require('flow-webpack-plugin')

module.exports = {
  entry: {
    app: './src/app.js'
  },

  plugins: [
    new CopyWebpackPlugin(['static']),
  ],

  // devtool: 'source-map',

  devServer: {
    contentBase: './dist',
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
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
              localIdentName: '[name]__[local]___[hash:base64:5]',
            }
          }
        ]
      }
    ]
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}

