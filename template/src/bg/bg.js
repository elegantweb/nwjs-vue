const isProduction = process.env.NODE_ENV === 'production'

const winURL = isProduction ? 'dist/main/index.html' : 'http://localhost:9080'
const winOpts = nw.App.manifest.window

winOpts.new_instance = true

nw.Window.open(winURL, winOpts)
