<template>
  <div>
    <h2>All Sets</h2>
    <div class="set-grid">
      <div v-for="set in allSets" :key="set.id">
        <router-link :to="'/sets/' + set.code">
          <div class="media">
            <img v-bind:src="set.icon_svg_uri" style="background-color:white;" alt=""/>
          </div>
          {{set.code.toUpperCase()}}: {{set.name}}
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
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$db.sets.find({}, (err, docs) => {
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
      filtered = filtered.filter(item => item.set_type === 'core' || item.set_type === 'expansion');
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
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 5px 5px;
  justify-content: center;
}
.media {}
</style>
