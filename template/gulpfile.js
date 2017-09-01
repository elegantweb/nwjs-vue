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

gulp.task('compile', (callback) => {
  var webpackConfig = require('./webpack.config.js')

  var compiler = webpack(webpackConfig)

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

gulp.task('clean-dist', () => {
  return del('dist/**/*')
})

gulp.task('dist', (callback) => {
  runSequence('clean-dist', ['dist-package.json', 'dist-node_modules', 'compile'], callback)
})

gulp.task('serve', (callback) => {
  var webpackConfig = require('./webpack.config.js')

  webpackConfig.entry.main = ['webpack-hot-middleware/client'].concat(webpackConfig.entry.main)

  var compiler = webpack(webpackConfig)

  var hotMiddleware = webpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2500
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

gulp.task('dev', (callback) => {
  runSequence('serve', () => {
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
