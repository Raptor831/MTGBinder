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
}
</style>
