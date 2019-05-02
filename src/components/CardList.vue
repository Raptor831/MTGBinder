<template>
  <div class="card-list">
    <h2>Card List</h2>
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
    <div class="card-list-container">
      <card v-for="card in paginatedData" :key="card.uuid" :card="card"></card>
    </div>
  </div>
</template>

<script>
import Card from './Card.vue';

export default {
  name: 'CardList',
  props: {
    cards: Array,
    size: {
      type: Number,
      required: false,
      default: 12,
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
  },
  data: () => ({
    pageNumber: 0,
    color: '',
    textSearch: '',
    type: '',
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
      if (this.type) {
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
  background-color: #666;
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
