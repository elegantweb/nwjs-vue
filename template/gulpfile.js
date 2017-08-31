var path = require('path')
var { spawn } = require('child_process')
var del = require('del')
var runSequence = require('run-sequence')
var gulp = require('gulp')
var gulpIf = require('gulp-if')
var gulpJsonEditor = require('gulp-json-editor')
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var webpackHotMiddleware = require('webpack-hot-middleware')

var webpackConfig = require('./webpack.config.js')

var buildPath = path.resolve(__dirname, 'node_modules/.bin/build')
var runPath = path.resolve(__dirname, 'node_modules/.bin/run')

var server

gulp.task('copy-package.json', () => {
  return gulp.src('app/package.json')
    .pipe(gulpIf(process.env.NODE_ENV == 'production', gulpJsonEditor({main: 'index.html'})))
    .pipe(gulp.dest('dist'))
})

gulp.task('copy-node_modules', () => {
  return gulp.src('app/node_modules/**/*')
    .pipe(gulp.dest('dist/node_modules'))
})

gulp.task('copy', (done) => {
  runSequence(['copy-package.json', 'copy-node_modules'], done)
})

gulp.task('compile', (done) => {
  webpack(webpackConfig, (err, stats) => {
    done()
  })
})

gulp.task('serve', (done) => {
  webpackConfig.entry.push('webpack-hot-middleware/client')

  var compiler = webpack(webpackConfig)

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
    contentBase: path.join(__dirname, 'dist'),
    quiet: true,
    setup (app, ctx) {
      app.use(hotMiddleware)
      ctx.middleware.waitUntilValid(() => {
        done()
      })
    }
  })

  server.listen(9080)
})

gulp.task('clean-dist', () => {
  return del('dist/**/*')
})

gulp.task('dist', (done) => {
  runSequence('clean-dist', ['copy', 'compile'], done)
})

gulp.task('dev', (done) => {
  runSequence('dist', 'serve', () => {
    spawn(runPath, ['dist'], { stdio: 'inherit' }).on('close', () => {
      server.close()
      done()
    })
  })
})

gulp.task('clean-build', () => {
  return del('build/**/*')
})

gulp.task('build', (done) => {
  process.env.NODE_ENV = 'production'
  runSequence('clean-build', 'dist', () => {
    spawn(buildPath, ['--linux', '--x64', 'dist'], { stdio: 'inherit' }).on('close', () => {
      done()
    })
  })
})
