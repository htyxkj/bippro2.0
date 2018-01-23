import common from '../core/utils/common.js';
import util from './classes/excelUtils';
export default {
  filters: {
    formartObj: function(values,cell){
      if (cell.type === 3) {
        let pit = cell.ccPoint>0 ? cell.ccPoint:2;
        let num = parseFloat( values === '' ? 0 : values)
        if (num === 0) {
          return 0;
        } else {
          return common.formatDecimal(values,{precision: pit});
        } 
      }
      return values;
    }
  },
  methods:{
    setRowColor(_index){
      _index = _index % 2;
      if ( _index !== 0){
        return true;
      }
      return false;
    },
    numRed (vals,cell) {
      if(cell.type === 3 &&vals<0)
        return true;
      return false;
    },
    exportFiles(header,cdata,keyvs,title,fileName){
      var arr = [];
      arr[0] = keyvs;
      arr = _(arr).concat(cdata).value();
      util.exportExcel(header,arr,title,fileName);
    },
    exportFilesServ(content,title){
      const blob = new Blob([content]);
      const fileName = title+'.xls'
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    }
    
  }
}