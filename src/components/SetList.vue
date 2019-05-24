<template>
  <div>
    <h2>All Sets</h2>
    <div class="set-grid">
      <div class="set-single" v-for="set in allSets" :key="set.id">
        <router-link :to="'/sets/' + set.code">
          <div class="media">
            <img v-bind:src="set.icon_svg_uri" :alt="set.name"/>
          </div>
          <span class="set-label">{{set.name}}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SetList',
  data: () => ({
    sets: [],
  }),
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$db.sets.toArray((docs) => {
        this.sets = docs;
      });
    },
    compareName(a, b) {
      if (a.released_at < b.released_at) {
        return 1;
      }
      if (a.released_at > b.released_at) {
        return -1;
      }
      return 0;
    },
  },
  computed: {
    allSets() {
      let filtered = this.sets;
      // filtered = filtered.filter(item => item.set_type === 'core' || item.set_type === 'expansion');
      filtered = filtered.sort(this.compareName);
      return filtered;
    },
  },
};
</script>

<style lang="scss" scoped>
.set-grid {
  display: grid;
  max-width: 800px;
  margin: auto;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px 5px;
  justify-content: center;
}
.media {
  padding: 10px;
  background: $mana-white;
  display: flex;
  justify-content: center;
  img {
    max-width: 100px;
    max-height: 100px;
    width: auto;
    height: auto;
  }
}
.set-single {
  background: $yellow;
  font-weight: bold;
  a {
    color: $mana-black;
  }
}
.set-label {
  padding: 5px;
  display: inline-block;
  line-height: 1.1;
}
</style>
