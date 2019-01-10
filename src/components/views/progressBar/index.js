import ProgressBar from './ProgressBar'; 
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('progress-bar', ProgressBar); 
}
