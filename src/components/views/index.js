import ReportUI from './report';
import Common from './common';
import Mobile from './mobile';
import Applet from './applet';
// import Bill from './bill';
import Chart from './charts';
import Excel from './excel';
import Cwork from './cwork';

export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }

  install.installed = true;
  Vue.use(Common);
  Vue.use(Mobile);
  Vue.use(ReportUI);
  Vue.use(Cwork);
  Vue.use(Applet);
  // Vue.use(Bill);
  Vue.use(Chart);
  Vue.use(Excel);


}
