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
      axios.get('https://archive.scryfall.com/json/scryfall-default-cards.json')
        .then((response) => {
          this.$db.cards.remove({});
          let index = Object.values(response.data);
          console.log(index);
          index.forEach((item) => {
            this.$db.cards.insert(item);
          });
        }).finally(() => {
          this.loading = false;
          this.$db.sets.count({}, (err, count) => {
            console.log(count);
          });
        });
    },
  },
};
</script>

<style lang="scss">

</style>
