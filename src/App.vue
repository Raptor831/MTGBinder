<template>
  <div id="app">
    <router-view name="nav"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  background: #222;
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $light-gray;
}
</style>
