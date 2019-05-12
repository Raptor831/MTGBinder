<template>
  <nav>
    <div class="forward-back-nav">
      <a @click="$router.go(-1)">Back</a>
      <a @click="$router.go(1)">Forward</a>
      <router-link to="/">MTGBinder</router-link>
    </div>
  </nav>
</template>

<script>
// import $ from 'jquery';
// import { DropdownMenu } from '../../node_modules/foundation-sites/js/foundation';

export default {
  name: 'MainNav',
  data: () => ({
    dropdown: Object,
  }),
};
</script>

<style lang="scss" scoped>
nav {
  background-color: $white;
  z-index: 5;
  position: relative;
  display: flex;
  align-items: center;
}
.menu {
}
</style>
