import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'


//导入全局样式表
import './assets/css/global.css'
//导入axios,配置axios请求根路径
import axios from 'axios'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http=axios


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
