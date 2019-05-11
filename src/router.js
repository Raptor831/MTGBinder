import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Sets from './components/Sets.vue';
import CardList from './components/CardList.vue';
import MainNav from './components/MainNav.vue';
import CardDetail from './components/CardDetail.vue';
import Inventory from './components/Inventory.vue';
import SetList from './components/SetList.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components: { default: Home, nav: MainNav },
    },
    {
      path: '/sets',
      components: { default: Sets, nav: MainNav },
      children: [
        {
          path: '',
          name: 'Sets Top',
          components: { list: SetList },
        },
        {
          path: ':id',
          name: 'Sets',
          components: { list: CardList },
          props: true,
        },
      ],
    },
    {
      path: '/inventory',
      name: 'Inventory',
      components: { default: Inventory, nav: MainNav },
    },
    {
      path: '/card/:id',
      name: 'Card Detail',
      components: { default: CardDetail, nav: MainNav },
      props: true,
    },
  ],
});
