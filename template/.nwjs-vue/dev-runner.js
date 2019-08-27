process.env.NODE_ENV = 'development'

const path = require('path')
const { spawn } = require('child_process')
const npmWhich = require('npm-which')(__dirname)
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')

const webpackMainConfig = require('./webpack.main.config')
const webpackBgConfig = require('./webpack.bg.config')

const runPath = npmWhich.sync('run')

let nwProcess = null
let nwRestarting = false

let mainHotMiddleware = null

function createMainServer (config, callback) {
  // add dev-client file to webpack, so we will be able to handle hot middleware commands on browser
  config.entry.main = [path.join(__dirname, 'dev-client')].concat(config.entry.main)

  const compiler = webpack(config)

  mainHotMiddleware = webpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2500
  })

  // force page reload when html-webpack-plugin template changes
  compiler.hooks.compilation.tap('compilation', (compilation) => {
    compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('html-webpack-plugin-after-emit', (data, cb) => {
      mainHotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  compiler.hooks.done.tap('done', (stats) => {
    console.log(stats.toString({ chunks: false, colors: true }))
  })

  return new WebpackDevServer(compiler, {
    quiet: true,
    disableHostCheck: true,
    before (app, ctx) {
      app.use(mainHotMiddleware)
      ctx.middleware.waitUntilValid(() => {
        callback()
      })
    }
  })
}

function createBgServer (config, callback) {
  const compiler = webpack(config)

  compiler.hooks.watchRun.tapAsync('watch-run', (compilation, cb) => {
    console.log('Compiling background script...')
    mainHotMiddleware.publish({ action: 'compiling' })
    cb()
  })

  compiler.watch({}, (err, stats) => {
    if (err) console.error(err)
    else {
      console.log(stats.toString({ chunks: false, colors: true }))
      mainHotMiddleware.publish({ action: 'compiled' })
      if (nwProcess) nwRestarting = true
      callback()
    }
  })
}

function createNwProcess (callback) {
  nwProcess = spawn(runPath, ['.'])

  nwProcess.stdout.on('data', (data) => {
    const msg = data.toString('utf8')
    console.log(msg)
    if (msg.includes('Launching NW.js app')) {
      callback()
    }
  })

  nwProcess.stderr.on('data', (data) => {
    const msg = data.toString('utf8')
    console.error(msg)
  })

  nwProcess.on('close', () => {
    if (nwRestarting) startNw().then(() => { nwRestarting = false })
    else process.exit()
  })
}

function startMain () {
  return new Promise((resolve, reject) => {
    createMainServer(webpackMainConfig, resolve).listen(9080)
  })
}

function startBg () {
  return new Promise((resolve, reject) => {
    createBgServer(webpackBgConfig, resolve)
  })
}

function startNw () {
  return new Promise((resolve, reject) => {
    createNwProcess(resolve)
  })
}

async function main () {
  await Promise.all([startMain(), startBg()])
  startNw()
}

main()
