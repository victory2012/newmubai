// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import MintUI from 'mint-ui';
import FastClick from 'fastclick';
import 'mint-ui/lib/style.css';
import router from './router';
import App from './App';
import api from './api';
import './assets/reset.css';
import '../static/icon/iconfont.css';

Vue.config.productionTip = false;
Vue.prototype.$axios = api;
Vue.use(MintUI);
FastClick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App />'
});
