<template>
  <div id="app">
    <nav>
      <ul class="menu">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/sets/WAR">WAR</router-link></li>
        <li><router-link to="/sets/RNA">RNA</router-link></li>
      </ul>
    </nav>
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
  color: #2c3e50;
}
.menu {
  @include menu-base;
}
</style>
