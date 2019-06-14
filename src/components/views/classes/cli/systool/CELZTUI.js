import Utils from '../../utils';
// import BipScriptProc from '../../BipScriptProc';
// 整体的数据类型
export default class CELZTUI {
  constructor(cdataset) {
    this.cdataset = cdataset;
  }
  async main(sui) {
    let cc = sui.split("*");
    if (cc.length > 1) {
      let exName = cc[1];
      let utils = new Utils();
      if (exName.indexOf("EX") != -1) { //获取长文本
        exName = exName.substring(2, exName.length)
        let clValue = await utils.getLongText(exName);
        this.analysis(clValue);
      } else { //获取常量
        let clValue = await utils.getLongText(exName);
        this.analysis(clValue);
      }
    }
  }
  analysis(vl) {
    //[wghsid]==1;!map_name,map_root,sopr;
    //[wghsid]==1;map_name,map_root 
    // let bipScriptProc = new BipScriptProc(this.cdataset.currRecord,this.cdataset.ccells.cels);
    let ti = [];//符合条件下标集合
    //先循环处理不符合条件的
    for (var i = 0; i < vl.length; i++) {
      let exOne = vl[i].split(";");
      let field = exOne[0];
      let field0 = field.substring(field.indexOf("[") + 1, field.indexOf("]"));
      let fh = field.substring(field.indexOf("]") + 1, field.indexOf("]") + 3);
      let num = field.substring(field.indexOf("]") + 3,field.length);
      let cc = exOne[1];

      if(this.OperationXX(this.cdataset.currRecord[field0],num,fh)){
        ti.push(i);
        continue;
      } 
      if(cc.indexOf("!") ==0){//非空
        cc = cc.substring(1,cc.length)
        let zd = cc.split(",");
        _.forEach(this.cdataset.ccells.cels, (item) => {
          let id = item.id;
          if(this.in_array(id,zd)){ 
            item.isReq = false;
            item.unNull= false; 
          }
        });
      }else{//非编辑
        let zd = cc.split(",");
        _.forEach(this.cdataset.ccells.cels, (item) => {
          let id = item.id;
          if(this.in_array(id,zd)){ 
            item.attr= item.attr & ~64; 
          }
        });
      } 
    }
    //循环处理符合条件的
    for(var i=0;i<ti.length;i++){
      let exOne = vl[ti[i]].split(";");
      let field = exOne[0];
      let field0 = field.substring(field.indexOf("[") + 1, field.indexOf("]"));
      let fh = field.substring(field.indexOf("]") + 1, field.indexOf("]") + 3);
      let num = field.substring(field.indexOf("]") + 3,field.length);
      let cc = exOne[1]; 
      if(cc.indexOf("!") ==0){//非空
        cc = cc.substring(1,cc.length)
        let zd = cc.split(",");
        _.forEach(this.cdataset.ccells.cels, (item) => {
          let id = item.id;
          if(this.in_array(id,zd)){
            if(this.OperationXX(this.cdataset.currRecord[field0],num,fh)){
              item.isReq = true;
              item.unNull= true;
            } 
          }
        });
      }else{//非编辑
        let zd = cc.split(",");
        _.forEach(this.cdataset.ccells.cels, (item) => {
          let id = item.id;
          if(this.in_array(id,zd)){
            if(this.OperationXX(this.cdataset.currRecord[field0],num,fh)){
              item.attr= item.attr | 64;
            } 
          }
        });
      } 
    }
  }
  OperationXX (v1, v2, fh) {
    if (fh == '+') {
      return v1 + v2;
    }
    if (fh == '-') {
      return v1 - v2;
    }
    if (fh == '*') {
      return v1 * v2;
    }
    if (fh == '/') {
      return v1 / v2;
    }
    if (fh == '>=') {
      return v1 >= v2;
    }
    if (fh == '>') {
      return v1 > v2;
    }
    if (fh == '<') {
      return v1 < v2;
    }
    if (fh == '<=') {
      return v1 <= v2;
    }
    if (fh == '%') {
      return v1 % v2;
    }
    if (fh == '==') {
        return v1 == v2;
    }
  } 
  in_array(c, b){
    　　if (typeof c == "string" || typeof c == "number"){ 
    　　　　for (var a in b) {
    　　　　　　if (b[a] == c) {
    　　　　　　　　return true
    　　　　　　}
    　　　　}
    　　}
    　　return false
    }
}
