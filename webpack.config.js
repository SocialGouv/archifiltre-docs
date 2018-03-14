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
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}

