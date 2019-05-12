<template>
  <nav>
    <ul class="menu vertical" data-dropdown-menu>
      <li><router-link to="/sets">Sets</router-link></li>
      <li><router-link to="/inventory">Cards</router-link></li>
      <li><router-link to="/inventory">Inventory</router-link></li>
      <li><router-link to="/inventory">Decks</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'SidebarNav',
};
</script>

<style lang="scss" scoped>

</style>
