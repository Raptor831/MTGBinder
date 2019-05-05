import Datastore from 'nedb';
import path from 'path';
import { remote } from 'electron';

const setsData = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/sets.db'),
});
setsData.ensureIndex({ fieldName: 'code', unique: true }, (err) => {
  console.log(err);
});

export default {
  sets: setsData,
  cards: new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/cards.db'),
  }),
  inventory: new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/inventory.db'),
  }),
};
