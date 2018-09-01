process.env.NODE_ENV = 'production'

const fs = require('fs-extra')
const path = require('path')
const { spawnSync } = require('child_process')
const npmWhich = require('npm-which')(__dirname)
const webpack = require('webpack')

const webpackMainConfig = require('./webpack.main.config')
const webpackBgConfig = require('./webpack.bg.config')

const manifest = require('../package')

const buildPath = npmWhich.sync('build')

function cleanDist () {
  return fs.emptydir(path.resolve(__dirname, '../', 'dist'))
}

function cleanBuild () {
  return fs.emptydir(path.resolve(__dirname, '../', manifest.build.output))
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
  manifest.build.nwPlatforms.forEach((os) => {
    manifest.build.nwArchs.forEach((arch) => {
      spawnSync(buildPath, [`--${os}`, `--${arch}`, '.'], { stdio: 'inherit' })
    })
  })
}

async function main () {
  await Promise.all([cleanDist(), cleanBuild()])
  await Promise.all([packMain(), packBg()])
  build()
}

main()
