<template>
  <div class="register">
    <div class="top-bkg">
      <img src="../../../src/img/register/bkgsa.png" alt />
    </div>
    <div class="content">
      <md-input-container>
        <md-icon class="md-accent">people</md-icon>
        <label >用户名</label>
        <md-input v-model="name" required></md-input>
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
          <md-option value="001">管理中心</md-option>
          <md-option value="002">被监督单位</md-option>
          <md-option value="003">监督员</md-option>
        </md-select>
      </md-input-container>
    
    <!-- <checkbox class="zctk"  v-model="checkbox" Style="zoom: 80%" >  
      <label>已阅读并同意<a @click="go"> 《软件许可及服务协议》</a>      </label>
    </checkbox> -->

        <div>
          <input type="checkbox" class="zctk"  v-model="checkbox" Style="zoom: 100%" >
              <label class="zctkl">已阅读并同意<a @click="go"> 《软件许可及服务协议》</a>      </label>
        </div>


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
      smsRUL:'https://www.bip-soft.com/ssms/',
      smsTitle:'华泰益兴科技',
      show: true,
      count: '',
      timer: null,
      checkbox:false,
    };
  },
  created() {
    this.loginRemote();
    console.log("cc");

     this.tel = this.$route.query.tel;
      this.name=this.$route.query.name;
      this.code=this.$route.query.code;
      this.password=this.$route.query.password;
      this.type=this.$route.query.type;

      console.log(this.tel);
      console.log(this.name);
      console.log(this.type);
      console.log(this.type);





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
      var logindata = {
        apiId: global.APIID_OUTLOGIN,
        dbid: global.DBID,
        usercode: "100003", //用户名
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
 // 再次登录方法
     async loginRemote1() {
      console.log("再次登录成功")
      var logindata = {
        apiId: global.APIID_OUTLOGIN,
        dbid: global.DBID,
        usercode:this.tel, //用户名
        ioutsys: 1 //天心选择web端 钉钉。。。
      };
      try {
        var res = await this.getDataByAPINew(logindata);
        this.$emit('dingLogin');
        var userI = res.data.data.user;
        var mlist = res.data.data.menulist;
        var snkey = res.data.data.snkey;
        window.sessionStorage.setItem('user', JSON.stringify(userI));
        window.sessionStorage.setItem('menulist', JSON.stringify(mlist));
        window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
        return res;
      } catch (e) {
        console.log(e);
        this.$notify.danger({ content: "系统连接错误！！" });
      }
    },

        async go(){
          this.$router.push({
          path:'/zcxy',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            tel : this.tel,
           name : this.name,
           code:this.code,
           password:this.password,
           type:this.type

          }
        })
        },



    // (1)用户对象保存
    async saveInsuser() {
      // 1.校验字段是否为空
      let _this = this;
      if (this.name == "") {
        _this.$notify.danger({ content: "名称不能为空" });
      } else if (this.tel == "") {
        _this.$notify.danger({ content: "手机号不能为空" });
      } else if (this.code == "") {
        _this.$notify.danger({ content: "验证码不能为空" });
      } else if (this.password == "") {
        _this.$notify.danger({ content: "密码不能为空" });
      } else if (this.type == "") {
        _this.$notify.danger({ content: "注册类型不能为空" });
      }else if (this.checkbox == false) {
        _this.$notify.danger({ content: "是否同意注册协议" });
      }
       else {
        // 2.校验手机号码是否存在
          
        await this.getTel();
        if (this.existence > 0) {
            _this.$notify.danger({ content: "该手机号已被注册" });
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
        usercode: "100003",
        apiId: global.APIID_AIDO,
        page: 1,
        assistid: "SOPRTEL", //辅助名称
        currentPage: 1, //页数
        pageSize: 20, //每页条数
        cont: "~usrcode=" + "'" + this.tel + "'"
      };
       await this.getDataByAPINewSync(data2).then(res => {
        this.existence = res.data.total;
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
      let jsonstr = {
        usrname: this.name,
        usrcode: this.tel,
        tel: this.tel,
        gwcode: this.type,
        orgcode: "2",
        usrattr: "3",
        dlstate:1,
        password:'yVZncpbC'
      };
      console.log(jsonstr);
      var data1 = {
        dbid: `${global.DBID}`,
        usercode: "100003",
        apiId: "savedata",
        pcell: "6003", // 对象标识
        jsonstr: JSON.stringify(jsonstr),
        datatype: 1
      };
      let _this = this;
      axios
        .post(`${global.BIPAPIURL}` + `${global.API_COM}`, qs.stringify(data1))
        .then(res => {
          if (res.data.id == 0) {
            _this.$notify.success({ content: "保存成功" });
            // 页面跳转

            this.change()
          } else {
            _this.$notify.danger({ content: "保存失败" });
          }
        })
        .catch(err => {
          console.log(err);
          _this.$notify.danger({ content: "系统故障！" });
          _this.loading = 0;
        });

        this.upPwd();
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
        var res = await this.getDataByAPINew(uppwddata);
        console.log("密码更新");
        console.log(res)
       
    },
    async  change(){
       if(this.type == '001'){
          await this.$router.push({  
          path:'/agent',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            tel : this.tel,
           name : this.name

          }
        })
       }else if (this.type == '002'){
         await this.$router.push({  
          path:'/company',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            tel : this.tel,
            name : this.name
          }
        })
       }else  if(this.type == '003'){
         await this.$router.push({  
          path:'/check',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            tel : this.tel
          }
        })
       }
      
    },
    //获取短信验证码
    async  getCode (){
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
         await this.getTel();
        if (this.existence > 0) {
            this.$notify.danger({ content: "该手机号已被注册" });
            console.log('5555555s');
            return
        } 
        console.log('5555555s');


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
.top-bkg {
  width: 100%;

}
img{
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
.zctk{
  color: #6b6b6b;
  text-align: center;
  
}
.zctkl{
  color: #6b6b6b;
}
</style>