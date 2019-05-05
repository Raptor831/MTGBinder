<template>
  <div class="sets">
    <SetsNav></SetsNav>
    <div class="content">
      <router-view name="list" />
    </div>
  </div>
</template>

<script>
import SetsNav from './SetsNav.vue';

export default {
  name: 'Sets',
  components: {
    SetsNav,
  },
};
</script>

<style scoped>

</style>
