import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
import Store from 'electron-store';
import Home from './components/Home.vue';
import CardList from './components/CardList.vue';
import MainNav from './components/MainNav.vue';

Vue.use(Router);

const store = new Store();
const fetch = store.get('sets');
let setsObject = {};

if (fetch) {
  setsObject = fetch;
} else {
  axios.get('https://mtgjson.com/json/AllSets.json')
    .then((response) => {
      setsObject = response.data;
      store.set('sets', setsObject);
    }).catch((error) => {
      console.log(error);
    });
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components: { default: Home, nav: MainNav },
    },
    {
      path: '/sets',
      name: 'Sets List',
      components: { default: Home, nav: MainNav },
      props: {
        default: { sets: setsObject },
      },
    },
    {
      path: '/sets/:id',
      name: 'Sets',
      components: { default: CardList, nav: MainNav },
      props: {
        default: { sets: setsObject },
      },
    },
    {
      path: '/inventory',
      name: 'Inventory',
      components: { default: Home, nav: MainNav },
    },
  ],
});
