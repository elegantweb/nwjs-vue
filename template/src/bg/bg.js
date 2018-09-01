const isProduction = process.env.NODE_ENV === 'production'

const winURL = isProduction ? 'dist/main/index.html' : 'http://localhost:9080'

nw.Window.open(winURL, nw.App.manifest.window)
