import mdBipBi from './mdBipMoblieBi.vue';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-moblie-bi', mdBipBi);
}
