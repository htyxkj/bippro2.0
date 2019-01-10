import Vue from 'vue'
import mdBipVehicleMapDialog from './mdBipMapDialog' 

function open (propsData) {
  const DialogComponent = Vue.extend(mdBipVehicleMapDialog);
  return new DialogComponent({
    el: document.createElement('div'),
    propsData
  });
} 
export default {
  open (params) {
    const defaultParam = {}
    const propsData = Object.assign(defaultParam, params)
    return open(propsData)
  }
}