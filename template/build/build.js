process.env.NODE_ENV = 'production'

const fs = require('fs-extra')
const path = require('path')
const { spawn } = require('child_process')
const npmWhich = require('npm-which')(__dirname)
const webpack = require('webpack')

const webpackMainConfig = require('./webpack.main.config')

const buildPath = npmWhich.sync('build')

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
    const src = path.resolve(__dirname, '../app/node_modules')
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
  let os = ''
  let arch = ''

  switch (process.platform) {
    case 'linux':
      os = '--linux'
      break
    case 'darwin':
      os = '--mac'
      break
    case 'win32':
    default:
      os = '--win'
  }

  switch (process.arch) {
    case 'ia32':
      arch = '--x86'
      break
    case 'x64':
    default:
      arch = '--x64'
  }

  spawn(buildPath, [os, arch, 'dist'], { stdio: 'inherit' })
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
