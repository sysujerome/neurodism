// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import util from './util'
import Buefy from 'buefy'
import '@/assets/scss/index.scss'
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
axios.defaults.baseURL = '/neurodism';
// Vue.use(axios);
Vue.use(util);
Vue.use(Buefy, {
    defaultIconPack: 'fa'
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
