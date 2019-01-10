import Vue from 'vue'
import mdBipMapDialog from './mdBipMapDialog'
import mdBipMapWorkAreaDialog from './mdBipMapWorkAreaDialog'

function open (propsData) {
  const DialogComponent = Vue.extend(mdBipMapDialog);
  return new DialogComponent({
    el: document.createElement('div'),
    propsData
  });
}
function openWorkArea (propsData) {
  const DialogComponent = Vue.extend(mdBipMapWorkAreaDialog);
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
  },
  openWorkArea (params) {
    const defaultParam = {}
    const propsData = Object.assign(defaultParam, params)
    return openWorkArea(propsData)
  }

}