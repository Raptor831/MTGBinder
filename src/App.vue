<template>
  <div id="app">
    <header class="primary-header">
      <router-view name="header"></router-view>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <aside class="primary-aside">
      <router-view name="sidebar"></router-view>
    </aside>
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
            store.set('sets', response.data.data);
            this.insertSets(response.data.data);
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
  height: 100vh;
}
#app {
  height: 100%;
  display: grid;
  grid-template-rows: 50px 1fr;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
}
header.primary-header {
  grid-area: header;
}
main {
  grid-area: main;
  max-height: calc(100vh - 50px);
  overflow: auto;
  padding: 10px;
}
.primary-content {
}
aside.primary-aside {
  grid-area: sidebar;
  background: $mana-black-secondary;
}
</style>
