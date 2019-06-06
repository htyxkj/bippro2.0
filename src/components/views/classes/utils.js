import axios from 'axios'
import qs from 'qs'
export default class Utils {
    async getConstant  (assistid, success, error) {
    var posParams = {
      'dbid': global.DBID,
      'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
      "apiId": "constant", //获取常量标识 
      'assistid': assistid, //常量名称
    }
    const url = global.BIPAPIURL + global.API_COM;

    let constant = window.sessionStorage.getItem(assistid);
    if (constant) {
      if (constant !== 'noData') {
        constant = JSON.parse(constant);
      }
    }
    if (!constant) {
      return await axios.post(url, qs.stringify(posParams)).then(function (res) {
        let id = res.data.data.id;
        constant = res.data.data.value;
        if (id == 0) {
          window.sessionStorage.setItem(assistid, JSON.stringify(constant));
          return constant;
        } else {
          window.sessionStorage.setItem(assistid, "noData");
          return null;
        }
      }).catch(function (err) {
        return null;
      });
    } else if (constant == 'noData') {
      return null;
    } else {
      return constant;
    }
  }
  //获取长文本内容
  async getLongText (assistid, success, error) {
    var posParams = {
      'dbid': global.DBID,
      'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
      "apiId": `${global.APIID_LONGTEXT}`, //获取长文本标识 
      'assistid': assistid, //长文本名称
    }
    const url = global.BIPAPIURL + global.API_COM;

    let constant = window.sessionStorage.getItem(assistid);
    if (constant) {
      if (constant !== 'noData') {
        constant = JSON.parse(constant);
      }
    }
    if (!constant) {
      return await axios.post(url, qs.stringify(posParams)).then(function (res) {
        let id = res.data.data.id;
        constant = res.data.data.value;
        if (id == 0) {
          window.sessionStorage.setItem(assistid, JSON.stringify(constant));
          return constant;
        } else {
          window.sessionStorage.setItem(assistid, "noData");
          return null;
        }
      }).catch(function (err) {
        return null;
      });
    } else if (constant == 'noData') {
      return null;
    } else {
      return constant;
    }
  }
}
