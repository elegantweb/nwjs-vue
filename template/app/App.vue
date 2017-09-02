<template>
  <div id="app">
    {{#isEnabled plugins 'vue-router'}}
    <router-view></router-view>
    {{else}}
    <landing-page></landing-page>
    {{/isEnabled}}
  </div>
</template>

<script>
{{#isNotEnabled plugins 'vue-router'}}
import LandingPage from './components/LandingPage'

{{/isNotEnabled}}
export default {
  name: '{{name}}'{{#isNotEnabled plugins 'vue-router'}},{{/isNotEnabled}}
  {{#isNotEnabled plugins 'vue-router'}}
  components: { LandingPage }
  {{/isNotEnabled}}
}
</script>

<style lang="scss">
</style>
