const path = require('path')
const { spawn } = require('child_process')
const npmWhich = require('npm-which')(__dirname)
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')

const webpackMainConfig = require('./webpack.main.config')

const runPath = npmWhich.sync('run')

function createServer (config, callback) {
  // add dev-client file to webpack, so we will be able to handle hot middleware commands on browser
  config.entry.main = [path.join(__dirname, 'dev-client')].concat(config.entry.main)

  const compiler = webpack(config)

  const hotMiddleware = webpackHotMiddleware(compiler, {
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

  return new WebpackDevServer(compiler, {
    quiet: true,
    before (app, ctx) {
      app.use(hotMiddleware)
      ctx.middleware.waitUntilValid(() => {
        callback()
      })
    }
  })
}

function startMain () {
  return new Promise((resolve, reject) => {
    createServer(webpackMainConfig, resolve).listen(9080)
  })
}

function startNw () {
  const nwProcess = spawn(runPath, ['app'], { stdio: 'inherit' })

  nwProcess.on('close', () => {
    process.exit()
  })
}

async function main () {
  await Promise.all([startMain()])
  startNw()
}

main()
