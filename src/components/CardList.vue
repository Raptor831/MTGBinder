<template>
  <div class="sets">
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
        <option value="-1">Any</option>
        <option value="0">0</option>
        <option v-for="n in 6" :value="n">{{n}}</option>
        <option value="7+">7+</option>
      </select>
      <nav class="">
        <button
          type="button"
          :disabled="pageNumber === 0"
          @click="prevPage">
          Previous
        </button>
        <span>Page: {{ pageNumber + 1 }} of {{ pageCount }}</span>
        <button
          type="button"
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
      this.$db.cards.count({}, (err, count) => console.log(count));
      this.$db.cards.find({ set: this.$route.params.id.toLowerCase() }, (err, docs) => {
        // console.log(docs);
        this.set = docs;
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
  created() {
    this.fetchData();
  },
  data: () => ({
    pageNumber: 0,
    checkedColors: [],
    union: false,
    nameSearch: '',
    textSearch: '',
    type: '',
    cmc: -1,
    set: {},
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
      let filtered = this.set;
      this.setPage(0);
      if (this.type !== 'any' && this.type !== '') {
        filtered = filtered.filter(item => item.type.includes(this.type));
      }
      if (this.nameSearch) {
        filtered = filtered.filter(item => item.name.toLowerCase().indexOf(this.nameSearch) > -1);
      }
      if (this.checkedColors.length) {
        console.log(this.checkedColors.length);
        filtered = filtered.filter((item) => {
          let check = 0;
          this.checkedColors.forEach((element) => {
            if (item.color_identity.includes(element)) {
              check += 1;
            }
          });
          if (
            this.union
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
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
button {
  @include button();
  margin-bottom: 0;
  &:disabled {
    @include button-disabled();
  }
}
.card-list-container {
  display: grid;
  max-width: 800px;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px 5px;
  justify-content: center;
}
</style>
