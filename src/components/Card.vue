<template>
  <div class="card-single">
    <router-link to="/card/id">
      <div class="card-container">
        <img :src="card.image_uris.png" alt=""/>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    card: Object,
  },
};
</script>

<style lang="scss" scoped>
.card-single {
  position: relative;
  background: none;
  .card-container {
    position: relative;
    z-index: 2;
    text-align: center;
    overflow: hidden;
  }
  img {
    max-width: 100%;
    display: block;
  }
}
</style>
