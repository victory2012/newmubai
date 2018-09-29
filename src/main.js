// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import FastClick from 'fastclick';
import 'mint-ui/lib/style.css'
import './assets/reset.css'
import '../static/icon/iconfont.css';
import api from './api'

Vue.config.productionTip = false
Vue.use(MintUI)
// Vue.use(VueAMap);
Vue.config.productionTip = false
Vue.prototype.$axios = api
FastClick.attach(document.body);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  method: {
    // loginOverTime(err) {
    //   console.log('run here');
    //   if (err.response.data.message == '登录状态已失效') {
    //     this.$router.push({
    //       path: "/login"
    //     })
    //     console.log('fjkasdgghfkjlashdfjkashdjksahdkjashdjkash')
    //     Toast({
    //       message: '登录失效，请重新登录',
    //       position: '',
    //       duration: 5000
    //     })
    //   }
    // }
  }
})
