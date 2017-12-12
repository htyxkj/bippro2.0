import axios from 'axios'
import qs from 'qs'
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

    Vue.prototype.getAssistDataByAPICout = function (mdRefID,cont,success,error) {
      var  posParams = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_AIDO,
        'assistid': mdRefID,
        'cont':cont
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

    Vue.prototype.getAssist = function (rfid,code,success,error){
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_AID,
        'assistid': rfid,
        'cont': code
      };
      this.getAssistBySync(data1,success,error);
    }
    Vue.prototype.getAssistBySync = function (posParams,success,error) {
      var returnobj = null;
      const url = global.BIPAPIURL+global.API_COM;
      axios.post(url, qs.stringify(posParams))
        .then(success)
        .catch(error)
      return returnobj;
    }

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

    Vue.prototype.base64Encode = function (password) {
      var pwd = encodeURIComponent(password)
      pwd = unescape(pwd)
      pwd = window.btoa(pwd)
      return pwd
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
  }
}
