import Datastore from 'nedb';
import path from 'path';
import { remote } from 'electron';

export default {
  sets: new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/sets.db'),
  }),
  cards: new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/cards.db'),
  }),
  inventory: new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/inventory.db'),
  }),
};
