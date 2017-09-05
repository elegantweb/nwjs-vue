process.env.NODE_ENV = 'production'

var fs = require('fs-extra')
var path = require('path')
var { spawn } = require('child_process')
var webpack = require('webpack')

var manifest = require('./../app/package')
var webpackMainConfig = require('./webpack.main.config')

var builderPath = path.resolve(__dirname, '../node_modules/.bin/build')

function cleanDist () {
  return fs.emptydir(path.resolve(__dirname, '../dist'))
}

function cleanBuild () {
  return fs.emptydir(path.resolve(__dirname, '../releases'))
}

function distManifest () {
  manifest['main'] = 'index.html'
  return fs.outputJson(path.resolve(__dirname, '../dist/package.json'), manifest)
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
      .all([distManifest(), distNodeModules(), packMain()])
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
