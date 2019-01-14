import mdWorkCopyFlow from './mdWorkCopyFlow'
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-work-copy-flow', mdWorkCopyFlow);
}
