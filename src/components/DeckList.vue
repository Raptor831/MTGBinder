<template>
    <div>
      <h2>Decks</h2>
    </div>
</template>

<script>
const defaultDeck = {
  name: 'Deck Name',
  mainBoard: [],
  sideBoard: [],
  tags: [],
  legalities: {
    standard: 'not_legal',
    future: 'not_legal',
    frontier: 'not_legal',
    modern: 'not_legal',
    legacy: 'not_legal',
    pauper: 'not_legal',
    vintage: 'not_legal',
    penny: 'not_legal',
    commander: 'not_legal',
    duel: 'not_legal',
    oldschool: 'not_legal',
  },
};
export default {
  name: 'DeckList',
};
</script>

<style scoped>

</style>
