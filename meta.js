var S = require('string')

module.exports = {
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Application name'
    },
    title: {
      type: 'string',
      required: false,
      message: 'Application title',
      default (data) {
        return S(data.name).humanize().titleCase().s
      }
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project description',
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
    },
    isNotEnabled (list, check, opts) {
      if (list[check]) return opts.inverse(this)
      else return opts.fn(this)
    }
  },
  filters: {
    'src/renderer/router/**/*': 'plugins[\'vue-router\']',
    'src/renderer/store/**/*': 'plugins[\'vuex\']'
  },
  complete (data) {
    console.log('Done!')
  }
}
