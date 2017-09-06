process.env.NODE_ENV = 'production'

const fs = require('fs-extra')
const path = require('path')
const { spawn } = require('child_process')
const webpack = require('webpack')

const webpackMainConfig = require('./webpack.main.config')

const builderPath = path.resolve(__dirname, '../node_modules/.bin/build')

function cleanDist () {
  return fs.emptydir(path.resolve(__dirname, '../dist'))
}

function cleanBuild () {
  return fs.emptydir(path.resolve(__dirname, '../releases'))
}

function distManifest () {
  return new Promise((resolve, reject) => {
    fs.readJson(path.resolve(__dirname, '../app/package.json'), (err, data) => {
      if (err) reject(err)
      else {
        data['main'] = 'main/index.html'
        fs.outputJson(path.resolve(__dirname, '../dist/package.json'), data, (err) => {
          if (err) reject(err)
          else resolve()
        })
      }
    })
  })
}

function distNodeModules () {
  return new Promise((resolve, reject) => {
    let src = path.resolve(__dirname, '../app/node_modules')
    if (fs.existsSync(src)) {
      fs.copy(src, path.resolve(__dirname, '../dist/node_modules'), (err) => {
        if (err) reject(err)
        else resolve()
      })
    } else {
      resolve()
    }
  })
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
