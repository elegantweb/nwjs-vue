var path = require('path')
var { spawn } = require('child_process')
var del = require('del')
var runSequence = require('run-sequence')
var gulp = require('gulp')
var gulpJsonEditor = require('gulp-json-editor')
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var webpackHotMiddleware = require('webpack-hot-middleware')

var buildPath = path.resolve(__dirname, 'node_modules/.bin/build')
var runPath = path.resolve(__dirname, 'node_modules/.bin/run')

var server

gulp.task('dist-package.json', () => {
  return gulp.src('app/package.json')
    .pipe(gulpJsonEditor({ main: 'index.html' }))
    .pipe(gulp.dest('dist'))
})

gulp.task('dist-node_modules', () => {
  return gulp.src('app/node_modules/**/*')
    .pipe(gulp.dest('dist/node_modules'))
})

gulp.task('pack-main', (callback) => {
  var config = require('./config/webpack.main.js')

  var compiler = webpack(config)

  compiler.run((err, stats) => {
    if (err) {
      callback(err.stack || err)
    } else if (stats.hasErrors()) {
      callback(stats.toString({ chunks: false, colors: true }))
    } else {
      callback()
    }
  })
})

gulp.task('pack', (callback) => {
  runSequence(['pack-main'], callback)
})

gulp.task('clean-dist', () => {
  return del('dist/**/*')
})

gulp.task('dist', (callback) => {
  runSequence('clean-dist', ['dist-package.json', 'dist-node_modules', 'pack'], callback)
})

gulp.task('start-main', (callback) => {
  var config = require('./config/webpack.main.js')

  config.entry.main = [path.join(__dirname, 'build/dev-client.js')].concat(config.entry.main)

  var compiler = webpack(config)

  var hotMiddleware = webpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2500
  })

  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
      hotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  server = new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, 'app'),
    quiet: true,
    setup (app, ctx) {
      app.use(hotMiddleware)
      ctx.middleware.waitUntilValid(() => {
        callback()
      })
    }
  })

  server.listen(9080)
})

gulp.task('start', (callback) => {
  runSequence(['start-main'], callback)
})

gulp.task('dev', (callback) => {
  runSequence('start', () => {
    spawn(runPath, ['app'], { stdio: 'inherit' }).on('close', () => {
      server.close()
      callback()
    })
  })
})

gulp.task('clean-build', () => {
  return del('build/**/*')
})

gulp.task('build', (callback) => {
  process.env.NODE_ENV = 'production'
  runSequence('clean-build', 'dist', () => {
    spawn(buildPath, ['--linux', '--x64', 'dist'], { stdio: 'inherit' }).on('close', () => {
      callback()
    })
  })
})
