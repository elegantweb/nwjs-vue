process.env.NODE_ENV = 'production'

var fs = require('fs-extra')
var path = require('path')
var { spawn } = require('child_process')
var webpack = require('webpack')

var webpackMainConfig = require('./webpack.main.config.js')

var builderPath = path.resolve(__dirname, '../node_modules/.bin/build')

function cleanDist () {
  return fs.emptydir(path.resolve(__dirname, '../dist'))
}

function cleanBuild () {
  return fs.emptydir(path.resolve(__dirname, '../releases'))
}

function distPackageJson () {
  return new Promise((resolve, reject) => {
    fs.readJson(path.resolve(__dirname, '../app/package.json'), (err, data) => {
      if (err) reject(err)
      else {
        data['main'] = 'index.html'
        fs.outputJson(path.resolve(__dirname, '../dist/package.json'), data, (err) => {
          if (err) reject(err)
          else resolve()
        })
      }
    })
  })
}

function distNodeModules () {
  return fs.copy(path.resolve(__dirname, '../app/node_modules'), path.resolve(__dirname, '../dist/node_modules'))
}

function packMain () {
  return pack(webpackMainConfig)
}

function pack (config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) reject(err)
      else if (stats.hasErrors()) reject(stats.toString({ chunks: false, colors: true }))
      else resolve()
    })
  })
}

function build () {
  spawn(builderPath, ['--linux', '--x64', 'dist'], { stdio: 'inherit' })
}

Promise
  .all([cleanDist(), cleanBuild()])
  .then(() => {
    Promise
      .all([distPackageJson(), distNodeModules(), packMain()])
      .then(() => {
        build()
      })
      .catch((err) => {
        console.error(err)
      })
  })
  .catch((err) => {
    console.error(err)
  })
