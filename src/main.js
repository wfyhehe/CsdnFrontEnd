// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios'
import {initLikeList} from "./common/cache"
// import iView from 'iview'
// import 'iview/dist/styles/iview.css'

Vue.use(ElementUI)
// Vue.use(iView)
initLikeList()
Vue.config.productionTip = false

// axios.interceptors.request.use(config => {
//   //在请求发出之前进行一些操作
//   let token = getToken()
//   if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
//     config.headers.Authorization = token
//
//     // config.headers.Authentication = token
//   }
//   return config
// }, error => {
//   //Do something with request error
//   return Promise.reject(error)
// })
//
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // console.log(error.response)
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          error.message = '身份未验证，请先登录'
          console.log(store)
          store._mutations['SET_USERNAME'][0]('') // 别扭的vuex外界用法
          router.push('/sign_in')
          break
        case 403:
          error.message = '抱歉，您的权限不足！'
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
        default:
      }
    }
    // ElementUI.Message.error(error.message)
    return Promise.reject(error.message)
  })


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
