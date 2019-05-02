<template>
  <div id="app">
    <h1>MTG Binder</h1>
    <CardList v-bind:cards="cards" />
  </div>
</template>

<script>
import War from './data/WAR.json';
import CardList from './components/CardList.vue';

export default {
  name: 'app',
  data: () => (War),
  components: {
    CardList,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
