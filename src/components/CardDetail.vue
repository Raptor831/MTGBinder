<template>
  <div class="card-detail">
    <aside class="sidebar">
      <card :card="card" quality="detail"></card>
      <div class="qty">
        <div class="field-item">
          <label for="qty">Qty:</label>
          <input v-model="qty" type="number" min="1" name="qty" id="qty"/>
        </div>
        <button class="button add-to-inventory" @click="addInventory">Add To Inventory</button>
      </div>
    </aside>
    <div class="content">
      <header>
        <h2>{{card.name}}</h2>
        <div class="set-link">
          <span class="label">Set: </span>
          <router-link :to="'/sets/' + card.set" class="tiny secondary">
            {{card.set_name}}
          </router-link>
        </div>
      </header>
      <div class="card-faces-text">
        <p v-if="card.oracle_text">{{card.oracle_text}}</p>
        <p v-if="card.flavor_text">{{card.flavor_text}}</p>
        <div class="card-face" v-for="face in card.card_faces" :key="face.id">
          <h3>{{face.name}}</h3>
          <p>{{face.oracle_text}}</p>
          <p class="cite">{{face.flavor_text}}</p>
        </div>
      </div>
      <footer class="meta">
        <div class="legalities">
          <h4>Legalities</h4>
          <div class="legalities-container">
            <div v-for="(value, name) in card.legalities"
                 v-bind:key="name"
                 class="result"
                 :class="{legal: value === 'legal'}">
              {{name.toUpperCase()}}
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import Card from './Card.vue';

export default {
  name: 'CardDetail',
  data: () => ({
    card: Object,
    qty: 1,
    // cardDetail: Object,
  }),
  components: {
    Card,
  },
  mounted() {
    this.$db.cards.get(this.$route.params.id).then((card) => {
      this.card = card;
      console.log(this.card);
    });
  },
  methods: {
    addInventory() {
      this.$db.inventory.get(this.card.id)
        .then((card) => {
          if (card) {
            const newCard = card;
            newCard.qty = parseInt(newCard.qty, 10) + parseInt(this.qty, 10);
            this.$db.inventory.put(newCard);
          } else {
            const newCard = this.card;
            newCard.qty = this.qty;
            this.$db.inventory.add(newCard);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.sub-header {
  display: flex;
  justify-content: space-between;
}
.set-link {
  // display: flex;
  justify-content: flex-start;
  align-content: center;
  font-weight: 700;
  span {
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.8em;
  }
}
.card-detail {
  display: grid;
  height: 100%;
  grid-template-columns: 400px 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}
.sidebar {
  grid-column-start: 1;
}
.content {
  grid-column-start: 2;
}
.card-faces-text {
  white-space: pre-wrap;
}
.qty {
  display: flex;
  align-items: flex-end;
  margin-top: 1em;
  > * {
    margin: 0;
    + * {
      margin-left: 1em;
    }
  }
  label {
    //display: inline-block;
    margin: 0;
    //padding-right: 0.5em;
    //vertical-align: middle;
  }
  input {
    width: 50px;
    margin: 0;
    //display: inline-block;
    //vertical-align: middle;
  }
}
.legalities-container {
  display: flex;
  flex-wrap: wrap;
}
.result {
  text-align: center;
  color: $base3;
  width: 180px;
  margin: 1px;
  font-size: 0.8em;
  line-height: 1;
  padding: 0.5em;
  letter-spacing: 0.05em;
  font-weight: 500;
  background: $red;
}
.legal {
  background: $green;
}
.cite {
  color: $base00;
  font-style: italic;
  font-size: 0.9em;
}
</style>
