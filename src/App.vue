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
    loadData() {
      // this.loading = true;
      const cardStore = store.get('cards');
      if (cardStore) {
        console.log('load from store');
        this.insertData(cardStore);
      } else {
        console.log('load from API');
        axios.get('https://archive.scryfall.com/json/scryfall-default-cards.json')
          .then((response) => {
            const index = Object.values(response.data);
            console.log(response);
            store.delete('cards');
            store.set('cards', index);
            // this.loading = false;
            this.insertData(index);
          });
      }
    },
    insertData(docs) {
      this.$db.cards.remove({}, { multi: true });
      this.$db.cards.insert(docs, (err) => {
        console.log(err);
        // this.loading = false;
        // this.reload = false;
      });
    },
  },
  created() {
    this.loadData();
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
