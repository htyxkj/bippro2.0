// import mdBipInputComm from './mdBipInputComm'
// import mdBipInputDate from './mdBipInputDate'
// import mdBipInputTime from './mdBipInputTime'
// import mdBipInputFile from './mdBipInputFile'
// import mdBipInputList from './mdBipInputList'
// import mdBipInput from './mdBipInput.vue';
// import mdBipInputRef from './mdBipInputRef.vue';
// import mdBipDia from './mdBipDia.vue'; 
// import mdBipInputFileTmp from './mdBipInputFileUp'
// import mdBipButtonFileTmp from './mdBipButtonFileTmp'
// import mdBipInputEditor from './mdBipInputEditor'
// import mdBipInputCheck from './mdBipInputCheck'
// import mdBipInputRadio from './mdBipInputRadio'
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  // Vue.component('md-bip-input-comm',mdBipInputComm);
  // Vue.component('md-bip-input-date',mdBipInputDate);
  // Vue.component('md-bip-input-time',mdBipInputTime);
  // Vue.component('md-bip-input-file',mdBipInputFile);
  // Vue.component('md-bip-input-list',mdBipInputList);
  // Vue.component('md-bip-dia', mdBipDia);
  // Vue.component('md-bip-input-ref', mdBipInputRef);
  // Vue.component('md-bip-input', mdBipInput); 
  // Vue.component('md-bip-input-file-tmp',mdBipInputFileTmp);
  // Vue.component('md-bip-button-file-tmp',mdBipButtonFileTmp);
  // Vue.component('md-bip-input-editor',mdBipInputEditor);
  // Vue.component('md-bip-input-check',mdBipInputCheck);
  // Vue.component('md-bip-input-radio',mdBipInputRadio);

  Vue.component('md-bip-input-comm',() => import("./mdBipInputComm"));
  Vue.component("md-bip-input-date", () => import("./mdBipInputDate"));
  Vue.component('md-bip-input-time', () => import("./mdBipInputTime"));
  Vue.component('md-bip-input-file', () => import("./mdBipInputFile"));
  Vue.component('md-bip-input-list', () => import("./mdBipInputList"));
  Vue.component('md-bip-input-edit-list', () => import("./mdBipInputEditList"));
  Vue.component('md-bip-dia', () => import("./mdBipDia"));
  
  Vue.component('md-bip-object-dia', () => import("./mdBipObjectDia"));
  Vue.component('md-bip-input-ref', () => import("./mdBipInputRef"));
  Vue.component('md-bip-input', () => import("./mdBipInput")); 
  
  Vue.component('md-bip-input-file-tmp', () => import("./mdBipInputFileTmp"));
  Vue.component('md-bip-bi-file-up', () => import("./mdBipBiFileUp"));
  Vue.component('md-bip-input-fileUp',() => import("./mdBipInputFileUp"));


  Vue.component('md-bip-input-editor',() => import("./mdBipInputEditor"));
  Vue.component('md-bip-input-check',() => import("./mdBipInputCheck"));
  Vue.component('md-bip-input-radio',() => import("./mdBipInputRadio"));
  Vue.component('md-bip-input-autograph',() => import("./mdBipInputAutograph"));
  Vue.component('md-bip-input-ddGPS',()=> import("./mdBipInputDDGPS"));
  Vue.component('md-bip-input-switch',() => import("./mdBipInputSwitch"));
  
}
