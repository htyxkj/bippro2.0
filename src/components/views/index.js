import ReportUI from './report';
import Common from './common';
import Applet from './applet'
import Bill from './bill';
import Chart from './charts';
import Excel from './excel'

export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }

  install.installed = true;
  Vue.use(Common);
  Vue.use(ReportUI);
  Vue.use(Applet);
  Vue.use(Bill);
  Vue.use(Chart);
  Vue.use(Excel);

}
