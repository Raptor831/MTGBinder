<template>
  <nav>
    <div class="forward-back-nav">
      <a @click="$router.go(-1)">Back</a>
      <a @click="$router.go(1)">Forward</a>
    </div>
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
nav {
  background: $light-gray;
  display: flex;
}
.menu {
  @include menu-base;
}
</style>
