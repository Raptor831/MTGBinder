<template>
  <div class="card-single" :class="colorIdentity">
    <router-link to="/card/id">
      <div class="card-container">
        <img :src="imgsrc" alt=""/>
      </div>
    </router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Card',
  props: {
    card: Object,
  },
  data: () => ({
    imgsrc: '',
  }),
  mounted() {
    if (!this.card.imgsrc) {
      axios.get(`https://api.scryfall.com/cards/${this.card.scryfallId}`)
        .then((response) => {
          this.imgsrc = response.data.image_uris.png;
          this.card.imgsrc = response.data.image_uris.png;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.imgsrc = this.card.imgsrc;
    }
  },
  computed: {
    colorIdentity() {
      let colorIdentityString = '';
      this.card.colorIdentity.forEach((item) => {
        colorIdentityString += item;
      });
      colorIdentityString = colorIdentityString === '' ? 'CL' : colorIdentityString;
      return `color-id-${colorIdentityString.toLowerCase()}`;
    },
  },
};
</script>

<style lang="scss" scoped>
$colors: (
  'r': (red, red),
  'b': (black, black),
  'w': (white, white),
  'g': (green, green),
  'u': (blue, blue),
  'bg': (black, green),
  'br': (black, red),
  'bu': (black, blue),
  'bw': (black, white),
  'gr': (green, red),
  'gw': (green, white),
  'gu': (green, blue),
  'rw': (red, white),
  'ru': (red, blue),
  'uw': (blue, white),
  'cl': (beige, beige),
);
.card-single {
  //width: 200px;
  //margin: 5px;
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
