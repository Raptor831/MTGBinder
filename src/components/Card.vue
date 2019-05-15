<template>
  <div class="card-single" :class="{ twoface: backFace }">
    <router-link class="card-container" :to="'/card/' + card.id">
      <div class="face front">
        <img :src="frontFace" alt=""/>
      </div>
      <div v-show="backFace" class="face back">
        <img :src="backFace" alt=""/>
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
  computed: {
    frontFace() {
      if (this.card.layout === 'transform') {
        return this.card.card_faces[0].image_uris.png;
      } else {
        return this.card.image_uris.png;
      }
    },
    backFace() {
      if (this.card.layout === 'transform') {
        return this.card.card_faces[1].image_uris.png;
      } else {
        return false;
      }
    },
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
    display: block;
    width: 100%;
    perspective: 1000;
  }
  img {
    max-width: 100%;
    display: block;
  }
  &.twoface .face {
    transition: 0.5s all;
    backface-visibility: hidden;
    z-index: 1;
    transform-style: preserve-3d;
    &.back {
      position: absolute;
      top: 0;
      left: 0;
      transform: rotateY(180deg);
      z-index: 0;
      height: 100%;
      width: 100%;
    }
  }
  &.twoface:hover .face {
    transform: rotateY(-180deg);
    &.back {
      transform: rotateY(0deg);
      z-index: 2;
    }
  }
}
</style>
