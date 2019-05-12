<template>
  <div>
    <h2>All Sets</h2>
    <ul>
      <li v-for="set in allSets" :key="set.id">
        <router-link :to="'/sets/' + set.code">
          <img width="30" v-bind:src="set.icon_svg_uri" style="background-color:white;" alt=""/>
          {{set.code.toUpperCase()}}: {{set.name}}
        </router-link>
      </li>
    </ul>
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

<style scoped>

</style>
