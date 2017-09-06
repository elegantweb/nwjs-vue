process.env.NODE_ENV = 'production'

const fs = require('fs-extra')
const path = require('path')
const { spawn } = require('child_process')
const webpack = require('webpack')

const manifest = require('../app/package')
const webpackMainConfig = require('./webpack.main.config')

const builderPath = path.resolve(__dirname, '../node_modules/.bin/build')

function cleanDist () {
  return fs.emptydir(path.resolve(__dirname, '../dist'))
}

function cleanBuild () {
  return fs.emptydir(path.resolve(__dirname, '../releases'))
}

function distManifest () {
  manifest['main'] = 'main/index.html'
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
