module.exports = {
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Application name'
    },
    label: {
      type: 'string',
      required: false,
      message: 'Application conventional name',
      default (data) {
        return data.name.replace(/((?:^|-)[a-z])/g, ($1) => $1.toUpperCase().replace('-', ''))
      }
    },
    description: {
      type: 'string',
      required: false,
      message: 'Application description',
      default: 'A nwjs-vue application'
    },
    plugins: {
      type: 'checkbox',
      message: 'Select which Vue plugins to install',
      choices: ['axios', 'vue-router', 'vuex'],
      default: ['axios', 'vue-router', 'vuex']
    }
  },
  helpers: {
    isEnabled (list, check, opts) {
      if (list[check]) return opts.fn(this)
      else return opts.inverse(this)
    }
  },
  filters: {
    'app/main/router/**/*': 'plugins[\'vue-router\']',
    'app/main/store/**/*': 'plugins[\'vuex\']'
  },
  complete (data) {
    console.log()
    console.log('   All set. Welcome to your new nwjs-vue project!')
    console.log('   Next steps:')
    if (!data.inPlace) console.log(`      \x1b[33m$\x1b[0m cd ${data.destDirName}`)
    console.log('      \x1b[33m$\x1b[0m npm install')
    console.log('      \x1b[33m$\x1b[0m npm run dev')
  }
}
