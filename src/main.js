import Vue from 'vue';
// import App from './App'
import router from './router';
import lodash from 'lodash';
Vue.prototype._ = lodash;

import Components from './components';
import App from './views/app/myApp';
import VuejsDialog from "vuejs-dialog"
import "babel-polyfill";
import 'font-awesome/css/font-awesome.css';
import './sass/app.scss';
import './js/bip-common-js.js';
import './js/bipcfg.js';
import utils from './js/bip-utils-js';
import bipDateUtil from './js/bip-date-js';
import bipBeforeSaveCheck from "./js/bip-beforeSave-check-js";

import {getCookie} from './js/cookie';
Vue.use(utils)
Vue.use(bipBeforeSaveCheck)
Vue.use(bipDateUtil)
Vue.config.productionTip = false;
Vue.use(Components)

Vue.use(VuejsDialog);
import VueI18n from 'vue-i18n'
Vue.use(VueI18n); 
const i18n = new VueI18n({
  locale: getCookie('PLAY_LANG','zh'),    // 语言标识
  messages: {
    'zh': require('../static/lang/zh'),
    'en': require('../static/lang/en')
  }
})

//图片缩放
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(Viewer);
Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});
new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: { App }
});