import Vue from 'vue';
import App from './App.vue';
import router from './router';
import db from './db';

Vue.config.productionTip = false;

Vue.prototype.$db = db;
Vue.prototype.$colors = {
  W: 'White',
  U: 'Blue',
  G: 'Green',
  B: 'Black',
  R: 'Red',
};

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
