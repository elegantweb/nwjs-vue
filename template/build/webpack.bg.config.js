process.env.BABEL_ENV = 'bg'

const path = require('path')
const webpack = require('webpack')
const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin')

const utils = require('./utils')
const { dependencies } = require('../package')

const isProduction = process.env.NODE_ENV === 'production'

let config = {
  devtool: '#cheap-module-eval-source-map',
  target: 'node-webkit',
  entry: {
    bg: path.join(__dirname, '../src/bg/bg')
  },
  output: {
    path: path.join(__dirname, '../dist/bg'),
    filename: '[name].js'
  },
  externals: [
    // Externalize all dependencies inside of the application directory.
    function (context, request, callback) {
      if (dependencies && dependencies[request]) {
        return callback(null, 'commonjs ' + request)
      } else {
        callback()
      }
    }
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.join(__dirname, '../src/bg')
    }
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

if (!isProduction) {
  config.plugins.push(
    new webpack.DefinePlugin({
      '__static': JSON.stringify(path.join(__dirname, '../static'))
    })
  )
}

if (isProduction) {
  config.devtool = false
  config.plugins.push(
    new BabelMinifyWebpackPlugin({}, {
      comments: false
    }),
    new webpack.DefinePlugin({
      '__static': '"dist/static"'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = config
