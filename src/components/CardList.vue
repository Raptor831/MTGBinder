<template>
  <div class="card-list">
    <h2>{{ set.name }}</h2>
    <input v-model="textSearch" />
    <select v-model="color">
      <option value="">Any</option>
      <option value="B">Black</option>
    </select>
    <select v-model="type">
      <option value="">Any</option>
      <option value="Creature">Creature</option>
      <option value="Planeswalker">Planeswalker</option>
    </select>
    <nav class="pagination">
      <button
        :disabled="pageNumber === 0"
        @click="prevPage">
        Previous
      </button>
      <span>Page: {{ pageNumber + 1 }} of {{ pageCount }}</span>
      <button
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
import axios from 'axios';
import Store from 'electron-store';
import Card from './Card.vue';

const store = new Store();

export default {
  name: 'CardList',
  props: {
    size: {
      type: Number,
      required: false,
      default: 9,
    },
    sets: {},
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
    fetchData() {
      if (this.sets[this.$route.params.id] && this.sets[this.$route.params.id].cards.length) {
        this.set = this.sets[this.$route.params.id];
      } else {
        const fetch = store.get(`sets.${this.$route.params.id}`);
        console.log(fetch);
        if (fetch && fetch.cards.length) {
          this.set = fetch;
        } else {
          axios.get(`https://mtgjson.com/json/${this.$route.params.id}.json`)
            .then((response) => {
              this.set = response.data;
              store.set(`set.${this.$route.params.id}`, response.data);
            }).catch((error) => {
              console.log(error);
              this.set = {};
              this.set.cards = [];
              this.set.name = 'Not Found';
            });
        }
      }
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
    color: '',
    textSearch: '',
    type: '',
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
      let filtered = this.set.cards;
      if (this.type !== 'any' && this.type !== '') {
        filtered = filtered.filter(item => item.type.includes(this.type));
      }
      if (this.textSearch) {
        filtered = filtered.filter(item => item.name.toLowerCase().indexOf(this.textSearch) > -1);
      }
      if (this.color !== 'any' && this.color !== '') {
        filtered = filtered.filter(item => item.colorIdentity.includes(this.color));
      }
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
.card-list {
  //background-color: #666;
}
button {
  @include button();
  margin-bottom: 0;
  &:disabled {
    @include button-disabled();
  }
}
.card-list-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
