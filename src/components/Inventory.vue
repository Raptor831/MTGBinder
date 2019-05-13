<template>
  <div class="inventory">
    <h3>Inventory</h3>
    <div class="card-list-container">
      <div v-for="card in cards">
        <Card :card="card"></Card>
        <div class="meta button-group expanded small">
          <span class="qty button">Qty: {{card.qty}}</span>
          <a class="button alert" @click="removeInventory(card.id)">-1</a>
          <a class="button success" @click="addInventory(card.id)">+1</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from './Card.vue';

export default {
  name: 'Inventory',
  data: () => ({
    cards: [],
  }),
  created() {
    this.fetchData();
  },
  components: {
    Card,
  },
  methods: {
    removeInventory(cardId) {
      // const newCard = this.cards.filter(item => item.id === cardId);
      this.$db.inventory.findOne({ id: cardId }, (err, doc) => {
        const newCard = doc;
        newCard.qty -= 1;
        if (newCard.qty > 0) {
          this.$db.inventory.update({ id: cardId }, newCard, {}, () => this.fetchData());
        } else {
          this.$db.inventory.remove({ id: cardId }, () => this.fetchData());
        }
      });
    },
    addInventory(cardId) {
      this.$db.inventory.findOne({ id: cardId }, (err, doc) => {
        const newCard = doc;
        console.log(newCard);
        newCard.qty += 1;
        this.$db.inventory.update({ id: cardId }, newCard, {}, () => this.fetchData());
      });
    },
    fetchData() {
      this.$db.inventory.find({}, (err, docs) => {
        this.cards = docs;
        console.log(docs);
      });
    },
  },
};
</script>

<style lang="scss">

</style>
