/* eslint-disable */

import Vue from 'vue';
import Router from 'vue-router';
import isWeixin from '@/utils/checkBrowser';
// import HelloWorld from '@/components/HelloWorld';

const Login = () =>
  import(/* webpackChunkName: "login" */ `@/components/Login/main`);
const Index = () =>
  import(/* webpackChunkName: "Index" */ `@/components/Index/main`);
const batteryBind = () =>
  import(/* webpackChunkName: "batteryBind" */ `@/components/Index/batteryBind`);
const batteryDetail = () =>
  import(/* webpackChunkName: "batteryDetail" */ `@/components/Index/batteryDetail`);
const batteryEdit = () =>
  import(/* webpackChunkName: "batteryEdit" */ `@/components/Index/batteryEdit`);
const realTime = () =>
  import(/* webpackChunkName: "realTime" */ `@/components/realTime/main`);
const warning = () =>
  import(/* webpackChunkName: "warning" */ `@/components/warning/main`);
const warningDetail = () =>
  import(/* webpackChunkName: "warningDetail" */ `@/components/warning/detail`);
const person = () =>
  import(/* webpackChunkName: "person" */ `@/components/person/main`);
const detail = () =>
  import(/* webpackChunkName: "detail" */ `@/components/detail/main`);
const hisTime = () =>
  import(/* webpackChunkName: "hisTime" */ `@/components/hisTime/main`);
const loading = () =>
  import(/* webpackChunkName: "hisTime" */ `@/components/loading/loading`);

Vue.use(Router);

let routeOptions = [
  // {
  //   path: '/',
  //   redirect: '/loading'
  // },
  // {
  //   path: '/loading',
  //   name: 'loading',
  //   routeSets: {
  //     bottomNavVisible: false,
  //     bottomId: 'loading'
  //   },
  //   component: loading
  // },
  // {
  //   path: '/login',
  //   name: 'login',
  //   routeSets: {
  //     bottomNavVisible: false,
  //     bottomId: 'login'
  //   },
  //   component: Login
  // },
  {
    path: '/index',
    name: 'index',
    routeSets: {
      bottomNavVisible: true,
      bottomId: 'index'
    },
    component: Index
  },
  {
    path: '/batteryBind',
    name: 'batteryBind',
    routeSets: {
      bottomNavVisible: false
    },
    component: batteryBind
  },
  {
    path: '/batteryDetail',
    name: 'batteryDetail',
    routeSets: {
      bottomNavVisible: false
    },
    component: batteryDetail
  },
  {
    path: '/batteryEdit',
    name: 'batteryEdit',
    routeSets: {
      bottomNavVisible: false
    },
    meta: {
      keepAlive: true
    },
    component: batteryEdit
  },
  {
    path: '/realTime',
    name: 'realTime',
    routeSets: {
      bottomNavVisible: false
    },
    meta: {
      keepAlive: false
    },
    component: realTime
  },
  {
    path: '/hisTime',
    name: 'hisTime',
    routeSets: {
      bottomNavVisible: false
    },
    component: hisTime
  },
  {
    path: '/warning',
    name: 'warning',
    routeSets: {
      bottomNavVisible: true,
      bottomId: 'warning'
    },
    component: warning
  },
  {
    path: '/warningDetail',
    name: 'warningDetail',
    component: warningDetail
  },
  {
    path: '/person',
    name: 'person',
    routeSets: {
      bottomNavVisible: true,
      bottomId: 'person'
    },
    component: person
  },
  {
    path: '/detail',
    name: 'detail',
    routeSets: {
      bottomNavVisible: false
    },
    component: detail
  }
];
let InWeixin = [
  {
    path: '/',
    redirect: '/loading'
  },
  {
    path: '/loading',
    name: 'loading',
    routeSets: {
      bottomNavVisible: false,
      bottomId: 'loading'
    },
    component: loading
  },
  {
    path: '/login',
    name: 'login',
    routeSets: {
      bottomNavVisible: false,
      bottomId: 'login'
    },
    component: Login
  }
];
let OutWeixin = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    routeSets: {
      bottomNavVisible: false,
      bottomId: 'login'
    },
    component: Login
  }
];

let ResuleOption = [];
if (isWeixin()) {
  ResuleOption = [...routeOptions, ...InWeixin];
} else {
  ResuleOption = [...routeOptions, ...OutWeixin];
}

const router = new Router({
  routes: ResuleOption
});
// 全局路由守卫

export default router;
