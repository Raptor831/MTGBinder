<template>
  <div class="card-list">
    <h2>{{ set.name }}</h2>
    <div class="filters">
      <input type="text"
             v-model="nameSearch"
             placeholder="Filter name" />
      <fieldset class="color-checkboxes fieldset">
        <legend>Filter color</legend>
        <div class="checkbox-wrapper">
          <span class="checkbox" v-for="(color, key) in this.$colors" :key="key">
            <input type="checkbox"
                   :value="key"
                   :id="color.toLowerCase()"
                   v-model="checkedColors" />
            <label class="" :for="color.toLowerCase()">
              <span class="ms ms-cost ms-shadow ms-2x"
                    :class="'icon-' + color.toLowerCase()">
              </span>
            </label>
          </span>
          <span class="checkbox">
            <input type="checkbox"
                   id="colorless"
                   v-model="colorless" />
            <label for="colorless">
              <span class="ms ms-cost ms-shadow ms-2x ms-c"></span>
            </label>
          </span>
          <span class="switch checkbox">
            <input class="switch-input" id="union" v-model="union" type="checkbox" name="union">
            <label class="switch-paddle" for="union">
              <span class="show-for-sr">All or Any</span>
              <span class="switch-active" aria-hidden="true">All</span>
              <span class="switch-inactive" aria-hidden="true">Any</span>
            </label>
          </span>
        </div>
      </fieldset>
      <div class="type-filters">
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
        <select v-model="subtype">
          <option value="">Any</option>
        </select>
        <span>
          <input type="checkbox" v-model="legendary" id="legendary"/>
          <label for="legendary">Legendary?</label>
        </span>
        <select v-model="cmc">
          <option value="">Any</option>
          <option value="0">0</option>
          <option v-for="n in 6" :value="n" :key="n">{{n}}</option>
          <option value="7+">7+</option>
        </select>
      </div>
    </div>
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
      <card v-for="card in paginatedData" :key="card.uuid" :card="card" quality="list"></card>
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
      this.setPage(0);
      this.$db.cards.where('set').equals(this.$route.params.id.toLowerCase()).toArray()
        .then((cards) => {
          this.cards = cards;
        });
      this.$db.sets.get({ code: this.$route.params.id.toLowerCase() })
        .then((set) => {
          this.set = set;
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
    subtype: '',
    legendary: false,
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
      if (!filtered.length) return [];
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
.type-filters {
  display: flex;
}
.color-checkboxes {
  margin-bottom: 1em;
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .checkbox {
    display: inline-block;
    vertical-align: middle;
    + .checkbox {
      margin-left: 5px;
      &.switch {
        margin-left: 10px;
      }
    }
    input {
      margin-bottom: 0;
      display: none;
    }
    label {
      margin: 0;
      transition: all 50ms;
      padding: 0.5em;
      border-radius: 50%;
    }
    &:not(.switch) :checked ~ label {
      background: $primary-color;
      color: $base3;
    }
  }
  .switch {
    margin-bottom: 0;
    label {
      border-radius: 5px;
    }
    .switch-inactive {
      right: 8%;
    }
  }
}
.icon {
  &-white {
    @extend .ms-w;
  }
  &-blue {
    @extend .ms-u;
  }
  &-black {
    @extend .ms-b;
  }
  &-red {
    @extend .ms-r;
  }
  &-green {
    @extend .ms-g;
  }
}
</style>
