<template>
  <div class="inventory">
    <h3>Inventory</h3>
    <input type="file" ref="myFiles" v-on:change="getFilePath" />
    <select v-model="importType">
      <option value="arena">MTG Arena</option>
      <option value="mtgmanager">MTGManager App</option>
      <option value="deckbox">Deckbox CSV</option>
    </select>
    <input type="text" v-model="nameSearch" />
    <div class="color-checkboxes">
      <span v-for="(color, key) in this.$colors" v-bind:key="key">
        <input type="checkbox"
               :value="key"
               :id="color.toLowerCase()"
               v-model="checkedColors" />
        <label :for="color.toLowerCase()">{{color}}</label>
      </span>
      <span>
        <input type="checkbox"
               id="colorless"
               v-model="colorless" />
        <label for="colorless">Colorless</label>
      </span>
      <span class="union">
        <input type="checkbox" v-model="union" id="union" />
        <label for="union">All?</label>
      </span>
    </div>
    <select v-model="type">
      <option value="">Any</option>
      <option value="Creature">Creature</option>
      <option value="Planeswalker">Planeswalker</option>
      <option value="Enchantment">Enchantment</option>
      <option value="Instant">Instant</option>
      <option value="Sorcery">Sorcery</option>
      <option value="Artifact">Artifact</option>
      <option value="Land">Land</option>
    </select>
    <select v-model="cmc">
      <option value="">Any</option>
      <option value="0">0</option>
      <option v-for="n in 6" :value="n" :key="n">{{n}}</option>
      <option value="7+">7+</option>
    </select>
    <nav class="cards-pagination">
      <button
        type="button"
        class="button"
        :disabled="pageNumber === 0"
        @click="prevPage">
        Previous
      </button>
      <span>Page: {{ pageNumber + 1 }} of {{ pageCount }}</span>
      <button
        type="button"
        class="button"
        :disabled="pageNumber >= pageCount - 1"
        @click="nextPage">
        Next
      </button>
    </nav>
    <div class="card-list-container">
      <div v-for="card in paginatedData" :id="card.id" :key="card.id">
        <Card :card="card"></Card>
        <div class="meta button-group expanded small">
          <span class="qty button">Qty: {{card.qty}}</span>
          <a class="button alert" @click="removeInventory(card.id)">-1</a>
          <a class="button success" @click="addInventory(card.id)">+1</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fs from 'fs';
import Papa from 'papaparse';
import Card from './Card.vue';

export default {
  name: 'Inventory',
  data: () => ({
    cards: [],
    pageNumber: 0,
    checkedColors: [],
    union: false,
    colorless: false,
    nameSearch: '',
    textSearch: '',
    type: '',
    cmc: '',
    cardImport: '',
    importType: 'arena',
  }),
  mounted() {
    this.fetchData();
  },
  props: {
    size: {
      type: Number,
      required: false,
      default: 9,
    },
  },
  components: {
    Card,
  },
  methods: {
    removeInventory(cardId) {
      // const newCard = this.cards.filter(item => item.id === cardId);
      this.$db.inventory.get(cardId).then((doc) => {
        const newCard = doc;
        newCard.qty -= 1;
        if (newCard.qty > 0) {
          this.$db.inventory.put(newCard).then(() => this.fetchData());
        } else {
          this.$db.inventory.delete(cardId).then(() => this.fetchData());
        }
      });
    },
    addInventory(cardId) {
      this.$db.inventory.get(cardId).then((doc) => {
        const newCard = doc;
        console.log(newCard);
        newCard.qty += 1;
        this.$db.inventory.put(newCard).then(() => this.fetchData());
      });
    },
    fetchData() {
      this.$db.inventory.toArray()
        .then((docs) => {
          this.cards = docs;
          console.log(docs);
        });
    },
    compareName(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    },
    nextPage() {
      this.pageNumber = this.pageNumber + 1;
    },
    prevPage() {
      this.pageNumber = this.pageNumber - 1;
    },
    setPage(num) {
      this.pageNumber = parseInt(num, 10);
    },
    getFilePath(event) {
      // console.log(this.$refs.myFiles.files);
      // let fileData = '';
      console.log(event.target.files[0].path);
      const path = event.target.files[0].path;
      if (!path || path === '') { return; }
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;
        this.cardImport = data;
        switch (this.importType) {
          case 'arena':
            this.parseArenaTxt();
            break;
          case 'mtgmanager':
            this.parseMtgManagerCsv();
            break;
          case 'deckbox':
            this.parseDeckboxCsv();
            break;
          default:
            break;
        }
        if (path.endsWith('.txt')) {
          this.parseTxt();
        } else if (path.endsWith('.csv')) {
          this.parseMtgManagerCsv();
        }
      });
    },
    parseArenaTxt() {
      const lines = this.cardImport.split('\n');
      const results = [];
      lines.forEach((line) => {
        const result = {};
        const lineArray = line.split(' ');
        const { length } = lineArray;
        let push = true;
        if (lineArray[0] === '' && length === 1) {
          // else if blank line
          console.log('blank line');
          push = false;
        } else if (lineArray[0].includes('\\')) {
          // else if comment line
          console.log('comment line');
          push = false;
        } else if (parseInt(lineArray[length - 1], 10)) {
          // if Arena format
          console.log('arena');
          // Reverse to pop the first element (i.e. qty)
          lineArray.reverse();
          result.qty = parseInt(lineArray.pop(), 10);
          lineArray.reverse(); // Reverse back
          result.collector_number = lineArray.pop(); // set number
          // Grab the set ID
          result.set = lineArray.pop().replace('(', '').replace(')', '').toLowerCase();
          result.name = lineArray.join(' '); // rest is the name
        } else if (!parseInt(lineArray[length - 1], 10) && length > 1) {
          // else if plain text format
          console.log('plain');
          // Reverse to pop the first element (i.e. qty)
          lineArray.reverse();
          result.qty = parseInt(lineArray.pop(), 10);
          lineArray.reverse(); // Reverse back
          result.name = lineArray.join(' '); // rest is the name
        }
        if (push) {
          results.push(result);
        }
      });
      this.importInventory(results);
    },
    parseMtgManagerCsv() {
      const results = [];
      const parsedCsv = Papa.parse(this.cardImport, { header: true });
      console.log(parsedCsv.data);
      parsedCsv.data.forEach((item) => {
        const result = {};
        result.qty = parseInt(item.Quantity, 10);
        result.name = item.Name;
        result.set = item.Code.toLowerCase();
        results.push(result);
      });
      this.importInventory(results);
    },
    async parseDeckboxCsv() {
      const results = [];
      const parsedCsv = Papa.parse(this.cardImport, { header: true });
      console.log(parsedCsv.data);
      parsedCsv.data.forEach((item) => {
        const result = {};
        result.qty = parseInt(item.Count, 10);
        result.name = item.Name;
        result.set = item.Code.toLowerCase();
        results.push(result);
      });
      this.importInventory(results);
    },
    async importInventory(imports) {
      let importedCount = 0;
      const promises = [];
      await imports.forEach(async (importedCardData) => {
        const promise = this.$db.transaction('rw', this.$db.cards, this.$db.inventory, async () => {
          let additionCollection = await this.$db.cards.where('name').equals(importedCardData.name);
          let addition = await additionCollection.toArray();
          if (await addition.length > 1 && importedCardData.set) {
            additionCollection = await additionCollection.filter(
              item => (item.set === importedCardData.set),
            );
            if (await additionCollection.count()) addition = await additionCollection.toArray();
          }
          if (await addition.length > 1 && importedCardData.collector_number) {
            additionCollection = await additionCollection.filter(
              item => (item.collector_number === importedCardData.collector_number),
            );
            if (await additionCollection.count()) addition = await additionCollection.toArray();
          }
          [addition] = addition;
          // console.log(addition);
          const inventoryCard = await this.$db.inventory.get(addition.id);
          addition.qty = importedCardData.qty;
          if (inventoryCard) {
            addition.qty += inventoryCard.qty;
          }
          promises.push(await this.$db.inventory.put(addition));
          importedCount += importedCardData.qty;
        });
        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        console.log(`Imported ${importedCount} cards`);
        this.fetchData();
      });
    },
  },
  computed: {
    pageCount() {
      const l = this.filteredCards.length;
      const s = this.size;
      return Math.ceil(l / s);
    },
    paginatedData() {
      const start = this.pageNumber * this.size;
      const end = start + this.size;
      return this.filteredCards.slice(start, end);
    },
    filteredCards() {
      let filtered = this.cards;
      this.setPage(0);
      if (this.type !== 'any' && this.type !== '') {
        filtered = filtered.filter(
          item => item.type_line.toLowerCase().indexOf(this.type.toLowerCase()) > -1,
        );
      }
      if (this.cmc !== '') {
        filtered = filtered.filter(item => parseInt(item.cmc, 10) === parseInt(this.cmc, 10));
      }
      if (this.nameSearch) {
        filtered = filtered.filter(item => item.name.toLowerCase().indexOf(this.nameSearch) > -1);
      }
      if (this.checkedColors.length || this.colorless) {
        filtered = filtered.filter((item) => {
          let check = 0;
          this.checkedColors.forEach((element) => {
            if (item.color_identity.includes(element)) {
              check += 1;
            }
          });
          if (item.color_identity.length === 0 && this.colorless) {
            check += 1;
          }
          if (
            this.union
            && !this.colorless
            && check === this.checkedColors.length
            && check === item.color_identity.length
          ) {
            return true;
          }
          if (!this.union && check > 0) {
            return true;
          }
          return false;
        });
      }
      filtered = filtered.sort(this.compareName);
      return filtered;
    },
  },
};
</script>

<style lang="scss">
.meta.button-group {
  margin-bottom: 0;
}
.card-list-container {
  display: grid;
  //max-width: 800px;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px 10px;
  justify-content: center;
}
</style>
