import mdBipBi from './mdBipBi.vue';
import mdBipPCBi from './pc';
import mdBipMobileBi from './mobile';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-bi', mdBipBi);
  Vue.use(mdBipPCBi);
  Vue.use(mdBipMobileBi);
}
