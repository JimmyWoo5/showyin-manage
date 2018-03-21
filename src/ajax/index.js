import axios from 'axios'
import ELEMENT from 'element-ui'
import store from '@/store'
import router from '@/router'

axios.defaults.baseURL = '/api'

axios.interceptors.request.use(config => {
  if (store.state.token) config.headers['token'] = store.state.token
  return config
}, error => {
  return Promise.reject(error)
})

var NOOP = () => {}
var $ajax = (opts) => {
  opts.done = opts.done || NOOP
  opts.fail = opts.fail || NOOP
  opts.always = opts.always || NOOP
  axios(opts).then(({data}) => {
    if (data.code === 0) {
      opts.done(data.data)
    } else if (data.code === 10003) {
      if (!store.state.isWarned) {
        ELEMENT.Message.error('请重新登录')
      }
      store.commit('updateStatus', 1)
      router.push('/login')
    } else {
      ELEMENT.Message.error(data.msg)
    }
  }).catch(({response}) => {
    ELEMENT.Message.error(response.statusText)
    opts.fail()
  }).always(() => {
    opts.always()
  })
}

export default {
  name: 'ajax',
  install (Vue) {
    Vue.ajax = $ajax
    Vue.prototype.$ajax = $ajax
  }
}
