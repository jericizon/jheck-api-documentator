import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: 'jheck-api-documentator/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/app/:id?',
      name: 'app',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/App.vue')
    },
    {
      path: '/preview/:url?',
      name: 'preview',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Preview.vue')
    }
  ]
})
