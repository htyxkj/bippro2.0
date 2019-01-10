import mdBipChildInputList from './mdBipChildInputList'
import mdBipInputEntity from './mdBipInputEntity'
import mdBipChildInputFileUp from './mdBipChildInputFileUp'
// import mdBipInputComm from './mdBipInputComm'
// import mdBipInputDate from './mdBipInputDate'
// import mdBipInputTime from './mdBipInputTime'
// import mdBipInputFile from './mdBipInputFile'
// import mdBipInput from './mdBipInput.vue';
// import mdBipInputRef from './mdBipInputRef.vue';
// import mdBipDia from './mdBipDia.vue';
// // import mdBipInputFileTmp from './mdBipInputFileTmp'
// import mdBipInputFileTmp from './mdBipInputFileUp'
// import mdBipButtonFileTmp from './mdBipButtonFileTmp'
// import mdBipInputUEditor from './mdBipInputUEditor'
// import mdBipInputCheck from './mdBipInputCheck'
// import mdBipInputRadio from './mdBipInputRadio'
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-child-input-list',mdBipChildInputList);
  Vue.component('md-bip-input-entity',mdBipInputEntity);
  Vue.component('md-bip-child-input-file',mdBipChildInputFileUp);

  // Vue.component('md-bip-input-comm',mdBipInputComm);
  // Vue.component('md-bip-input-date',mdBipInputDate);
  // Vue.component('md-bip-input-time',mdBipInputTime);
  // Vue.component('md-bip-input-file',mdBipInputFile);
  
  // Vue.component('md-bip-dia', mdBipDia);
  // Vue.component('md-bip-input-ref', mdBipInputRef);
  // Vue.component('md-bip-input', mdBipInput);
  
  // Vue.component('md-bip-input-file-tmp',mdBipInputFileTmp);
  // Vue.component('md-bip-button-file-tmp',mdBipButtonFileTmp);
  // Vue.component('md-bip-input-ueditor',mdBipInputUEditor);
  // Vue.component('md-bip-input-check',mdBipInputCheck);
  // Vue.component('md-bip-input-radio',mdBipInputRadio);
}
