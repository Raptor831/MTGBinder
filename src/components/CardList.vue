<template>
  <div class="card-list">
    <h2>{{ set.name }}</h2>
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
    <div class="card-list-container" v-if="paginatedData.length">
      <card v-for="card in paginatedData" :key="card.uuid" :card="card"></card>
    </div>
    <div v-else class="card-list-container">
      <h4>No cards found</h4>
    </div>
  </div>
</template>

<script>
import Card from './Card.vue';

export default {
  name: 'CardList',
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
    nextPage() {
      this.pageNumber = this.pageNumber + 1;
    },
    prevPage() {
      this.pageNumber = this.pageNumber - 1;
    },
    setPage(num) {
      this.pageNumber = parseInt(num, 10);
    },
    fetchData() {
      console.log('fetch');
      this.setPage(0);
      this.$db.cards.find({ set: this.$route.params.id.toLowerCase() }, (err, docs) => {
        this.cards = docs;
      });
      this.$db.sets.findOne({ code: this.$route.params.id.toLowerCase() }, (err, doc) => {
        this.set = doc;
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
  },
  watch: {
    $route: 'fetchData',
  },
  mounted() {
    this.fetchData();
  },
  data: () => ({
    pageNumber: 0,
    checkedColors: [],
    union: false,
    colorless: false,
    nameSearch: '',
    textSearch: '',
    type: '',
    cmc: '',
    set: {},
    cards: {},
  }),
  computed: {
    pageCount() {
      const l = this.filteredCards.length;
      const s = this.size;
      return Math.ceil(l / s);
    },
    paginatedData() {
      const start = this.pageNumber * this.size;
      const end = start + this.size;
      return this.filteredCards
        .slice(start, end);
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

<style lang="scss" scoped>
nav.cards-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
button.button {
  @include button-base();
  margin-bottom: 0;
  &:disabled {
    @include button-disabled();
    margin-bottom: 0;
  }
}
.card-list-container {
  display: grid;
  //max-width: 800px;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px 10px;
  justify-content: center;
}
</style>
