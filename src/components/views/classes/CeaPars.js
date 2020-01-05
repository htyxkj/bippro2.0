import extend from 'lodash/extend';
export default class CeaPars {
  constructor(params) {
    const options={
      sid:'',
      sbuid:'',
      yjcontext:'',
      statefr:'0',
      stateagr:'0',
      stateto:'0',
      bup:'1',
      content:'',
      tousr:'',
      ckd:false,
      schk_mk:'',
      sorg:'',
    },minxs = extend({}, options, params);
     const properties = ['sid','sbuid','yjcontext','statefr','stateagr','stateto','bup','content','tousr','ckd','schk_mk','sorg'];
     _.forEach(properties,property=>{
      this[property] = minxs[property];
     });
  }
}