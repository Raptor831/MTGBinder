<template>
  <div id="app">
    <header>
      <router-view name="nav"></router-view>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Store from 'electron-store';
import axios from 'axios';

const store = new Store();

export default {
  name: 'app',
  methods: {
    loadCards() {
      const cardStore = store.get('cards');
      if (cardStore) {
        console.log('load from store');
        this.insertCards(cardStore);
      } else {
        console.log('load from API');
        axios.get('https://archive.scryfall.com/json/scryfall-default-cards.json')
          .then((response) => {
            console.log(response);
            store.delete('cards');
            store.set('cards', response.data);
            // this.loading = false;
            this.insertCards(response.data);
          });
      }
    },
    loadSets() {
      const setsStore = store.get('sets');
      if (setsStore) {
        console.log('load from store');
        this.insertSets(setsStore);
      } else {
        console.log('load from API');
        axios.get('https://api.scryfall.com/sets')
          .then((response) => {
            console.log(response);
            store.delete('sets');
            store.set('sets', response.data);
            this.insertSets(response.data);
          });
      }
    },
    insertCards(docs) {
      this.$db.cards.remove({}, { multi: true });
      this.$db.cards.insert(docs, (err) => {
        console.log(err);
      });
    },
    insertSets(docs) {
      this.$db.sets.remove({}, { multi: true });
      this.$db.sets.insert(docs, (err) => {
        console.log(err);
      });
    },
  },
  created() {
    this.loadCards();
    this.loadSets();
  },
};
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  height: 100%;
}
</style>
