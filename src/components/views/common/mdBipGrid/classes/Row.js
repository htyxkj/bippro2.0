import moment from 'moment';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import enumCache from '../../../../core/utils/enumCache';
import axios from 'axios';
import qs from 'qs';
import ScriptProc from './ScriptProc'
export default class Row {
  constructor(data, columns) {
    this.data = data;
    this.columns = columns;
    this.scriptProc = new ScriptProc(data,columns);
  }
  getValue(columnName) {
    const column = this.getColumn(columnName);
    if (column && column.dataType === 'entity') {
      // columnName += '.name';
      var id = this.data[column.field];
      if(id==='' || id ===undefined){
        return '';
      }
      // if((column.attr&0x10000)==0){
      //   return id;
      // }
      
      var val = null;
      var bref = false;
      if(column.refValues&&column.refValues.values){
        bref = true;
        _.forEach(column.refValues.values,(item,index)=>{
          if(item[column.refValues.cols[0]] === id){
            if((column.attr&0x10000)>0){
              val = item[column.refValues.cols[1]];
            }else{
              val =id;
            }
            // val = item[column.refValues.cols[1]];
          }
        });
      }
      if(val){
        return val;
        // return id;
      }else{
        val = this.getAssistDataByAPICout(column.refId,id,res=>{
          if(bref){
            let values = res.data.values;
            _.forEach(values,(row,index)=>{
              column.refValues.values.push(row);
            });
          }else{
            column.refValues = {};
            column.refValues.cols = res.data.allCols;
            column.refValues.values = res.data.values;
          }
        });
        return id;
      }
      return id;
    }
    if (column && column.dataType === 'enum') {
        return enumCache.getEnumName(column.refId || column.refType, get(this.data, columnName));
    }
    return get(this.data, columnName);
  }
  async getAssistDataByAPICout (mdRefID,cont,success,error) {
    var  posParams = {
      'dbid': global.DBID,
      'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
      'apiId': global.APIID_AIDO,
      'assistid': mdRefID,
      'cont':cont
    }
    const url = global.BIPAPIURL+global.API_COM;
    return await axios.post(url, qs.stringify(posParams))
      .then(success)
      .catch(error);
  }

  getValueKey(columnName){
    const column = this.getColumn(columnName);
    if (column && column.dataType === 'entity') {
      var bb = get(this.data, columnName);
      return bb;
    }
    return get(this.data, columnName);
  }
  getData(columnName) {
    return get(this.data, columnName);
  }
  setData(columnName, value) {
    return set(this.data, columnName, value);
  }
  getColumn(columnName) {
    return this.columns.find(column => column.field === columnName);
  }

  getFilterableValue(columnName) {
    const value = this.getValue(columnName);
    if (!value) {
      return '';
    }
    return value.toString().toLowerCase();
  }

  getSortableValue(columnName) {
    const dataType = this.getColumn(columnName).dataType;

    let value = this.getValue(columnName);

    if (value === undefined) {
      return '';
    }

    if (value instanceof String) {
      value = value.toLowerCase();
    }

    if (dataType.startsWith('date')) {
      const format = dataType.replace('date:', '');
      return moment(value, format).format('YYYY-MM-DD HH:mm:ss');
    }

    if (dataType === 'numeric') {
      return value;
    }

    return value.toString();
  }
  displayed(nor) {
    return !this.data.sys_deleted;
  }

  passesFilter(filter) {
    return this.columns
      .filter(column => column.isFilterable())
      .map(column => this.getFilterableValue(column.getFilterFieldName()))
      .filter(filterableValue => filterableValue.includes(filter.toLowerCase()))
      .length;
  }
}