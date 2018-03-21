// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import Vuebar from 'vuebar'
import 'es6-promise-always'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import $ajax from './ajax'

import router from './router'

import store from './store'

Vue.use(Element)
Vue.use(Vuebar)
Vue.use($ajax)

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

Vue.config.productionTip = false

store.commit('updateToken', localStorage.getItem('token'))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
