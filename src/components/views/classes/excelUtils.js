import XLSX from "xlsx";
let exportExcel = function (...params) {
  const _headers = params[0];
  let _data = params[1];
  const _title = params[2];
  const _fileName = params[3]?params[3]:this.nowR();
  if (_title) {
    _data.splice(0, 0, { "": "" });
  }
  //获取表头
  var headers = _headers
    // 为 _headers 添加对应的单元格位置
    .map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
  var data = _data
    // 匹配 headers 的位置，生成对应的单元格数据
    .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 1) })))
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next))
    // 转换成 worksheet 需要的结构 
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' }; //xlsx格式

  var wb = {
    SheetNames: ['Sheet1'],
    Sheets: {},
    Props: {}
  };
  // 合并 headers 和 data
  var output = Object.assign({}, headers, data);
  // 获取所有单元格的位置
  var outputPos = Object.keys(output);
  // 计算出范围
  var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
  if (_title) {
    data["A1"] = {
      t: "s",
      v: _title,
    };
    data["!merges"] = [{ //合并第一行数据[A1,B1, C1, D1, E1] 
      s: { //s为开始
        c: 0, //开始列 
        r: 0 //开始取值范围 
      },
      e: { //e结束 
        c: _headers.length - 1, //结束列
        r: 0 //结束范围
      }
    }];
  }
  wb.Sheets['Sheet1'] = Object.assign({}, data, { '!ref': ref });
  console.log(data);
  console.log(wb);
  var obj = new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream" });
  var fileName = _fileName + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType);
  var tmpa = document.createElement("a");
  tmpa.download = fileName;
  tmpa.href = URL.createObjectURL(obj); //绑定a标签 
  tmpa.click();
  //模拟点击实现下载 
  setTimeout(function () { //延时释放 
    URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
  }, 100);
}

let s2ab = function (s) {
  if (typeof ArrayBuffer !== 'undefined') {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  } else {
    var buf = new Array(s.length);
    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
}

let nowR = function(){
  return Date.now();
}
const Tool = {
  exportExcel,
  s2ab,
  nowR
}

export default Tool