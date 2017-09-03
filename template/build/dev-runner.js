var fs = require('fs')
var path = require('path')
var { spawn } = require('child_process')
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var webpackHotMiddleware = require('webpack-hot-middleware')

var webpackMainConfig = require('./webpack.main.config')

var runnerPath = path.resolve(__dirname, '../node_modules/.bin/run')

function startMain () {
  return new Promise((resolve, reject) => {
    var config = webpackMainConfig

    config.entry.main = [path.join(__dirname, 'dev-client')].concat(config.entry.main)

    var compiler = webpack(config)

    var hotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
      heartbeat: 2500
    })

    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({ action: 'reload' })
        cb()
      })
    })

    compiler.plugin('done', (stats) => {
      console.log(stats.toString({ chunks: false, colors: true }))
    })

    server = new WebpackDevServer(compiler, {
      contentBase: path.join(__dirname, 'app'),
      quiet: true,
      setup (app, ctx) {
        app.use(hotMiddleware)
        ctx.middleware.waitUntilValid(() => {
          resolve()
        })
      }
    })

    server.listen(9080)
  })
}

function startNw () {
  spawn(runnerPath, ['app'], { stdio: 'inherit' }).on('close', () => {
    process.exit()
  })
}

Promise
  .all([startMain()])
  .then(() => {
    startNw()
  })
  .catch((err) => {
    console.error(err)
  })
