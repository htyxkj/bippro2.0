<template>
<div class="layout-fill">
    <div  v-if="isLogin" class="md-app layout-fill layout-column flex">
      <div v-if="isLoginPage != 2">
        <bip-menus ref="menu" :md-token="mdToken" :md-title="mdTitle"></bip-menus>
        <app-toolbar ref="toolbar" @toggle="toggle" :md-token="mdToken" :md-title="mdTitle" @logout="exit"></app-toolbar>
      </div>
      <app-content class="layout-fill flex md-part layout-column"></app-content>   
  </div>
  <div v-else> 
    <app-login v-if="isLoginPage == 0"  @emitLogin="emitLogin"></app-login><!-- 登录页 -->
    <app-blank v-else-if="isLoginPage == 1"  @blankLogin="emitLogin"></app-blank><!-- 单点登录页 -->
    <app-ding v-else-if="isLoginPage == 2"  @dingLogin="emitLogin"></app-ding><!-- 钉钉登录页 -->
  </div>
</div>
</template>
<script>
import appToolbar from './myAppToolbar';
import appContent from './myAppContent';
import bipMenu from './bipMenus';
import Login from '../Login';
import Blank from '../../components/Blank';
import Ding from '../../components/Ding';
export default {
  name: 'myapp',
  data () {
    return {
      mdToken: 'bbb',
      mdTitle: '',
      isLogin: false,
      isLoginPage:-1,
    }

  },
  components:{'app-toolbar':appToolbar,'app-content':appContent,'bip-menus': bipMenu,'app-login':Login,'app-blank':Blank,'app-ding':Ding},
  methods: {
    created(){ 
      
    },
    toggle() { 
      // if(this.$route.path != '/task' &&this.$route.path != '/msg' &&this.$route.path != '/blank') 
      if(!this.$route.query.othersys || this.$route.query.othersys == 0){
        if(this.$refs.menu){
          this.$refs.menu.toggle(); 
        }
      }else{
        this.$route.query.othersys = 0
      }
      this.setTitle();
    },
    setTitle() {
      if(this.$route.query.title){
        this.mdTitle = this.$route.query.title
        var isPc = this.ISPC();
        if (!isPc) {
          let cc = "";
          var arr = this.mdTitle.split("");
          for(var i=0;i<arr.length;i++){
            let a = arr[i];
            if(a != "" && a !=" "){
              cc+=a;
            }
          }
          arr = cc.split("");
          if(arr.length>4){
            this.mdTitle = arr[0]+arr[1]+arr[2]+arr[3]+'...'
          }else{
            this.mdTitle = cc;
          }
        }
        // console.log(this.mdTitle)  
      }else{
        if(this.$route.path == '/' || this.$route.path == '/index'){
          this.mdTitle = '首页';
        }else if(this.$route.path == '/task'){
          this.mdTitle = '任务';
        }else if(this.$route.path == '/msg'){
          this.mdTitle = '消息';
        }else if(this.$route.path == '/JCMap'){
          this.mdTitle = '架次查询';
        }else{
          this.mdTitle = this.$route.path;
        }
      }
    },
    emitLogin(){
      this.isLogin = true;
      window.sessionStorage.setItem('isLogin', JSON.stringify(this.isLogin))
    },
    blankLogin(){
      this.isLogin = true;
      this.isLoginPage=0;
      window.sessionStorage.setItem('isLogin', JSON.stringify(this.isLogin))
    },
    exit() {
      window.sessionStorage.clear();
      this.$router.push({path:'/',name:''})
      this.isLogin = false;
    }, 
  },
  async mounted(){
    // let isLoginPage = window.sessionStorage.getItem('isLoginPage');
    // console.log(isLoginPage);
    // this.isLoginPage = isLoginPage;
    if(this.$route.path == '/blank'){
      this.isLoginPage=1;
      window.sessionStorage.setItem('isLoginPage', 1)
    }else if(this.$route.path == '/ding'){
      this.isLoginPage=2;
      this.isLogin = true;
      window.sessionStorage.setItem('isLoginPage', 2)
    }else if(this.$route.path == '/JCMap'){
      let usercode = this.$route.query.usercode
      // pbuid=4003&pmenuid=4003&title=设计核查报表
      this.emitLogin()
      return;
    }else{
        this.isLoginPage=0;
        var lid = window.sessionStorage.getItem('isLogin');
        if(lid){
          this.isLogin = true;
        }else{
          this.isLogin = false;
        } 
    }
    this.setTitle();
  },
  watch: {
    '$route': 'toggle'
  }
};
</script>

<style lang="scss">

.bipcontent{
  overflow: scroll;
}

</style>



