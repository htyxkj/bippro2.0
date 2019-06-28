import mdBipWork from './mdBipWork'
import mdBipWorkProcess from './mdBipWorkProcess';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-work', mdBipWork);
  Vue.component('md-bip-work-process', mdBipWorkProcess);
}
