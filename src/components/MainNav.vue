<template>
  <nav>
    <ul class="menu">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/sets">Sets</router-link></li>
      <li><router-link to="/inventory">Inventory</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'MainNav',
};
</script>

<style lang="scss" scoped>
.menu {
  @include menu-base;
  background: $light-gray;
}
</style>
