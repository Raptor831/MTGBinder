<template>
  <div class="card" :class="colorIdentity">
    <div class="card-container">
      <h3>{{ card.name }}</h3>
      <span>{{ card.colorIdentity }}</span>
      <p>{{ card.text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    card: Object,
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

<style lang="scss">
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
.card {
  width: 200px;
  margin: 10px;
  padding: 10px;
  position: relative;
  &:before, &:after {
    content: '';
    width: 50%;
    height: 100%;
    position: absolute;
    z-index: 1;
    display: block;
    top: 0;
    background-color: #ccc;
  }
  &:before {
    left: 0;
  }
  &:after {
    right: 0;
  }
  &.color-id- {
    @each $slug, $color in $colors {
      &#{$slug} {
        &:before {
          background-color: nth($color, 1);
        }
        &:after {
          background-color: nth($color, 2);
        }
      }
    }
  }
  .card-container {
    position: relative;
    z-index: 2;
    background-color: #ccc;
    overflow: hidden;
  }
}
</style>
