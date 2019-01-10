import mdBackdrop from './mdBackdrop.vue';

export default function install(Vue) {
  Vue.component('md-backdrop', mdBackdrop);
  // Vue.component('md-backdrop', function (resolve) { 
  //   require(['./mdBackdrop'], resolve)
  // })
}
