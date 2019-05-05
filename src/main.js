import Vue from 'vue';
import App from './App.vue';
// import './foundation';
import router from './router';
import db from './db';

Vue.config.productionTip = false;

Vue.prototype.$db = db;

new Vue({
  // data: {
  //   currentRoute: window.location.pathname
  // },
  // render: h => h(App),
  router,
  render: h => h(App),
}).$mount('#app');
