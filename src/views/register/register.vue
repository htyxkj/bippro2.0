<template>
<!--资源平台小程序注册-->
  <div class="register">
    <div class="top-bkg">
      <img src="../../../src/img/register/11.png" alt />
    </div>
    <div class="content">
      <md-input-container>
        <md-icon class="md-accent">people</md-icon>
        <label >用户名</label>
        <md-input v-model="name" required></md-input>
      </md-input-container>
   <md-input-container>
        <md-icon class="md-accent">people</md-icon>
        <label >公司名称</label>
        <md-input v-model="gsname" required></md-input>
      </md-input-container>
      <md-input-container>
        <md-icon>phone</md-icon>
        <label>手机号</label>
        <md-input type="tel" v-model="tel"     required></md-input>
      </md-input-container>

      <md-layout md-gutter>
        <md-layout md-flex-medium="60">
          <md-input-container>
            <md-icon>edit</md-icon>
            <label>短信验证码</label>
            <md-input v-model="code" required></md-input>
          </md-input-container>
        </md-layout>
        <md-layout md-flex-medium="40">
          <md-button @click="getCode" class="md-raised md-warn" v-show="show">获取验证码</md-button>
          <md-button  class="md-raised md-warn" v-show="!show">{{count}} s</md-button>
        </md-layout>
      </md-layout>

      <md-input-container md-has-password>
        <md-icon>dialpad</md-icon>
        <label>密码</label>
        <md-input type="password" v-model="password" required></md-input>
      </md-input-container>

      <md-input-container>
        <md-icon class="md-primary">menu</md-icon>
        <label for="type" >注册类型</label>
        <md-select name="type" id="type" v-model="type" required>
          <md-option value="001">客户</md-option>
          <!-- <md-option value="002">供应商</md-option>
          <md-option value="003">合作商</md-option> -->
        </md-select>
      </md-input-container>

      <div class="reg-btn">
        <md-button class="md-raised md-primary">
          <div class="reg-btn-con" @click="saveInsuser">注 册</div>
        </md-button>
      </div>

  
    </div>
  </div>
</template>>
<script>
import qs from "qs";
import axios from "axios";
const ICONS = [
  "menu",
  "dashboard",
  "verified_user",
  "videogame_asset",
  "assessment",
  "invert_colors",
  "cloud_download"
];
const ICONCOLOR = [
  { color: "red-700-0.8" },
  { color: "green" },
  { color: "indigo" },
  { color: "blue-700-0.8" },
  { color: "lime" },
  { color: "teal" },
  { color: "green-600-0.5" }
];
export default {
  data() {
    return {
      name:"",
      tel: "",
      code: "",
      password: "",
      type: "002",
      existence: "",
      smsRUL:'http://www.bip-soft.com:8080/ssms/',
      smsTitle:'北京昊丹悦科技',
      show: true,
      count: '',
      timer: null,
      gsname:''
    };
  },
  created() {
    this.loginRemote();
    console.log("cc")
  },
  mounted() {},
  methods: {
    //保存、登录、修改密码
    async saveLonginUppwd(){
      await this.saveInsuData();
      await this.loginRemote1();
       await this.upPwd()
    },
    // 登录方法
     async loginRemote() {
       console.log('路过');
      var logindata = {
        apiId: global.APIID_OUTLOGIN,
        dbid: global.DBID,
        usercode: "123456", //用户名
        ioutsys: 1 //天心选择web端 钉钉。。。
      };
      try {
        var res = await this.getDataByAPINew(logindata);

          console.log('1111');
          console.log(res);
          console.log('222');
        if(res.data.id ==0){
          var userI = res.data.data.user;
          var mlist = res.data.data.menulist;
          var snkey = res.data.data.snkey;
          window.sessionStorage.setItem('user', JSON.stringify(userI));
          window.sessionStorage.setItem('menulist', JSON.stringify(mlist));
          window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
          this.$emit('dingLogin');
        }
        return res;
      } catch (e) {
        console.log(e);
        this.$notify.danger({ content: "系统连接错误！！" });
      }
    },
     // 再次登录方法
     async loginRemote1() {
       console.log(this.tel)
      var logindata = {
        apiId: global.APIID_OUTLOGIN,
        dbid: global.DBID,
        usercode: this.tel, //用户名
        ioutsys: 1 //天心选择web端 钉钉。。。
      };
      try {
        var res = await this.getDataByAPINew(logindata);
        if(res.data.id ==0){
          var userI = res.data.data.user;
          var mlist = res.data.data.menulist;
          var snkey = res.data.data.snkey;
          window.sessionStorage.setItem('user', JSON.stringify(userI));
          window.sessionStorage.setItem('menulist', JSON.stringify(mlist));
          window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
          this.$emit('dingLogin');
        }
        return res;
      } catch (e) {
        console.log(e);
        this.$notify.danger({ content: "系统连接错误！！" });
      }
    },
    // (1)用户对象保存
    async saveInsuser() {
      // 1.校验字段是否为空
      let _this = this;
      if (this.name == "") {
        _this.$notify.danger({ content: "用户名不能为空" });
      }else if(this.gsname == "") {
        _this.$notify.danger({ content: "公司名不能为空" });
      } else if (this.tel == "") {
        _this.$notify.danger({ content: "手机号不能为空" });
      } else if (this.code == "") {
        _this.$notify.danger({ content: "验证码不能为空" });
      } else if (this.password == "") {
        _this.$notify.danger({ content: "密码不能为空" });
      } else if (this.type == "") {
        _this.$notify.danger({ content: "注册类型不能为空" });
      } else {
        // 2.校验手机号码是否存在
        await this.getTel();
    
        if (this.existence > 0) {
            _this.$no
            tify.danger({ content: "该手机号已被注册" });
        } 
         else {
         // 3.校验验证码是否正确
          const url = this.smsRUL+"ckxcode";
           let posParams = {tels:this.tel,xcode:this.code};
           await axios.post(url, qs.stringify(posParams)).then(res=>{
             if(res.data.type!=0){
              _this.$notify.danger({ content: res.data.info });
             }
             else{
            this.saveLonginUppwd()
             }
           })
           .catch(err=>{
             console.log(err)
           })
         }
      }
    },
    //(2) 检查手机号是否存在
     async getTel() {
      let data2 = {
        dbid: global.DBID,
        usercode: "123456",
        apiId: global.APIID_AIDO,
        page: 1,
        assistid: "SOPRTEL", //辅助名称
        currentPage: 1, //页数
        pageSize: 20, //每页条数
        cont: "~usrcode=" + "'" + this.tel + "'"
      };
       await this.getDataByAPINewSync(data2).then(res => {
        this.existence = res.data.data;
       console.log('55555');
         console.log(res);
         console.log('5555');
      });
    },
      // 判断是否为手机号  
        isPhone(tel) {  
            var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;  
            if (phoneReg.test(tel)) {  
             return true;  
            } else {  
          return false;  
           }       
        },  


    // 保存账户信息
    saveInsuData() {
        // 对象保存  
            let jsonstr = {
              usrname:this.name,
              usrcode:this.tel,
              tel:this.tel,
              password:'yVZncpbC',
              orgcode:this.tel,
              gwcode:this.type,
              usrattr:3
              }; //对象字段信息
            ///主键  是按对象设置生成
            var data1 = {
                "dbid": `${global.DBID}`,
                "usercode":"123456",
                "apiId": "savedata", 
                "pcell": '6003',// 对象标识
                "jsonstr":JSON.stringify(jsonstr),
                "datatype":1,


            };
            console.log('111111111');
            let _this =this; 
            axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
                console.log(res.data)
                if(res.data.id==0){
                    //调用部门的保存
                     this.saveInsuData1();
//调用客户，供应商或者合作商的保存
//需要将触发器去掉在做 
                       if(this.type=='001'){
                            this.khsave();
                       }else  if(this.type=='002'){
                            this.gyssave();
                       }else{
                         this.hzssave();
                       }
                    _this.$notify.success({content:'保存成功'}) 
                }else{
                    _this.$notify.danger({content:'保存失败'})
                }
            }) .catch(err=>{
                console.log(err)
                _this.$notify.danger({content:'系统故障！'})
                _this.loading=0;
            })  
        this.upPwd();
    },
  // 保存部门账户信息
    saveInsuData1() {  
            let jsonstr = {
              orgcode:this.tel,
              orgname:this.gsname,
              corg:1,
              blast:1,
              cattr:0     
              }; //对象字段信息
            ///主键  是按对象设置生成
            console.log(jsonstr);
            var data1 = {
                "dbid": `${global.DBID}`,
                "usercode":"123456",
                "apiId": "savedata", 
                "pcell": '6004',// 对象标识
                "jsonstr":JSON.stringify(jsonstr),
                "datatype":1,
            };
              let _this =this; 
            axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
                console.log(res.data)
                if(res.data.id==0){
                //    _this.$notify.success({content:'保存成功'}) 
                }else{
                  //  _this.$notify.danger({content:'保存失败'})
                }
            }) .catch(err=>{
                console.log(err)
               // _this.$notify.danger({content:'系统故障！'})
                _this.loading=0;
            })  
         
   
    },
    //保存客户信息
       khsave(){
           let jsonstr = {
             usrcode:this.tel,
             usrname:this.name,
             tel:this.tel,
             gsname:this.gsname,
                
              }; //对象字段信息
            ///主键  是按对象设置生成
            console.log(jsonstr);
            var data1 = {
                "dbid": `${global.DBID}`,
                "usercode":"123456",
                "apiId": "savedata", 
                "pcell": '3005',// 对象标识
                "jsonstr":JSON.stringify(jsonstr),
                "datatype":1,
            };
                let _this =this; 
            axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
                console.log(res.data)
                if(res.data.id==0){
             //       _this.$notify.success({content:'保存成功'}) 
                }else{
                //    _this.$notify.danger({content:'保存失败'})
                }
            }) .catch(err=>{
                console.log(err)
               // _this.$notify.danger({content:'系统故障！'})
                _this.loading=0;
            })  
         
    },

 //保存供应商信息
       gyssave(){
           let jsonstr = {
              usrcode:this.tel,
             usrname:this.name,
             tel:this.tel,
             gsname:this.gsname,
                  
              }; //对象字段信息
            ///主键  是按对象设置生成
            console.log(jsonstr);
            var data1 = {
                "dbid": `${global.DBID}`,
                "usercode":"123456",
                "apiId": "savedata", 
                "pcell": '3006',// 对象标识
                "jsonstr":JSON.stringify(jsonstr),
                "datatype":1,
            };
                let _this =this; 
            axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
                console.log(res.data)
                if(res.data.id==0){
                //    _this.$notify.success({content:'保存成功'}) 
                }else{
              //      _this.$notify.danger({content:'保存失败'})
                }
            }) .catch(err=>{
                console.log(err)
              //  _this.$notify.danger({content:'系统故障！'})
                _this.loading=0;
            })  
         
    },

 //保存合作商信息
       hzssave(){
           let jsonstr = {
              usrcode:this.tel,
             usrname:this.name,
             tel:this.tel,
             gsname:this.gsname,
                 
              }; //对象字段信息
            ///主键  是按对象设置生成
            console.log(jsonstr);
            var data1 = {
                "dbid": `${global.DBID}`,
                "usercode":"123456",
                "apiId": "savedata", 
                "pcell": '3007',// 对象标识
                "jsonstr":JSON.stringify(jsonstr),
                "datatype":1,
            };
                let _this =this; 
            axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
                console.log(res.data)
                if(res.data.id==0){
                 //   _this.$notify.success({content:'保存成功'}) 
                }else{
                 //   _this.$notify.danger({content:'保存失败'})
                }
            }) .catch(err=>{
                console.log(err)
              //  _this.$notify.danger({content:'系统故障！'})
                _this.loading=0;
            })  
         
    },





    // 更新账户密码
    async upPwd(){
        var uppwddata = {
            apiId: global.APIID_UPMYPWD,
            dbid: global.DBID,
            usercode: this.tel,//需要修改密码的用户
            oldPwd: this.base64Encode("123456"),
            newPwd: this.base64Encode(this.password),
        } 
        console.log(uppwddata);
        var res = await this.getDataByAPINew(uppwddata);
        console.log("密码更新");
        //调用跳转
        this.change();
        console.log('66666')
        console.log(res)
        console.log('77777')
    },
    //跳转到首页
    async  change(){
          window.sessionStorage.clear();
         this.$router.push({ path: "/", name: "" });
      
    },
    //获取短信验证码
    getCode (){
      if (this.tel == "") {
        this.$notify.danger({ content: "手机号不能为空" });
        return;
      }
        var isPh= this.isPhone(this.tel);
      if(isPh==false){
         this.$notify.danger({ content: "手机号输入错误" });
           return;
          // console.log("号码错误");
      }


      const url = this.smsRUL+"/xcode";
      let posParams = {tels:this.tel,title:this.smsTitle,fhxcode:0};
      axios.post(url, qs.stringify(posParams)).then(res=>{
        if(res.data.type ==0){
          this.$notify.success({ content: res.data.info });
        }else{
          this.$notify.danger({ content: "验证码发送失败" });
        }
      })
      .catch(err=>{
        console.log(err)
      })
      const TIME_COUNT = 60;
     if (!this.timer) {
       this.count = TIME_COUNT;
       this.show = false;
       this.timer = setInterval(() => {
       if (this.count > 0 && this.count <= TIME_COUNT) {
         this.count--;
        } else {
         this.show = true;
         clearInterval(this.timer);
         this.timer = null;
        }
       }, 1000)
      }
    }
      
    
  }
};
</script>
<style >
.register {
  width: 100%;
  height: 100%;
}
.top-bkg image {
  width: 100%;
}
.content {
  margin: 10px;
}
.lable {
  margin-right: 10px;
}
.reg-btn {
  margin-top: 10px;
  text-align: center;
}
.reg-btn-con {
  padding: 3px 80px;
}
</style>