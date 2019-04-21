import axios from 'axios'
import qs from 'qs' 
export default {
    install (Vue, options) { 
        Vue.prototype.beforeSaveCheck = async function(dsm){
            let constant = "";
            let obj_id = dsm.ccells.obj_id;
            constant = await this.getConstant("SAVE."+obj_id);
            if(constant != null){
                //对话框_字段类型：第一个字段，第二个字段,运算符,返回值类型,对比值，逻辑运算符，友情提示
                //Dialog_date:hpdate,mkdate,-,number,qxjian,>,您当前填写的整改日期超出规定时限，是否保存？
                let zd = constant.split(":")[1].split(",");
                let type = constant.split(":")[0].split("_");
                let consoleType = type[0];
                let dataType = type[1];
                if(consoleType == 'Dialog' || consoleType =='Notification'){
                    if(dataType == 'date'){ //时间类型
                        let zd1 = zd[0];//字段1
                        let zd2 = zd[1];//字段2
                        let zd3 = zd[2];//运算符
                        let zd4 = zd[3];//返回值类型
                        let zd5 = zd[4];//对比值
                        let zd6 = zd[5];//逻辑运算符
                        let zd7 = zd[6];//友情提示
                        let vl1 = dsm.currRecord[zd1];
                        let vl2 = dsm.currRecord[zd2];
                        let vl3 = dsm.currRecord[zd5]; 
                        var arr = vl1.split(/[- : \/]/);
                        if(!arr[3])
                            arr[3] = "00"
                        if(!arr[4])
                            arr[4] = "00"
                        if(!arr[5])
                            arr[5] = "00"
                        let d1 = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]).getTime();

                        arr = vl2.split(/[- : \/]/);
                        if(!arr[3])
                            arr[3] = "00"
                        if(!arr[4])
                            arr[4] = "00"
                        if(!arr[5])
                            arr[5] = "00"
                        let d2 = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]).getTime();
                        
                        let d3 = this.OperationXX(d1,d2,zd3);
                        if(zd4 == 'ss'){
                            vl3 = vl3*1000
                        }else if(zd4 == 'mm'){
                            vl3 = vl3*1000*60
                        }else if(zd4 == 'hh'){
                            vl3 = vl3*1000*60*60
                        }else if(zd4 == 'dd'){
                            vl3 = vl3*1000*60*60*24
                        }else if(zd4 == 'MM'){
                            vl3 = vl3*1000*60*60*24*30
                        }else if(zd4 == 'yy'){
                            vl3 = vl3*1000*60*60*24*30*365
                        }
                        let d4 = this.OperationXX(d3,vl3,zd6)
                        if(d4){
                            let retv = [consoleType,zd7];
                            if(consoleType =='Notification'){
                                retv[2] = zd[7]
                            }
                            return retv;
                        }else{
                            return false;
                        }
                    } 
                    if(dataType == 'number'){
                        let zd1 = zd[0];//字段1
                        let zd2 = zd[1];//字段2
                        let zd3 = zd[2];//运算符
                        let zd4 = zd[3];//返回值类型
                        let zd5 = zd[4];//对比值
                        let zd6 = zd[5];//逻辑运算符
                        let zd7 = zd[6];//友情提示
                        let vl1 = dsm.currRecord[zd1];
                        let vl2 = dsm.currRecord[zd2];
                        let vl3 = dsm.currRecord[zd5];   
                        let d3 = this.OperationXX(parseFloat(vl1) ,parseFloat(vl2),zd3); 
                        let d4 = this.OperationXX(d3,vl3,zd6)
                        if(d4){
                            let retv = [consoleType,zd7];
                            if(consoleType =='Notification'){
                                retv[2] = zd[7]
                            }
                            return retv;
                        }else{
                            return false;
                        }
                    }
                }else if(consoleType == 'Only'){
                    //Only:select count(*) from job where sbuid='800305' and sid<>{sid} and qxsid={qxsid},0,>,抢修票编号已存在,false
                    let zd = constant.split(":")[1].split(",");
                    let sql = zd[0];
                    let zd2 = zd[1];
                    let zd3 = zd[2];
                    let zd4 = zd[3];
                    let zd5 = zd[4];
                    while(sql.indexOf("{")>=0){
                        let zz = sql.substring(sql.indexOf("{")+1,sql.indexOf("}"));
                        sql = sql.replace("{"+zz+"}","'"+dsm.currRecord[zz]+"'"); 
                    } 
                    var posParams = {
                        snkey: JSON.parse(window.sessionStorage.getItem("snkey")),
                        apiId: global.APIID_SQL,
                        assistid: sql,
                        type: 'queryOne',
                    };
                    const url = global.BIPAPIURL + global.API_COM;
                    var res = await axios.post(url, qs.stringify(posParams)); 
                    if(res.data.id ==0){
                        let cc = res.data.data.key;
                        let d4 = this.OperationXX(cc,zd2,zd3)
                        if(d4){
                            let retv = ['Notification',zd4,zd5]; 
                            return retv;
                        }else{
                            return false;
                        }
                    }  
                }
            } 
            if(dsm.ds_sub>0){//有子对象

            } 
        } 
        Vue.prototype.OperationXX = function(v1,v2,fh){
            if(fh == '+'){
                return v1 + v2;
            }
            if(fh == '-'){
                return v1 - v2;
            }            
            if(fh == '*'){
                return v1 * v2;
            }
            if(fh == '/'){
                return v1 / v2;
            }            
            if(fh == '>='){
                return v1 >= v2;
            }
            if(fh == '>'){
                return v1 > v2;
            }
            if(fh == '<'){
                return v1 < v2;
            }
            if(fh == '<='){
                return v1 <= v2;
            }
            if(fh == '%'){
                return v1 % v2;
            }
        }
    },
    methods: {
        
    }
}
