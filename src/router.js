import Vue from 'vue';
import Router from 'vue-router';
import Hello from './components/HelloWorld.vue';
import CardList from './components/CardList.vue';
import War from './data/WAR.json';
import Rna from './data/RNA.json';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/war',
      name: 'WAR',
      component: CardList,
      props: { cards: War.cards },
    },
    {
      path: '/rna',
      name: 'RNA',
      component: CardList,
      props: { cards: Rna.cards },
    },
    {
      path: '/sets/:id',
      name: 'Sets',
      component: CardList,
    },
  ],
});
