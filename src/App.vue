<template>
  <div id="app" :class="{ loading: loadingData }">
    <header class="primary-header">
      <router-view name="header" @load-data="loadAll"></router-view>
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
  data: () => ({
    loadingCards: false,
    loadingSets: false,
  }),
  methods: {
    loadCards() {
      this.loadingCards = true;
      const cardStore = store.get('cards');
      if (cardStore) {
        console.log('load cards from store');
        this.insertCards(cardStore);
      } else {
        console.log('load cards from API');
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
      this.loadingSets = true;
      const setsStore = store.get('sets');
      if (setsStore) {
        console.log('load sets from store');
        this.insertSets(setsStore);
      } else {
        console.log('load cards from API');
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
        this.loadingCards = false;
      });
    },
    insertSets(docs) {
      this.$db.sets.remove({}, { multi: true });
      this.$db.sets.insert(docs, (err) => {
        this.loadingSets = false;
        console.log(err);
      });
    },
    loadAll() {
      console.log('loading all');
      this.loadCards();
      this.loadSets();
    },
  },
  computed: {
    loadingData() {
      return (this.loadingCards || this.loadingSets);
    },
  },
  mounted() {
    this.loadAll();
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
  background: $base02;
  box-shadow: rgba(0,0,0,0.5) 0 0 5px;
}
@include mtg_button_group;
</style>
