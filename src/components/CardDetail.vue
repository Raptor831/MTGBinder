<template>
  <div class="card-detail">
    <aside class="sidebar">
      <div class="set-link">
        <span>Set: </span>
        <router-link :to="'/sets/' + card.set" class="tiny secondary">
          {{card.set_name}}
        </router-link>
      </div>
      <Card :card="card"></Card>
    </aside>
    <div class="content">
      <h3>{{card.name}}</h3>
      <div class="qty">
        <button class="button add-to-inventory" @click="addInventory">Add To Inventory</button>
        Qty: <input v-model="qty" type="number" min="1"/>
      </div>
      <div class="card-faces-text">
        <p v-if="card.oracle_text">{{card.oracle_text}}</p>
        <p v-if="card.flavor_text">{{card.flavor_text}}</p>
        <div class="card-face" v-for="face in card.card_faces">
          <h4>{{face.name}}</h4>
          <p>{{face.oracle_text}}</p>
        </div>
      </div>
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
  created() {
    console.log(this.id);
    this.$db.cards.find({ id: this.$route.params.id }, (err, doc) => {
      this.card = doc[0];
      console.log(this.card);
      // axios.get(this.card.uri).then((response) => {
      //   this.cardDetail = response.data;
      //   console.log(this.cardDetail);
      // });
    });
  },
  methods: {
    addInventory() {
      this.$db.inventory.find({ id: this.card.id }, (err, doc) => {
        if (doc.length) {
          console.log(doc);
          const newCard = doc[0];
          newCard.qty = parseInt(newCard.qty, 10) + parseInt(this.qty, 10);
          this.$db.inventory.update({ id: this.card.id }, newCard, {}, (err, docs) => {
            console.log(docs);
          });
        } else {
          const newCard = this.card;
          newCard.qty = this.qty;
          this.$db.inventory.insert(newCard, (err, docs) => {
            console.log(docs);
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
img {
  max-width: 300px;
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
  grid-template-columns: 300px 1fr;
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
  input {
    width: 50px;
  }
}
</style>
