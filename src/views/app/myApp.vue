<template>
  <div class="layout-fill">
    <div v-if="isLogin" class="md-app layout-fill layout-column flex">
      <div v-if="isLoginPage == 0 || isLoginPage == -1 || isLoginPage == 1">
        <bip-menus ref="menu" :md-token="mdToken" :md-title="mdTitle"></bip-menus>
        <app-toolbar
          ref="toolbar"
          @toggle="toggle"
          :md-token="mdToken"
          :md-title="mdTitle"
          @logout="exit"
        ></app-toolbar>
      </div>
      <app-content class="layout-fill flex md-part layout-column"></app-content>
      <!-- <template v-if="isLoginPage == 3 || isLoginPage == 2">   -->
        <!-- <md-bottom-bar @change="bottomBar" style="z-index:50">
          <md-bottom-bar-item md-icon="home" :md-active="getBarActive('home')">首页</md-bottom-bar-item>
          <md-bottom-bar-item md-icon="menu" :md-active="getBarActive('menu')">菜单</md-bottom-bar-item>
          <md-bottom-bar-item md-icon="message" :md-active="getBarActive('message')">消息</md-bottom-bar-item>
          <md-bottom-bar-item md-icon="supervisor_account" :md-active="getBarActive('supervisor_account')">我的</md-bottom-bar-item>
        </md-bottom-bar> -->
       <!-- </template> -->
    </div>
    <div v-else>
      <!-- 登录页 -->
      <app-login v-if="isLoginPage == 0" @emitLogin="emitLogin"></app-login>
      <!-- 单点登录页 -->
      <app-blank v-else-if="isLoginPage == 1" @blankLogin="emitLogin"></app-blank>

      <!-- 钉钉登录页 -->
      <app-ding v-else-if="isLoginPage == 2" @dingLogin="emitLogin"></app-ding>
      <!-- 微信小程序登录页 -->
      <wx-applets v-else-if="isLoginPage == 3" @appletsLogin="emitLogin"></wx-applets>
      

      <!--食品监管注册页面  -->
      <app-register v-else-if="isLoginPage == 4" @dingLogin="emitLogin"></app-register>
      <!-- 注册登录页 -->
    </div>
  </div>
</template>
<script>
import appToolbar from "./myAppToolbar";
import appContent from "./myAppContent";
import bipMenu from "./bipMenus";
import Login from "../Login";
import Blank from "../../components/Blank";
import Ding from "../../components/Ding";
import wxApplets from "../../components/wxApplets/WxApplets.vue";
import register from "../register/register";
import mobile from './mobileJS/mobileInit.js' 

export default {
  mixins:[mobile],
  name: "myapp",
  data() {
    return {
      mdToken: "bbb",
      mdTitle: "",
      isLogin: false,
      isLoginPage: -1,
    };
  },
  components: {
    "app-toolbar": appToolbar,
    "app-content": appContent,
    "bip-menus": bipMenu,
    "app-login": Login,
    "app-blank": Blank,
    "app-ding": Ding,
    "app-register": register,
    "wx-applets": wxApplets
  },
  async created(){
    
  },
  methods: {
    toggle() {
      // if(this.$route.path != '/task' &&this.$route.path != '/msg' &&this.$route.path != '/blank')
      var lid = window.sessionStorage.getItem("isLogin");
      console.log(lid);
      if (lid) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
        this.isLoginPage = 0;
        this.chekcRoutePath();
        return;
      }
      if (!this.$route.query.othersys || this.$route.query.othersys == 0) {
        if (this.$refs.menu) {
          this.$refs.menu.toggle();
        }
      } else {
        this.$route.query.othersys = 0;
      }
      this.setTitle();
    },
    setTitle() {
      if (this.$route.query.title) {
        this.mdTitle = this.$route.query.title;
        var isPc = this.ISPC();
        if (!isPc) {
          let cc = "";
          var arr = this.mdTitle.split("");
          for (var i = 0; i < arr.length; i++) {
            let a = arr[i];
            if (a != "" && a != " ") {
              cc += a;
            }
          }
          arr = cc.split("");
          if (arr.length > 4) {
            this.mdTitle = arr[0] + arr[1] + arr[2] + arr[3] + "...";
          } else {
            this.mdTitle = cc;
          }
        }
        // console.log(this.mdTitle)
      } else {
        if (this.$route.path == "/" || this.$route.path == "/index") {
          this.mdTitle = "首页";
        } else if (this.$route.path == "/task") {
          this.mdTitle = "任务";
        } else if (this.$route.path == "/msg") {
          this.mdTitle = "消息";
        } else if (this.$route.path == "/JCMap") {
          this.mdTitle = "架次查询";
        } else {
          this.mdTitle = this.$route.path;
        }
      }
    },
    mobileNoLogin(){
      this.isLogin = false;
      this.isLoginPage = 0;
    },
    emitLogin(checkRoute) {
      console.log("其他页面登录方法执行完成");
      if(checkRoute){
        this.$router.push({ path: "/"+checkRoute });
      }
      this.isLogin = true;
      window.sessionStorage.setItem("isLogin",true);
      let lp = window.sessionStorage.getItem("isLoginPage");
      this.isLoginPage = 0;
      if (lp) {
        this.isLoginPage = lp;
      }
      // console.log("登陆成功")
      // this.isLogin = true;
      // window.sessionStorage.setItem("isLogin", JSON.stringify(this.isLogin));
      // var ua = window.navigator.userAgent.toLowerCase();//获取判断用的对象
      // let _this = this;
      // if (ua.match(/MicroMessenger/i) == "micromessenger") {
      //       wx.miniProgram.getEnv(function(res) {
      //       if (res.miniprogram) {
      //           // 走在小程序的逻辑
      //      if(_this.$route.path == "/" || _this.$route.path == "/index" || _this.$route.path == "/WxApplets")
      //           _this.isLoginPage = 3;
      //       } else {
      //           // 走不在小程序的逻辑
      //           // alert("走不在小程序的逻辑2")
      //       }
      //   }) 
      // }else{

      // }
    },
    //初始化登录后底部按钮栏选中的按钮  默认为home,
    getBarActive(barid){
      if(this.$route.name == 'WxApplets' && barid == 'home'){
        return true;
      }else if(this.$route.name == 'WxAppletsMenu' && barid == 'menu'){
        return true;
      }else if(this.$route.name == 'WxAppletsMsg' && barid == 'message'){
        return true;
      }else if(this.$route.name == 'WxAppletsMe' && barid == 'supervisor_account'){
        return true;
      }else{
        return false
      } 
    },
    blankLogin() {
      this.isLogin = true;
      this.isLoginPage = 0;
      window.sessionStorage.setItem("isLogin", JSON.stringify(this.isLogin));
    },
    exit() {
      window.sessionStorage.clear();
      this.$router.push({ path: "/", name: "" });
      this.isLogin = false;
    },
    bottomBar(route) {
      if (route == 0) this.$router.push({ path: "/wxApplets" });
      if (route == 1) this.$router.push({ path: "/wxAppletsMenu" });
      if (route == 2) this.$router.push({ path: "/wxAppletsMsg" });
      if (route == 3) this.$router.push({ path: "/wxAppletsMe" });
    },
    chekcRoutePath(){
      // alert(this.$route.path)
      if (this.$route.path == "/blank") {
        this.isLoginPage = 1;
        window.sessionStorage.setItem("isLoginPage", 1);
      } else if (this.$route.path == "/ding") {
        this.isLoginPage = 2;
        this.isLogin = true;
        window.sessionStorage.setItem("isLoginPage", 2);
      }else if (this.$route.path == "/wxApplets") {
        this.isLoginPage = 3;
        this.isLogin = true;
        window.sessionStorage.setItem("isLoginPage", 3);
      }else if (this.$route.path == "/mobileWD") {

      }else if (this.$route.path == "/register") {
        this.isLoginPage = 4;
        this.isLogin = true;
        window.sessionStorage.setItem("isLoginPage", 4);
      }else if (this.$route.path == "/JCMap") {
        let usercode = this.$route.query.usercode;
        this.emitLogin();
      } else {
        var lid = window.sessionStorage.getItem("isLogin");
        if (lid) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
        let lp = window.sessionStorage.getItem("isLoginPage");
        this.isLoginPage = 0;
        if (lp) {
          this.isLoginPage = lp;
        }
      }
    },

  },
  async mounted() {
    await this.mobileLogin(this.$route,this.emitLogin,this.mobileNoLogin);
    this.chekcRoutePath();
    this.setTitle();
  },
  watch: {
    $route: "toggle"
  }
};
</script>

<style lang="scss">
.bipcontent {
  overflow: scroll;
}
</style>



