<template>
  <div id="app">
    <img src="./assets/logo.png">
    {{#isEnabled plugins 'vue-router'}}
    <router-view></router-view>
    {{else}}
    <landing-page></landing-page>
    {{/isEnabled}}
  </div>
</template>

<script>
{{#isEnabled plugins 'vue-router'}}
{{else}}
import LandingPage from './components/LandingPage'

{{/isEnabled}}
export default {
  name: '{{ name }}'{{#isEnabled plugins 'vue-router'}}{{else}},{{/isEnabled}}
  {{#isEnabled plugins 'vue-router'}}
  {{else}}
  components: { LandingPage }
  {{/isEnabled}}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
