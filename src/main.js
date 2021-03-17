import Vue from 'vue'
import App from './App.vue'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import VueGtag from 'vue-gtag'
import VueRouter from 'vue-router'
//import VueAnalytics from "vue-analytics";

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Menus from "./components/Menus";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CaseStudies from "./components/CaseStudies";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueLodash, { name: 'custom' , lodash: lodash });


Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    component: Menus,
    children: [
      {
        path: '',
        component: Header
      },
      {
        path: '',
        component: Footer
      },
      {
        path: '',
        component: CaseStudies
      }
    ]
  }
];

const router = new VueRouter( {
  routes
});

//localStorage.setItem('cookie:accepted', false);
const getCookies = localStorage.getItem('cookie:accepted');
//const getCookies = localStorage.getItem('GA:accepted');

Vue.use(VueGtag, {
  config: {
    id: 'G-ZZ22EG26Q8'
  },
  bootstrap: getCookies === 'true',
  enabled: getCookies === 'true',
}, router);

new Vue({
  router,
  render: function (h) { return h(App) },
}).$mount('#app')
