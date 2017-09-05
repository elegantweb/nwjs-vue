process.env.BABEL_ENV = 'main'

var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin')

var utils = require('./utils')
var { dependencies } = require('./../app/package')
var vueLoaderConfig = require('./vue-loader.config')

var isProduction = process.env.NODE_ENV === 'production'

var config = {
  devtool: '#cheap-module-eval-source-map',
  target: 'node-webkit',
  entry: {
    main: path.join(__dirname, '../app/main')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  externals: [
    function (context, request, callback) {
      if (undefined === dependencies[request]) {
        callback()
      } else {
        return callback(null, 'commonjs ' + request)
      }
    }
  ],
  module: {
    rules: [
      ...utils.styleLoaders({
        sourceMap: !isProduction,
        extract: isProduction
      }),
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'img/[name].[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(__dirname, '../app'),
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new ExtractTextWebpackPlugin('style.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../app/index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]
}

if (isProduction) {
  config.devtool = false
  config.plugins.push(
    new BabelMinifyWebpackPlugin(),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = config
