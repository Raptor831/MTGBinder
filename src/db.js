import Datastore from 'nedb';
import path from 'path';
import { remote } from 'electron';

const setsDb = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/sets.db'),
});
const cardsDb = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/cards.db'),
});
const inventoryDb = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/inventory.db'),
});

export default {
  sets: setsDb,
  cards: cardsDb,
  inventory: inventoryDb,
};
