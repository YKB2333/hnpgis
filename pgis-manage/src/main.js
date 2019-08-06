import Vue from 'vue'
import App from './App.vue'
import router from './router'
import echarts from 'echarts'  
import iView from 'iview'
import axios from "axios"
import config from '../config'
import 'iview/dist/styles/iview.css'

import "./components/common/base.less"
import "./assets/font/iconfont.css"
Vue.use(iView);

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;
Vue.prototype.$config = config;
Vue.prototype.$axios = axios;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
