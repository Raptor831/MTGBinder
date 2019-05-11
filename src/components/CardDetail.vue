<template>
  <div class="card-detail">
    <aside class="sidebar">
      <nav>
        <router-link :to="'/sets/' + card.set">{{card.set_name}}</router-link>
        <p>
          <button class="button add-to-inventory" @click="addInventory">Add To Inventory</button>
          Qty: <input v-model="qty" type="number" min="1"/>
        </p>
      </nav>
    </aside>
    <div class="content">
      <h3>{{card.name}}</h3>
      <p><img :src="card.image_uris.png" alt=""/></p>
      <p>{{card.oracle_text}}</p>
      <p>{{card.flavor_text}}</p>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  name: 'CardDetail',
  data: () => ({
    card: Object,
    qty: 1,
    // cardDetail: Object,
  }),
  props: {
    id: String,
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
.card-detail {
  display: flex;
  align-items: stretch;
  height: 100%;
  flex: 1;
  align-content: stretch;
}
.sidebar {
  width: 300px;
}
.content {
  flex: 1;
}
</style>
