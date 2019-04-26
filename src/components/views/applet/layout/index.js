import BaseLayout from './BaseLayout.vue';
import BipCommLay from './BipCommLay.vue'; 
import BipHorizontalLay from './BipHorizontalLay.vue';
import BipVerticalLay from './BipVerticalLay.vue';
import BorderLayout from './BorderLayout.vue';
import LayCell from './LayCell.vue';
import TabsLayout from './TabsLayout.vue';

export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-base-layout', BaseLayout);
  Vue.component('bip-comm-lay', BipCommLay);
  Vue.component('bip-horizontal-lay', BipHorizontalLay);
  Vue.component('bip-vertical-lay', BipVerticalLay);
  Vue.component('border-layout', BorderLayout);
  Vue.component('tabs-layout', TabsLayout);
  Vue.component('lay-cell', LayCell);
}

