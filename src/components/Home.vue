<template>
  <div class="home">
    <h1>MTGBinder</h1>
    <cite>Raptor831</cite>
    <p><button class="button" @click="loadData">Load data</button></p>
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
          console.log(response);
          store.delete('cards');
          store.set('cards', response.data);
          // this.loading = false;
          this.insertData(response.data);
        });
      axios.get('https://api.scryfall.com/sets')
        .then((response) => {
          console.log(response);
          store.delete('sets');
          store.set('sets', response.data.data);
          this.insertSets(response.data.data);
        });
    },
    insertData(docs) {
      this.$db.cards.remove({}, { multi: true });
      this.$db.cards.insert(docs, (err) => {
        console.log(err);
        this.loading = false;
      });
    },
    insertSets(docs) {
      this.$db.sets.remove({}, { multi: true });
      this.$db.sets.insert(docs, (err) => {
        console.log(err);
      });
    },
  },
};
</script>

<style lang="scss">

</style>
