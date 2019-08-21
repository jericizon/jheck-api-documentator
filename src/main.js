import Vue from 'vue'
import App from './App.vue'
import 'bulma'
import '@mdi/font/css/materialdesignicons.min.css'
import router from './router'
import store from './store'

import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-146139829-1',
  router
})

import Scrollspy from 'vue2-scrollspy';
// use default options
Vue.use(Scrollspy);

import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
var toastrConfigs = {
  position: 'top right',
  progressBar: true,
  showMethod: 'bounceInRight',
  hideMethod: 'bounceOutUp',
  showDuration: 500
}

Vue.use(CxltToastr, toastrConfigs)

Vue.config.productionTip = false

const COOKIE_PREFIX = 'jheck_api_document_generator';

window.setCookie = function(cname, cvalue, exdays){

	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = COOKIE_PREFIX + '_' +cname + "=" + cvalue + ";" + expires + ";path=/";
}

window.getCookie = function(cname, cvalue, exdays){
  var name = COOKIE_PREFIX + '_' + cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
