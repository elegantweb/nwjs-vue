const path = require('path')
const { spawn } = require('child_process')
const npmWhich = require('npm-which')(__dirname)
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')

const webpackMainConfig = require('./webpack.main.config')

const runPath = npmWhich.sync('run')

let nwProcess
let nwRestarting = false
let hotMiddleware

function startMain () {
  return new Promise((resolve, reject) => {
    const config = webpackMainConfig

    config.entry.main = [path.join(__dirname, 'dev-client')].concat(config.entry.main)

    const compiler = webpack(config)

    hotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
      heartbeat: 2500
    })

    // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({ action: 'reload' })
        cb()
      })
    })

    compiler.plugin('done', (stats) => {
      console.log(stats.toString({ chunks: false, colors: true }))
    })

    const server = new WebpackDevServer(compiler, {
      contentBase: path.join(__dirname, '../app/main'),
      quiet: true,
      before (app, ctx) {
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
  nwProcess = spawn(runPath, ['app'], { stdio: 'inherit' })

  nwProcess.on('close', () => {
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
