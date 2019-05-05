import Vue from 'vue';
import App from './App.vue';
import '../node_modules/foundation-sites/js/foundation';
import router from './router';
import db from './db';

Vue.config.productionTip = false;

Vue.prototype.$db = db;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
