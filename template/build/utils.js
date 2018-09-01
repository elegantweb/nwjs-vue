const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

function generateLoader (loader, options) {
  return {
    loader: loader + '-loader',
    options: Object.assign({}, options, {
      sourceMap: options.sourceMap
    })
  }
}

// see: https://vue-loader.vuejs.org/guide/extract-css.html#webpack-3
function generateExtracted (loaders) {
  return ExtractTextWebpackPlugin.extract({
    use: loaders,
    fallback: 'vue-style-loader'
  })
}

function generateLoaders (loader, options) {
  let loaders = []
  if (loader != 'css') loaders.push(generateLoader('css', options))
  loaders.push(generateLoader(loader, options))
  if (options.extract) {
    return generateExtracted(loaders)
  } else {
    return ['vue-style-loader'].concat(loaders)
  }
}

function generateStyleLoader (extension, loader) {
  return {
    test: new RegExp('\\.' + extension + '$'),
    use: loader
  }
}

exports.cssLoaders = function (options) {
  options = Object.assign({}, options, { minimize: isProduction })
  return {
    css: generateLoaders('css', options),
    postcss: generateLoaders('css', options),
    less: generateLoaders('less', options),
    sass: generateLoaders('sass', Object.assign({}, options, { indentedSyntax: true })),
    scss: generateLoaders('sass', options),
    stylus: generateLoaders('stylus', options),
    styl: generateLoaders('stylus', options)
  }
}

// Generate loaders for standalone style files
exports.styleLoaders = function (options) {
  let output = [], loaders = exports.cssLoaders(options)
  for (let ext in loaders) output.push(generateStyleLoader(ext, loaders[ext]))
  return output
}
