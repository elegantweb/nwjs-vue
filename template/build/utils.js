const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProduction = process.env.NODE_ENV === 'production'

function generateLoader (loader, options) {
  return {
    loader: loader + '-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
}

// see: https://vue-loader.vuejs.org/guide/extract-css.html#webpack-4
function generateExtracter (options) {
  return {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: !isProduction
    }
  }
}

function generateLoaders (loader, options) {
  let loaders = []
  if (options.extract) loaders.push(generateExtracter(options))
  else loaders.push('vue-style-loader')
  if (loader != 'css') loaders.push(generateLoader('css', options))
  loaders.push(generateLoader(loader, options))
  return loaders
}

function generateStyleLoader (extension, loader) {
  return {
    test: new RegExp('\\.' + extension + '$'),
    use: loader
  }
}

exports.cssLoaders = function (options) {
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
