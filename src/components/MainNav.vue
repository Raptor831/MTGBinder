<template>
  <nav>
    <div class="forward-back-nav button-group small">
      <a class="button primary" @click="$router.go(-1)">Back</a>
      <a class="button primary" @click="$router.go(1)">Forward</a>
    </div>
    <div class="title">
      <router-link class="title-link" to="/">MTGBinder</router-link>
    </div>
    <div class="utility button-group small">
      <a class="button secondary" @click="">Save</a>
      <a class="button secondary" @click="loadAll()">Load</a>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'MainNav',
  data: () => ({
    dropdown: Object,
  }),
  methods: {
    loadAll() {
      this.$emit('load-data');
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  background-color: $base02;
  border-bottom: 1px solid $black;
  box-shadow: rgba(0,0,0,0.5) 0 0 5px;
  z-index: 5;
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 10px;
}
.forward-back-nav {
  margin-bottom: 0;
  margin-right: 20px;
}
.title {
  font-weight: bold;
  font-size: 1.5em;
  flex: 1;
}
.utility {
  margin: 0;
  a {
    display: inline-block;
  }
}
@include mtg_button_group;
</style>
