import mdBackground from './mdBackground.vue';
export default function install(Vue) {
  Vue.component('md-background', mdBackground);
  // Vue.component('md-background', function (resolve) {
  //   require(['./mdBackground'], resolve)
  // })
}
