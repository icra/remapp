import Vue from 'vue'
import App from './App.vue'
<<<<<<< HEAD
=======

>>>>>>> joan
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue/dist/bootstrap-vue.esm';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;
<<<<<<< HEAD

new Vue({
  el: '#app',
  render: h => h(App)
})
=======
new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
>>>>>>> joan
