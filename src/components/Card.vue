<template>
  <div class="card-single" :class="{ twoface: backFace, flipped: flipState }">
    <router-link class="card-container" :to="'/card/' + card.id">
      <div class="face front">
        <img :src="frontFace" alt=""/>
      </div>
      <div v-show="backFace" class="face back">
        <img :src="backFace" alt=""/>
      </div>
    </router-link>
    <button @click="flip" v-if="backFace" class="flip button secondary"><span class="fi fi-loop"></span></button>
  </div>
</template>

<script>
export default {
  name: 'Card',
  data: () => ({
    flipState: false,
  }),
  props: {
    card: Object,
    quality: {
      type: String,
      required: false,
      default: 'list',
    },
  },
  computed: {
    frontFace() {
      if (this.card.layout === 'transform') {
        return this.card.card_faces[0].image_uris.png;
      }
      return this.card.image_uris.png;
    },
    backFace() {
      if (this.card.layout === 'transform') {
        return this.card.card_faces[1].image_uris.png;
      }
      return false;
    },
    flipped() {
      return this.flipState;
    },
  },
  methods: {
    flip() {
      this.flipState = !this.flipState;
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
    display: block;
    width: 100%;
    perspective: 1000;
  }
  .button.flip {
    position: absolute;
    top: 30%;
    right: 5px;
    z-index: 5;
    font-size: 2em;
    padding: 0;
    height: 2em;
    width: 2em;
    display: flex;
    justify-content: center;
    opacity: 0.5;
    transition: all 0.2s;
    outline: none;
    border-width: 2px;
    border-radius: 1em;
    &:hover {
      opacity: 1;
      // background-color: $mana-red;
    }
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
  &.twoface.flipped .face {
    transform: rotateY(-180deg);
    &.back {
      transform: rotateY(0deg);
      z-index: 2;
    }
  }
}
</style>
