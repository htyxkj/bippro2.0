import mdBipRef from './mdBipRef';
import mdBipChildInput from './mdBipChildInput';
import mdBipInput from './mdBipInput';
import mdBipNotify from './mdBipNotify';
import mdBipGrid from './mdBipGrid';
import mdBipEnum from './mdBipEnum';
import mdBipDialog from './mdBipDialog';
import mdBipMapDialog from './mdBipMapDialog/airfence';
import mdBipMapCarDialog from './mdBipMapDialog/vehicle';
import mdBipTree from './mdBipTree';
import mdBipDate from './mdBipDate';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.use(mdBipRef);
  Vue.use(mdBipDate);
  Vue.use(mdBipTree);
  Vue.use(mdBipChildInput);
  Vue.use(mdBipInput);
  Vue.use(mdBipGrid);
  Vue.use(mdBipEnum);
  Vue.prototype.$notify = mdBipNotify;
  Vue.prototype.$dialog1 = mdBipDialog;
  Vue.prototype.$mapDialog = mdBipMapDialog;
  Vue.prototype.$mapCarDialog = mdBipMapCarDialog;
}
