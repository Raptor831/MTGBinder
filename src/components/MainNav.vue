<template>
  <nav>
    <div class="forward-back-nav button-group small">
      <a class="button" @click="$router.go(-1)">Back</a>
      <a class="button" @click="$router.go(1)">Forward</a>
    </div>
    <router-link class="title-link" to="/">MTGBinder</router-link>
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
  height: 100%;
  padding: 10px;
}
.forward-back-nav {
  margin-bottom: 0;
  margin-right: 20px;
}
.title-link {
  font-weight: bold;
}
</style>
