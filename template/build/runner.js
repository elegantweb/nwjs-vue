process.env.NODE_ENV = 'production'

const fs = require('fs-extra')
const path = require('path')
const { spawnSync } = require('child_process')
const npmWhich = require('npm-which')(__dirname)
const webpack = require('webpack')

const webpackMainConfig = require('./webpack.main.config')
const webpackBgConfig = require('./webpack.bg.config')

const { build: buildConfig } = require('../package')

const buildPath = npmWhich.sync('build')

function cleanDist () {
  return fs.emptydir(path.resolve(__dirname, '../', './dist'))
}

function cleanBuild () {
  return fs.emptydir(path.resolve(__dirname, '../', buildConfig.output))
}

function distManifest () {
  return new Promise((resolve, reject) => {
    fs.readJson(path.resolve(__dirname, '../package.json'), (err, data) => {
      if (err) reject(err)
      else {
        data.main = 'main/index.html'
        data['bg-script'] = 'bg/bg.js'
        data.build.output = path.relative('../dist', path.resolve('../', data.build.output))
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
    const src = path.resolve(__dirname, '../node_modules')
    if (!fs.existsSync(src)) resolve()
    else {
      fs.copy(src, path.resolve(__dirname, '../dist/node_modules'), { dereference: true }, (err) => {
        if (err) reject(err)
        else resolve()
      })
    }
  })
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

function packMain () {
  return pack(webpackMainConfig)
}

function packBg () {
  return pack(webpackBgConfig)
}

function build () {
  buildConfig.nwPlatforms.forEach((os) => {
    buildConfig.nwArchs.forEach((arch) => {
      spawnSync(buildPath, [`--${os}`, `--${arch}`, 'dist'], { stdio: 'inherit' })
    })
  })
}

async function main () {
  await Promise.all([cleanDist(), cleanBuild()])
  await Promise.all([distManifest(), distNodeModules(), packMain(), packBg()])
  build()
}

main()
