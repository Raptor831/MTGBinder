import Dexie from 'dexie';

const dexieDb = new Dexie('mtgdb');

dexieDb.version(1).stores({
  sets: '&id, name, code',
  cards: '&id, name, set',
  inventory: '&id, name, set',
  decks: '++id',
});

dexieDb.open().catch((e) => {
  console.error(`Open failed: ${e.stack}`);
});

export default dexieDb;
