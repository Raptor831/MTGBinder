<template>
  <div id="app">
    <h1>MTG Binder</h1>
    <router-link to="/war">Go to WAR</router-link>
    <router-link to="/rna">Go to RNA</router-link>
    <router-link to="/">Go to Home</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
