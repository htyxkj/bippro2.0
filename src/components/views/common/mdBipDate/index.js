import mdBipDate from './mdBipDate.vue';
import mdBipChildDate from './mdBipChildDate.vue';

export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-date', mdBipDate);
  Vue.component('md-bip-child-date', mdBipChildDate);


  // Vue.component('md-bip-date', function (resolve) { 
  //   require(['./mdBipDate'], resolve)
  // })
  // Vue.component('md-bip-child-date', function (resolve) { 
  //   require(['./mdBipChildDate'], resolve)
  // })
}