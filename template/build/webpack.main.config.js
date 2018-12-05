process.env.BABEL_ENV = 'main'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const utils = require('./utils')
const { label, dependencies } = require('../package')

const isProduction = process.env.NODE_ENV === 'production'

let config = {
  devtool: '#cheap-module-eval-source-map',
  target: 'node-webkit',
  entry: {
    main: path.join(__dirname, '../src/main/main')
  },
  output: {
    path: path.join(__dirname, '../dist/main'),
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
      '@': path.join(__dirname, '../src/main'),
      // see: https://vuejs.org/v2/guide/installation.html#Terms
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new VueLoaderPlugin(),
    new ExtractTextWebpackPlugin('style.css'),
    new HtmlWebpackPlugin({
      title: label,
      filename: 'index.html',
      template: path.join(__dirname, '../src/main/index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      }
    })
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
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../static'),
        to: path.join(__dirname, '../dist/static'),
        ignore: ['.*']
      }
    ]),
    // see: http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = config
