import Vue from 'vue'
import BaseLayout from './BaseLayout.vue'
import router from './router'
import store from './store'
import VuejsDialog from 'vuejs-dialog';
import Toastr from 'vue2-toastr'
import VueAnalytics from 'vue-analytics'
import VueHighlightJS from 'vue-highlightjs'

import 'bulma/css/bulma.css';
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css';
import '@mdi/font/scss/materialdesignicons.scss';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import 'vue2-toastr/dist/css/vue2-toastr.css'

Vue.use(Toastr, {
    position: 'top right',
    progressBar: true,
    showMethod: 'bounceInRight',
    hideMethod: 'bounceOutUp',
    showDuration: 500
})

Vue.use(VuejsDialog);
Vue.use(VueHighlightJS)
Vue.config.productionTip = false

const isProd = process.env.NODE_ENV === 'production';

Vue.use(VueAnalytics, {
    id: 'UA-146139829-1',
    router,
    debug:{
        enabled: !isProd,
        sendHitTask: isProd,
    }
})

new Vue({
  router,
  store,
  render: h => h(BaseLayout)
}).$mount('#app')
