import EchartsGauge from './EchartsGauge';
import EchartsFlowLine from './EchartsFlowLine';
import EchartsHeightLine from './EchartsHeightLine';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('echarts-gauge', EchartsGauge);
  Vue.component('echarts-flow-line', EchartsFlowLine);
  Vue.component('echarts-height-line', EchartsHeightLine);
}
