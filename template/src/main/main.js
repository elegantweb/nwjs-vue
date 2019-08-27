{{#isEnabled plugins 'axios'}}
import axios from 'axios'
{{/isEnabled}}
import Vue from 'vue'

import App from './App.vue'
{{#isEnabled plugins 'vue-router'}}
import router from './router'
{{/isEnabled}}
{{#isEnabled plugins 'vuex'}}
import store from './store'
{{/isEnabled}}

{{#isEnabled plugins 'axios'}}
Vue.http = Vue.prototype.$http = axios
{{/isEnabled}}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  {{#isEnabled plugins 'vue-router'}}
  router,
  {{/isEnabled}}
  {{#isEnabled plugins 'vuex'}}
  store,
  {{/isEnabled}}
  render: h => h(App)
})
