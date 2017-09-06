<template>
  <div id="landing-page">
    <h1>\{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="javascript:nw.Shell.openExternal('https://vuejs.org')">Core Docs</a></li>
      <li><a href="javascript:nw.Shell.openExternal('https://forum.vuejs.org')">Forum</a></li>
      <li><a href="javascript:nw.Shell.openExternal('https://chat.vuejs.org')">Community Chat</a></li>
      <li><a href="javascript:nw.Shell.openExternal('https://twitter.com/vuejs')">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="javascript:nw.Shell.openExternal('http://router.vuejs.org')">vue-router</a></li>
      <li><a href="javascript:nw.Shell.openExternal('http://vuex.vuejs.org')">vuex</a></li>
      <li><a href="javascript:nw.Shell.openExternal('http://vue-loader.vuejs.org')">vue-loader</a></li>
      <li><a href="javascript:nw.Shell.openExternal('https://github.com/vuejs/awesome-vue')">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'landing-page',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
