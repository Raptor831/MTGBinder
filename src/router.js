import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import SidebarNav from './components/SidebarNav.vue';
import Sets from './components/Sets.vue';
import CardList from './components/CardList.vue';
import MainNav from './components/MainNav.vue';
import CardDetail from './components/CardDetail.vue';
import Inventory from './components/Inventory.vue';
import SetList from './components/SetList.vue';
import DeckList from './components/DeckList.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components: { default: Home, header: MainNav, sidebar: SidebarNav },
    },
    {
      path: '/sets',
      components: { default: Sets, header: MainNav, sidebar: SidebarNav },
      children: [
        {
          path: '',
          name: 'Sets',
          components: { list: SetList },
        },
        {
          path: ':id',
          name: 'Set Detail',
          components: { list: CardList },
          props: true,
        },
      ],
    },
    {
      path: '/inventory',
      name: 'Inventory',
      components: { default: Inventory, header: MainNav, sidebar: SidebarNav },
    },
    {
      path: '/card/:id',
      name: 'Card Detail',
      components: { default: CardDetail, header: MainNav, sidebar: SidebarNav },
      props: true,
    },
    {
      path: '/decks',
      name: 'Decks',
      components: { default: DeckList, header: MainNav, sidebar: SidebarNav },
    },
  ],
});
