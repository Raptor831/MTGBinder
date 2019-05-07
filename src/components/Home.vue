<template>
  <div class="home">
    <router-view name="nav" />
    <h1>MTGBinder</h1>
    <cite>Raptor831</cite>
    <p><button @click="loadData">Load data</button></p>
    <p v-if="loading">Loading...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data: () => ({
    loading: false,
  }),
  methods: {
    loadData() {
      this.loading = true;
      let index = {};
      axios.get('https://archive.scryfall.com/json/scryfall-default-cards.json')
        .then((response) => {
          index = Object.values(response.data);
        });
      this.$db.cards.insert(index, (err, docs) => {
        console.log('insert');
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss">

</style>
