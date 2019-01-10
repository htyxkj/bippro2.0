import vueSimpleTree from './vueSimpleTree.vue';
import VueTree from './VueTree.vue'
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-tree', vueSimpleTree);
  Vue.component('vue-tree', VueTree);
}