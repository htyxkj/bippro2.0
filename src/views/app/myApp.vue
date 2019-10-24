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
      <template v-if="isLoginPage == 3">
        <md-bottom-bar @change="bottomBar" style="z-index:50">
          <md-bottom-bar-item md-icon="home" md-active>首页</md-bottom-bar-item>
          <md-bottom-bar-item md-icon="menu">菜单</md-bottom-bar-item>
          <md-bottom-bar-item md-icon="message">消息</md-bottom-bar-item>
          <md-bottom-bar-item md-icon="supervisor_account">我的</md-bottom-bar-item>
        </md-bottom-bar>
      </template>
    </div>
    <div v-else>
      <app-login v-if="isLoginPage == 0" @emitLogin="emitLogin"></app-login>
      <!-- 登录页 -->
      <app-blank v-else-if="isLoginPage == 1" @blankLogin="emitLogin"></app-blank>
      <!-- 单点登录页 -->
      <app-ding v-else-if="isLoginPage == 2" @dingLogin="emitLogin"></app-ding>
      <!-- 钉钉登录页 -->
      <wx-applets v-else-if="isLoginPage == 3" @appletsLogin="emitLogin"></wx-applets>
      <!-- 微信小程序登录页 -->

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

export default {
  name: "myapp",
  data() {
    return {
      mdToken: "bbb",
      mdTitle: "",
      isLogin: false,
      isLoginPage: -1,
      loginSuccess:-1
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
  created(){
    let cc = this.$route.query.loginSuccess;
    if(cc)
      this.loginSuccess = cc;
  },
  methods: {
    created() {},
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
    emitLogin() {
      console.log("登陆成功")
      this.isLogin = true;
      window.sessionStorage.setItem("isLogin", JSON.stringify(this.isLogin));
      var ua = window.navigator.userAgent.toLowerCase();//获取判断用的对象
      let _this = this;
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
            wx.miniProgram.getEnv(function(res) {
            if (res.miniprogram) {
                // 走在小程序的逻辑
           if(_this.$route.path == "/" || _this.$route.path == "/index" || _this.$route.path == "/WxApplets")
                _this.isLoginPage = 3;
            } else {
                // 走不在小程序的逻辑
                // alert("走不在小程序的逻辑2")
            }
        }) 
      }else{

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
      if (this.$route.path == "/blank") {
        this.isLoginPage = 1;
        window.sessionStorage.setItem("isLoginPage", 1);
      } else if (this.$route.path == "/ding") {
        this.isLoginPage = 2;
        this.isLogin = true;
        window.sessionStorage.setItem("isLoginPage", 2);
      }
      if (this.$route.path == "/wxApplets") {
        this.isLoginPage = 3;
        this.isLogin = true;
        window.sessionStorage.setItem("isLoginPage", 3);
      }

      if (this.$route.path == "/register") {
        this.isLoginPage = 4;
        this.isLogin = true;
        window.sessionStorage.setItem("isLoginPage", 4);
      }
      else if (this.$route.path == "/JCMap") {
        let usercode = this.$route.query.usercode;
        // pbuid=4003&pmenuid=4003&title=设计核查报表
        this.emitLogin();
        return;
      } else {
        let lp = window.sessionStorage.getItem("isLoginPage");
        this.isLoginPage = 0;
        if (lp) {
          this.isLoginPage = lp;
        }
        var lid = window.sessionStorage.getItem("isLogin");
        if (lid) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
      }
    }
  },
  async mounted() {
    // let isLoginPage = window.sessionStorage.getItem('isLoginPage');
    // console.log(isLoginPage);
    // this.isLoginPage = isLoginPage;
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



