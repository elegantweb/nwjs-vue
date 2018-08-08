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

exports.cssLoaders = function (options) {
  return {
    css: generateLoaders('css', Object.assign({}, options, { minimize: isProduction })),
    postcss: generateLoaders('css', Object.assign({}, options, { minimize: isProduction })),
    less: generateLoaders('less', options),
    sass: generateLoaders('sass', Object.assign({}, options, { indentedSyntax: true })),
    scss: generateLoaders('sass', options),
    stylus: generateLoaders('stylus', options),
    styl: generateLoaders('stylus', options)
  }
}

// Generate loaders for standalone style files
exports.styleLoaders = function (options) {
  let output = []
  let loaders = exports.cssLoaders(options)
  for (let extension in loaders) {
    let loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
