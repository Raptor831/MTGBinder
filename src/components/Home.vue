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
import Store from 'electron-store';
import axios from 'axios';

const store = new Store();

export default {
  name: 'Home',
  data: () => ({
    loading: false,
    reload: false,
  }),
  methods: {
    loadData() {
      this.loading = true;
      axios.get('https://archive.scryfall.com/json/scryfall-default-cards.json')
        .then((response) => {
          const index = Object.values(response.data);
          console.log(response);
          store.delete('cards');
          store.set('cards', index);
          // this.loading = false;
          this.insertData(index);
        });
    },
    insertData(docs) {
      this.$db.cards.insert(docs, (err) => {
        console.log(err);
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss">

</style>
