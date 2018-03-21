import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/views/login/login'], resolve),
      meta: {
        requiresAuth: true
      }
    }, {
      path: '/home',
      name: 'home',
      component: resolve => require(['@/views/home/home'], resolve),
      meta: {
        requiresAuth: true
      },
      redirect: '/column',
      children: [
        {
          path: '/column',
          name: 'column',
          component: resolve => require(['@/views/home/column'], resolve),
          meta: {
            requiresAuth: true
          }
        }, {
          path: '/banner',
          name: 'banner',
          component: resolve => require(['@/views/home/banner'], resolve),
          meta: {
            requiresAuth: true
          }
        }, {
          path: '/temp-online',
          name: 'temp-online',
          component: resolve => require(['@/views/home/temp-onlineList'], resolve),
          meta: {
            requiresAuth: true
          }
        }, {
          path: '/temp-offline',
          name: 'temp-offline',
          component: resolve => require(['@/views/home/temp-offlineList'], resolve),
          meta: {
            requiresAuth: true
          }
        }, {
          path: '/temp-upload',
          name: 'temp-upload',
          component: resolve => require(['@/views/home/temp-upload'], resolve),
          meta: {
            requiresAuth: true
          }
        }, {
          path: '/picture-library',
          name: 'picture-library',
          component: resolve => require(['@/views/home/picture-library'], resolve),
          meta: {
            requiresAuth: true
          }
        }, {
          path: '/picture-upload',
          name: 'picture-upload',
          component: resolve => require(['@/views/home/picture-upload'], resolve),
          meta: {
            requiresAuth: true
          }
        }, {
          path: '/temp-manage',
          name: 'temp-manage',
          component: resolve => require(['@/views/home/temp-manage'], resolve),
          meta: {
            requiresAuth: true
          }
        }
      ]
    }
  ]
})
