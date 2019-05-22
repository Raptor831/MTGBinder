<template>
  <div class="inventory">
    <h3>Inventory</h3>
    <input type="text" v-model="nameSearch" />
    <div class="color-checkboxes">
      <span v-for="(color, key) in this.$colors">
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
    </select>
    <select v-model="cmc">
      <option value="">Any</option>
      <option value="0">0</option>
      <option v-for="n in 6" :value="n">{{n}}</option>
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
      <div v-for="card in paginatedData" :id="card.id">
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
      this.$db.inventory.findOne({ id: cardId }, (err, doc) => {
        const newCard = doc;
        newCard.qty -= 1;
        if (newCard.qty > 0) {
          this.$db.inventory.update({ id: cardId }, newCard, {}, () => this.fetchData());
        } else {
          this.$db.inventory.remove({ id: cardId }, () => this.fetchData());
        }
      });
    },
    addInventory(cardId) {
      this.$db.inventory.findOne({ id: cardId }, (err, doc) => {
        const newCard = doc;
        console.log(newCard);
        newCard.qty += 1;
        this.$db.inventory.update({ id: cardId }, newCard, {}, () => this.fetchData());
      });
    },
    fetchData() {
      this.$db.inventory.find({}, (err, docs) => {
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
        filtered = filtered.filter(item => item.type_line.toLowerCase().indexOf(this.type.toLowerCase()) > -1);
      }
      if (this.cmc !== '') {
        filtered = filtered.filter(item => parseInt(item.cmc, 10) === parseInt(this.cmc, 10));
      }
      if (this.nameSearch) {
        filtered = filtered.filter(item => item.name.toLowerCase().indexOf(this.nameSearch) > -1);
      }
      if (this.checkedColors.length || this.colorless) {
        console.log(this.checkedColors.length);
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
