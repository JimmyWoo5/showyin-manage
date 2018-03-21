import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    token: '',
    isWarned: 0
  },
  mutations: {
    updateToken (state, payload) {
      state.token = payload || ''
    },
    updateStatus (state, payload) {
      state.isWarned = payload
    }
  },
  actions: {
    //
  }
})
