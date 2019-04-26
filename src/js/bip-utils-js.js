import axios from 'axios'
import qs from 'qs'
import menuPattr from "@/components/views/classes/menuPattr"; 
// import $ from 'jquery'
export default {
  install (Vue, options) {

    Vue.prototype.getDataByAPINew = async function (posParams,success,error) {
      var returnobj = null;
      const url = global.BIPAPIURL+global.API_COM;
      returnobj = await axios.post(url, qs.stringify(posParams))
        .then(success)
        .catch(error)
      return returnobj;
    }

    Vue.prototype.logout = async function(){
      var params = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        username: JSON.parse(window.sessionStorage.getItem("user")).userName,
        snkey: JSON.parse(window.sessionStorage.getItem("snkey")),
        apiId: global.APIID_LOGOUT,
      };
      const url = global.BIPAPIURL+global.API_COM;
      var returnobj = await axios.post(url, qs.stringify(params));
      return returnobj;
    }

    Vue.prototype.taskMsg = function(taskid,success,error){
      var params = {
        snkey: JSON.parse(window.sessionStorage.getItem("snkey")),
        apiId: global.APIID_TA_MSG,
        'tskim':taskid
      };
      const url = global.BIPAPIURL+global.API_COM;
      axios.post(url, qs.stringify(params)).then(success).catch(error);
    }

    Vue.prototype.getCeaCheckInfo = async function (ceaParam,id) {
      var checkParasm = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_CHKUP,
        chkid:id,
        cea:JSON.stringify(ceaParam)
      }
      var returnobj = null;
      const url = global.BIPAPIURL+global.API_COM;
      returnobj = await axios.post(url, qs.stringify(checkParasm));
      return returnobj;
    }

    Vue.prototype.makeCellCL = async function(cells){ 
      for(var i=0;i<cells.cels.length;i++){
        var cell = cells.cels[i];
        cell.c_par = cells;
        var s0 = cell.refValue;
        if(s0){
          var cc = s0.charAt(0);
          const len = s0.length-1;
          if(cc=='{'&&s0.charAt(len)=='}'){
            s0 = s0.substring(1,len);
            if(s0.charAt(0)=='$'){
              //获取常量
              var cc = JSON.parse(window.sessionStorage.getItem(cell.refValue));
              cell.refCl = true;
              if(!cc){
                // console.log('服务端获取');
                // console.log(cell.refValue)
                cc = await this.getCLByAPI({'assistid':cell.refValue});
                // console.log(cc);
                window.sessionStorage.setItem(cell.refValue,JSON.stringify(cc.data));
              }
            }else if(s0.charAt(0)=='&'){
              //辅助信息
              cell.refCl = false;
            }
          }
          cells.cels[i] = cell;
        }
      }
      if(cells.subLayCells){
        for(var i=0;i<cells.subLayCells.length;i++){
          cells.subLayCells[i] = await this.makeCellCL(cells.subLayCells[i]);
        }
      }
      return cells;
    }

    Vue.prototype.getCLByAPI = async function(params){
      var  posParams = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_AID,
        'assistid': '',
        'cont':'',
      }
      posParams = Object.assign(posParams, params);
      return await this.getDataByAPINewSync(posParams);
    }
    // 同步获取资源
    Vue.prototype.getDataByAPINewSync = async function (posParams) {
      const url = global.BIPAPIURL+global.API_COM;
      var returnobj  = await axios.post(url, qs.stringify(posParams))
        .then(function(res){
          return res;
        })
        .catch(function(res){
          return res;
        });
      return returnobj;
    }

    // 同步获取资源
    Vue.prototype.downFile = async function (posParams) {
      const url = global.BIPAPIURL+global.API_COM;

      var returnobj  = await axios({
        method:'post',
        url:url,
        responseType:'arraybuffer',
        data: qs.stringify(posParams)
      })
        .then(function(res){
          return res;
        })
        .catch(function(res){
          return res;
        });
      return returnobj;
    }

        // 同步获取文件资源
    Vue.prototype.getFileByAPINewSync = async function (posParams) {
      const url = global.BIPAPIURL+global.API_UPD;
      var returnobj  = await axios.post(url, qs.stringify(posParams))
        .then(function(res){
          return res;
        })
        .catch(function(res){
          return res;
        });
      return returnobj;
    }

    Vue.prototype.getSize = function(size){
      size =
      size > 1024
        ? size / 1024 > 1024
          ? size / (1024 * 1024) > 1024
            ? (size / (1024 * 1024 * 1024)).toFixed(2) + "GB"
            : (size / (1024 * 1024)).toFixed(2) + "MB"
          : (size / 1024).toFixed(2) + "KB"
        : size.toFixed(2) + "B";
    return size;
    }

    Vue.prototype.getAssistDataByAPICout = function (mdRefID,cont,script,assType,success,error) {
      var  posParams = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_AIDO,
        'assistid': mdRefID,
        'cont':cont,
        'script':script,
        'assType':assType,
      }
      var returnobj = null;
      const url = global.BIPAPIURL+global.API_COM;
      axios.post(url, qs.stringify(posParams))
        .then(success)
        .catch(error)
      return returnobj;
    }

    Vue.prototype.ISPC = function(){
      var userAgentInfo = navigator.userAgent;
      // var Agents = ["Android", "iPhone",
      //             "SymbianOS", "Windows Phone",
      //             "iPad", "iPod"];
      var Agents = ["Android", "iPhone"];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
              flag = false;
              break;
          }
      }
      return flag;
    } 

    Vue.prototype.getAssistODataByAPI = async function (params,success,error) {
      var  posParams = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_AIDO,
        'assistid': '',
        'cont':'',
        'pageSize': 20,
        'page':1,
      }
      posParams = Object.assign(posParams, params);
      const url = global.BIPAPIURL+global.API_COM;
      var returnobj = await axios.post(url, qs.stringify(posParams))
        .then(success)
        .catch(error)
      return returnobj;
    }

    Vue.prototype.saveData = async function (params,success,error) {
      var  posParams = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_SAVEDATA,
        'pcell': '',
        'jsonstr':'',
        'datatype':1
      }
      posParams = Object.assign(posParams, params);
      const url = global.BIPAPIURL+global.API_COM;
      var returnobj  = await axios.post(url, qs.stringify(posParams))
        .then(success)
        .catch(error)
      return returnobj;
    }

    // 获取用户信息
    Vue.prototype.getUserInfo = function () {
      return JSON.parse(window.sessionStorage.getItem('user'))
    }

    // Vue.prototype.getAssist = function (rfid,code,success,error){
    //   var data1 = {
    //     'dbid': global.DBID,
    //     'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
    //     'apiId': global.APIID_AID,
    //     'assistid': rfid,
    //     'cont': code
    //   };
    //   this.getAssistBySync(data1,success,error);
    // }
    // Vue.prototype.getAssistBySync = function (posParams,success,error) {
    //   var returnobj = null;
    //   const url = global.BIPAPIURL+global.API_COM;
    //   axios.post(url, qs.stringify(posParams))
    //     .then(success)
    //     .catch(error)
    //   return returnobj;
    // }

    Vue.prototype.upLoad = async function(arg){
      const url = global.BIPAPIURL+global.API_UPD;
      let config = {
        headers: {
        'Content-Type': 'multipart/form-data'
        },
        params:{
            snkey:JSON.parse(window.sessionStorage.getItem('snkey')),
        }
      };
      let form = new FormData();
      for(let key in arg.data){
        form.append(key+"",arg.data[key]);
      }
      return await axios.post(url,form,config);
    }

    Vue.prototype.upLoadSlice = async function(form,configs){
      const url = global.BIPAPIURL+global.API_UPD;
      let defaultConfig = {
        headers: {
        'Content-Type': 'multipart/form-data'
        },
        params:{
            snkey:JSON.parse(window.sessionStorage.getItem('snkey')),
        }
      };
      defaultConfig = Object.assign(defaultConfig, configs);
      return await axios.post(url,form,defaultConfig);
    }

    Vue.prototype.base64Encode = function (password) {
      var pwd = encodeURIComponent(password)
      pwd = unescape(pwd)
      pwd = window.btoa(pwd)
      return pwd
    }

    Vue.prototype.makePath = function(fileName){
      const key = 999;
      var add1 = Math.floor(Math.random() * (key));
      return add1;
    }

    Vue.prototype.getFileIcon  = function(qname){ 
      let name = qname;
      if(name.substring(0,name.lastIndexOf('.')).length>4){
        name = name.substring(0,3)+'...'+name.substring(name.lastIndexOf('.')+1)
      }
      var kzm = name.substring(name.lastIndexOf('.')+1);
      var _srcs = {};
      if(kzm=='doc' || kzm =='docx'){
          _srcs = {'src':require('@/components/../img/uploadImg/word.png'),'name':name,'qname':qname};
      }else if(kzm=='xls' || kzm=='xlsx'){
          _srcs = {'src':require('@/components/../img/uploadImg/excel.png'),'name':name,'qname':qname};
      }else if(kzm == 'pdf'){
          _srcs = {'src':require('@/components/../img/uploadImg/pdf.png'),'name':name,'qname':qname};
      }else if(kzm == 'txt'){
          _srcs = {'src':require('@/components/../img/uploadImg/txt.png'),'name':name,'qname':qname};
      }else if(kzm == 'zip' || kzm =='rar'){
          _srcs = {'src':require('@/components/../img/uploadImg/zip.png'),'name':name,'qname':qname};
      }else if(kzm =='html'){
          _srcs = {'src':require('@/components/../img/uploadImg/html.png'),'name':name,'qname':qname};
      }else if(kzm == 'ppt' || kzm=='pptx'){
          _srcs = {'src':require('@/components/../img/uploadImg/ppt.png'),'name':name,'qname':qname};
      }else if(kzm == 'jpg' || kzm == 'png' || kzm == 'gif' || kzm == 'jpeg'){ 
        _srcs = {'src':require('@/components/../img/uploadImg/img.png'),'name':name,'qname':qname};
      }else{
        _srcs = {'src':require('@/components/../img/uploadImg/noFound.png'),'name':name,'qname':qname};
      } 
      return _srcs;
    }

    Vue.prototype.uuid = function () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = '-'
      var uuid = s.join('')
      return uuid
    }

    Vue.prototype.getMenuPermission = function (mparams){
      let menuP = {};
        // console.log("顶部按钮权限！")
        menuP.LIST = true;
        menuP.COPY = true;

        menuP.INSERT=false; 
        if((mparams.pattr & menuPattr.INSERT)>0){
          menuP.INSERT=true;
        }
        menuP.DELETE=false;      
        if((mparams.pattr & menuPattr.DELETE)>0){
          menuP.DELETE=true;
        }
        menuP.SAVE=false;      
        if((mparams.pattr & menuPattr.SAVE)>0){
          menuP.SAVE=true;
        }  
        menuP.FILE=false;      
        if((mparams.pattr & menuPattr.FILE)>0){
          menuP.FILE=true;
        }  
        menuP.COUNT=false; 
        if((mparams.pattr & menuPattr.COUNT)>0){
          menuP.COUNT=true;
        }  
      return  menuP;
    } 

    Vue.prototype.getConstant = async function(assistid,success,error){
      var  posParams = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        "apiId": "constant", //获取cellID标识 
        'assistid': assistid, //辅助,变量标识 如 {&SOPR},{$D.SOPR}    	'cont': "BXQ0000517060001"  //查询条件
      }
      const url = global.BIPAPIURL+global.API_COM;
      
      let constant = window.sessionStorage.getItem(assistid); 
      if(constant){
        if(constant !=='noData'){
          constant = JSON.parse(constant);
        }
      }
      if(!constant){
        return await axios.post(url, qs.stringify(posParams)).then(function(res){
          let id = res.data.data.id;
          constant = res.data.data.value;  
          if(id ==0){
              window.sessionStorage.setItem(assistid,JSON.stringify(constant));
              return constant;
          }else {
              window.sessionStorage.setItem(assistid,"noData");
              return null;
          }
        }).catch(function(err){
          return null;
        }); 
      }else if(constant == 'noData' ){
          return null;
      }else{
          return constant;
      } 
    }

    Vue.prototype.doLayout = function(str){
      let hv = new Array;
      let cs0 = str.split('');
      let cdv = 0;
      let buf = ''
      cs0.forEach(c0 => {
        if(c0 === '(' || c0==='['){
            cdv++
        }else if(c0 === ')' || c0 === ']'){
            cdv--;
        }else if(cdv === 0 && (c0 === ';' || c0 === ',')){
          hv.push(buf)
          buf = ''
          c0=''
        }
        buf+=c0 
      });
      hv.push(buf)
      return hv;
    }
    Vue.prototype.getObjId = function(str){
      if (str.startsWith("@")) str = str.substring(1);
      let index = str.indexOf("#");
      if (index > 0) {
        str = str.substring(0, index);
        return str;
      }
      index = str.indexOf("[");
      if (index > 0) {
        str = str.substring(0, index);
      }
      index = str.indexOf("/");
      if (index > 0) {
        str = str.substring(0, index);
      }
      return str;
    }
  }
}
