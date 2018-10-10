import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';

const Login = () =>
  import( /* webpackChunkName: "login" */ `@/components/Login/main`);
const Index = () =>
  import( /* webpackChunkName: "Index" */ `@/components/Index/main`);
const batteryBind = () =>
  import( /* webpackChunkName: "batteryBind" */ `@/components/Index/batteryBind`);
const batteryDetail = () =>
  import( /* webpackChunkName: "batteryDetail" */ `@/components/Index/batteryDetail`);
const batteryEdit = () =>
  import( /* webpackChunkName: "batteryEdit" */ `@/components/Index/batteryEdit`);
const realTime = () =>
  import( /* webpackChunkName: "realTime" */ `@/components/realTime/main`);
const warning = () =>
  import( /* webpackChunkName: "warning" */ `@/components/warning/main`);
const warningDetail = () =>
  import( /* webpackChunkName: "warningDetail" */ `@/components/warning/detail`);
const person = () =>
  import( /* webpackChunkName: "person" */ `@/components/person/main`)
const detail = () =>
  import( /* webpackChunkName: "detail" */ `@/components/detail/main`)
const hisTime = () =>
  import( /* webpackChunkName: "hisTime" */ `@/components/hisTime/main`)

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [{
      path: '/',
      redirect: '/login'
    },
    // {
    //   path: '/batteryInfo',
    //   name: 'HelloWorld',
    //   routeSets: {
    //     bottomNavVisible: true,
    //     bottomId: 'batteryInfo'
    //   },
    //   component: HelloWorld
    // },
    {
      path: '/login',
      name: 'login',
      routeSets: {
        bottomNavVisible: false,
        bottomId: 'login'
      },
      meta: {
        keepAlive: true
      },
      component: Login
    }, {
      path: '/index',
      name: 'index',
      routeSets: {
        bottomNavVisible: true,
        bottomId: 'index'
      },
      meta: {
        keepAlive: false
      },
      component: Index
    },
    {
      path: '/batteryBind',
      name: 'batteryBind',
      routeSets: {
        bottomNavVisible: false,
      },
      meta: {
        keepAlive: true
      },
      component: batteryBind
    },
    {
      path: '/batteryDetail',
      name: 'batteryDetail',
      routeSets: {
        bottomNavVisible: false,
      },
      meta: {
        keepAlive: true
      },
      component: batteryDetail
    },
    {
      path: '/batteryEdit',
      name: 'batteryEdit',
      routeSets: {
        bottomNavVisible: false,
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
    }, {
      path: '/hisTime',
      name: 'hisTime',
      routeSets: {
        bottomNavVisible: false
      },
      meta: {
        keepAlive: false
      },
      component: hisTime
    }, {
      path: '/warning',
      name: 'warning',
      routeSets: {
        bottomNavVisible: true,
        bottomId: 'warning'
      },
      meta: {
        keepAlive: true
      },
      component: warning
    }, {
      path: '/warningDetail',
      name: 'warningDetail',
      routeSets: {
        bottomNavVisible: false,
      },
      component: warningDetail
    }, {
      path: '/person',
      name: 'person',
      routeSets: {
        bottomNavVisible: true,
        bottomId: 'person'
      },
      meta: {
        keepAlive: true
      },
      component: person
    }, {
      path: '/detail',
      name: 'detail',
      routeSets: {
        bottomNavVisible: false,
      },
      meta: {
        keepAlive: false
      },
      component: detail
    }
  ]
})
router.beforeEach((to, from, next) => {

  window.scroll(0, 0)
  next()
})

export default router
