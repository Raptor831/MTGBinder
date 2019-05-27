<template>
  <div id="app" :class="{ loading: loadingData }">
    <header class="primary-header">
      <router-view name="header" @load-data="loadAll" @save-data="saveAll" @reload-data="reloadRemote"></router-view>
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
    reloadData: false,
  }),
  methods: {
    loadCards() {
      this.loadingCards = true;
      this.$db.sets.count().then((count) => {
        if (count || !this.reloadData) {
          console.log('load cards from store');
        } else {
          console.log('load cards from API');
          axios.get('https://archive.scryfall.com/json/scryfall-default-cards.json')
            .then((response) => {
              console.log(response);
              this.insertCards(response.data);
            });
        }
      });
    },
    loadSets() {
      this.loadingSets = true;
      this.$db.sets.count().then((count) => {
        if (count && !this.reloadData) {
          console.log('load sets from store');
        } else {
          console.log('load cards from API');
          axios.get('https://api.scryfall.com/sets')
            .then((response) => {
              console.log(response);
              this.insertSets(response.data.data);
            });
        }
      });
    },
    insertCards(docs) {
      this.$db.transaction('rw', this.$db.cards, async () => {
        await this.$db.cards.clear();
        await this.$db.cards.bulkAdd(docs);
      }).then(() => {
        console.log('Cards transaction committed');
      }).catch((err) => {
        console.error(err.stack);
      });
    },
    insertSets(docs) {
      this.$db.transaction('rw', this.$db.sets, async () => {
        await this.$db.sets.clear();
        await this.$db.sets.bulkAdd(docs);
      }).then(() => {
        console.log('Sets transaction committed');
      }).catch((err) => {
        console.error(err.stack);
      });
    },
    loadInventory() {
      if (store.has('inventory')) {
        console.log('load cards from store');
        this.insertInventory(store.get('inventory'));
      } else {
        console.log('load cards from API');
        axios.get('https://archive.scryfall.com/json/scryfall-default-cards.json')
          .then((response) => {
            console.log(response);
            store.delete('cards');
            store.set('cards', response.data);
            this.insertInventory(response.data);
          });
      }
    },
    insertInventory() {
      this.$db.inventory.remove({}, { multi: true });
      this.$db.inventory.insert(docs, (err) => {
        this.loadingSets = false;
        console.log(err);
      });
    },
    saveInventory() {

    },
    loadDecks() {

    },
    insertDecks() {

    },
    saveDecks() {

    },
    loadAll() {
      console.log('loading all');
      this.loadCards();
      this.loadSets();
    },
    saveAll() {
      this.saveInventory();
      this.saveDecks();
    },
    reloadRemote() {
      this.reloadData = true;
      this.loadCards();
      this.loadSets();
      this.reloadData = false;
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
