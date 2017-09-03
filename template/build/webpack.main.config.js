process.env.BABEL_ENV = 'main'

var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin')

var { dependencies } = require('./../app/package')

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
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: process.env.NODE_ENV === 'production',
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
            stylus: 'vue-style-loader!css-loader!stylus-loader'
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css'],
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

if (process.env.NODE_ENV === 'production') {
  config.devtool = ''
  config.plugins.push(
    new BabelMinifyWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  )
}

module.exports = config
