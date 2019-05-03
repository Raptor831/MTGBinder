import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  // data: {
  //   currentRoute: window.location.pathname
  // },
  // render: h => h(App),
  router,
  render: h => h(App),
}).$mount('#app');
