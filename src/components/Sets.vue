<template>
  <div class="sets">
    <aside class="sidebar">
      <SetsNav></SetsNav>
    </aside>
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

<style lang="scss" scoped>
.sets {
  display: flex;
  align-items: stretch;
  height: 100%;
  flex: 1;
  align-content: stretch;
}
.sidebar {
  width: 300px;
}
.content {
  flex: 1;
}
</style>
