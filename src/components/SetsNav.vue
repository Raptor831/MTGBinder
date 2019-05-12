<template>
  <nav>
    <ul class="vertical menu">
    <li><router-link to="/sets/WAR">WAR</router-link></li>
    <li><router-link to="/sets/RNA">RNA</router-link></li>
    <li><router-link to="/sets/GRN">RAV</router-link></li>
    <li><router-link to="/sets/M19">M19</router-link></li>
  </ul>
  </nav>
</template>

<script>
export default {
  name: 'SetsNav',
};
</script>

<style lang="scss" scoped>
nav {
  height: 100%;
  background-color: #ccc;
}
</style>
