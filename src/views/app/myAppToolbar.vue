<template>
  <md-toolbar>
    <md-button class="md-icon-button" @click.native="toggle()">
      <md-icon>menu</md-icon>
    </md-button>
    <h2 class="md-title">{{mdTitle}}</h2>
    <div class="md-flex">
      <!-- <md-input-container class="md-flex md-header-search">
        <md-input class="md-header-search-input" placeholder="搜索"></md-input>
      </md-input-container> --> 
    </div>
    <div style="font-size:20px" v-if="ISPC()">
      <!-- 顶部栏显示名称 -->
        {{cmcName}} 
    </div>
    <md-button class="md-icon-button" md-menu-trigger  @click="isQP"> 
        <md-tooltip md-direction="left">{{qpText}}</md-tooltip>
        <md-icon>open_with</md-icon>
    </md-button> 
    <md-menu v-if="TOOL_RABBITMQ" md-direction="bottom left" ref="taskMSG">
      <md-button class="md-icon-button" md-menu-trigger>
        <span class="bip-badge" v-if="counts>0">{{counts}}</span>
        <md-icon>notifications</md-icon>
      </md-button>
      <md-menu-content>
        <md-list class="custom-list">
          <md-list-item class="bip-task-item">
            <router-link to='/task' @click.native="selItem">
              <div class="md-table-cell-container">我的任务</div>
              <span class="badge badge-info" >+{{taskNum}}</span>
            </router-link>
          </md-list-item>
          <md-list-item class="bip-task-item">
            <router-link to='/msg' @click.native="selItem">
              <div class="md-table-cell-container">我的消息</div>
              <span class="badge badge-success" >+{{msgNum}}</span>
            </router-link>
          </md-list-item>
        </md-list>
      </md-menu-content>
    </md-menu>
    <md-menu md-direction="bottom left" ref="menuUser" class="bip-task">
      <md-button class="md-icon-button md-avatar" md-menu-trigger>
        <md-avatar>
          <img src="../../img/avatar/1.jpg">
        </md-avatar>
      </md-button>
      <md-menu-content>
        <md-card class="md-primary">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{user.userName}}</div>
              <div class="md-subhead">{{user.userCode}}</div>
            </md-card-header-text>
            <md-card-media>
              <img src="../../img/avatar/1.jpg" alt="People">
            </md-card-media>
          </md-card-header>
          <md-menu md-direction="bottom left" ref="menuEnts">
            <md-button md-menu-trigger>{{deptInfo.cmcName}}
              <md-icon>arrow_drop_down</md-icon>
            </md-button>
            <md-menu-content>
              <!-- <md-menu-item v-for="item in $root.userData.ents" :key="item">{{item.name }}</md-menu-item> -->
            </md-menu-content>
          </md-menu>
          <md-card-actions>
            <div class="layout-row layout-fill layout-align-space-between-center">
              <!-- <md-button>下载客户端</md-button> -->
              <md-button @click="upMyPwd">修改密码</md-button>
              <md-button @click="logOut">退出</md-button>
            </div>
          </md-card-actions>
        </md-card>
      </md-menu-content>
    </md-menu>
    <md-dialog ref="uppwddialog"  style="z-index:200;" class="md-refs-dialog " >
      <md-toolbar>  
        <md-layout md-gutter md-flex="100" md-row>
          <md-layout md-flex-xsmall="90" :md-flex="true" style=" margin-top: .12rem;">
            <h1 class="md-title">修改密码</h1> 
          </md-layout> 
          <md-layout md-flex-xsmall="10" md-flex-small="10" md-flex-medium="10" md-flex-large="10" >
            <md-button class="md-icon-button" @click.native="cancel()">
              <md-icon>close</md-icon>
            </md-button>   
          </md-layout>
        </md-layout> 
      </md-toolbar>
      <md-dialog-content>
        <md-layout md-flex="100">
          <md-layout md-flex="100" >
            <md-input-container md-has-password>
              <label>原密码</label>
              <md-input type="password" v-model="oldpwd"></md-input>
            </md-input-container>
          </md-layout>
          <md-layout md-flex="100" >
            <md-input-container md-has-password>
              <label>新密码</label>
              <md-input type="password" v-model="newpwd"></md-input>
            </md-input-container>
          </md-layout>
          <md-layout md-flex="100" >
            <md-input-container md-has-password>
              <label>重复新密码</label>
              <md-input type="password" v-model="newpwd1"></md-input>
            </md-input-container>
          </md-layout>
        </md-layout> 
      </md-dialog-content>
      <md-dialog-actions> 
        <md-button class="md-accent md-raised" @click.native="close()">确定</md-button>
        <md-button class="md-warn" @click.native="cancel()">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-toolbar>
</template>
<script>
const BIPTASK = "biptask",BIPMSG = "bipmsg";
import Stomp from "stompjs";
import qs from 'qs'
import axios from 'axios' 
export default {
  data() {
    return {
      user: {},
      deptInfo: {},
      client: null,
      taskNum: 0,
      msgNum: 0,
      isconnt: false,
      qp:false,
      qpText:"全屏",
      cmcName:this.$t('sysTitle'),
      TOOL_RABBITMQ:global.TOOL_RABBITMQ,
      oldpwd:"",
      newpwd:"",
      newpwd1:"",
    };
  },
  props: {
    mdToken: String,
    mdTitle: String
  },
  created() {
    //启用RabbitMQ
    if(global.TOOL_RABBITMQ){
      if (!this.isconnt) this.connectQ();
    }
  },
  methods: {
    toggle() {
      this.$emit("toggle");
    },
    async logOut() {
      if(this.isconnt)
        this.disconnect();
      this.$emit("logout");
    },
    onConnected: function(frame) {
      this.isconnt = true;
      // console.log("Connected: " + frame);
      //订阅频道
      var topic = "/exchange/" + BIPTASK + "/" + BIPTASK + "." + global.DBID + "." + this.user.userCode;
      var topic1 = "/exchange/" + BIPMSG + "/" + BIPMSG + "." + global.DBID + "." + this.user.userCode;
      // console.log(topic, topic1);
      this.client.subscribe(topic, this.responseCallback);
      this.client.subscribe(topic1, this.responseCallback);
      this.taskMsg(global.APIID_TM_ALL);
    },
    onFailed: function(frame) {
      // console.log("Failed: " + frame);
    },
    responseCallback: function(frame) {
      // console.log("responseCallback msg=>" + frame.body);
      var info = JSON.parse(frame.body);
      if (info.type === 1) {
        if (this.taskNum !== info.count) {
          this.taskNum = info.count;
          if(this.taskNum>0)
            this.$notify.warning({ content: "您有" + this.taskNum + "条任务未处理！" });
        }
      }
      if (info.type === 2) {
        this.msgNum = info.count;
        if(this.msgNum>0)
          this.$notify.info({ content: "您有" + this.msgNum + "条消息未处理！" });
      }
      // console.log(frame);
      // 接收消息
    },
    connectQ: function() {
      //初始化mqtt客户端，并连接mqtt服务 
      var ws = new WebSocket(global.MQTT_SERVICE);
      this.client = Stomp.over(ws);
      var headers = {
        login: global.MQTT_USERNAME, //用户名
        passcode: global.MQTT_PASSWORD, //密码
        host: global.MQTT_HOST // 虚拟空间
      };
      this.client.connect(headers, this.onConnected, this.onFailed);
    },
    disconnect() {
      this.client.disconnect();
    },
    selItem(path1){
      // console.log(path1);
      // this.$router.push({ path: path1 })
      this.$refs.taskMSG.close()
    },
    load(){
      if(window.sessionStorage.getItem('user')){
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.deptInfo = this.user.deptInfo;
      }
    },
    isQP(){
      if(this.qp==true){
        this.exitFullScreen();
        this.qp=false;
        this.qpText="全屏"
      }else{
        this.fullScreen();
        this.qp=true;
        this.qpText="退出全屏"
      }
    },
    //全屏
    fullScreen() {
      var el = document.documentElement;
      var rfs = el.requestFullScreen || el.webkitRequestFullScreen || 
          el.mozRequestFullScreen || el.msRequestFullScreen;
      if(typeof rfs != "undefined" && rfs) {
          rfs.call(el);
      } else if(typeof window.ActiveXObject != "undefined") {
          //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
          var wscript = new ActiveXObject("WScript.Shell");
          if(wscript != null) {
              wscript.SendKeys("{F11}");
          }
      }
    },
    //退出全屏
    exitFullScreen() {
      var el = document;
      var cfs = el.cancelFullScreen || el.webkitCancelFullScreen || 
          el.mozCancelFullScreen || el.exitFullScreen;
      if(typeof cfs != "undefined" && cfs) {
          cfs.call(el);
      } else if(typeof window.ActiveXObject != "undefined") {
          var wscript = new ActiveXObject("WScript.Shell");
          if(wscript != null) {
              wscript.SendKeys("{F11}");
          }
      }
    },
    //获取公司名称
    getCMCName(){ 
      let user = JSON.parse(window.sessionStorage.getItem('user')); 
      if(user == null){
        setTimeout(() => {
          this.getCMCName();
        }, 1000);
        return;
      } 
      let cmcCode = user.deptInfo.cmcCode
      let param={
          apiId:"assisto",
          dbid:`${global.DBID}`,
          usercode: JSON.parse(window.sessionStorage.getItem('user')).userCode,
          assistid:'SLNAME',
      }; 
      let _this = this;
      axios.post(global.BIPAPIURL+global.API_COM, qs.stringify(param)).then(res => {
        if(res.data.id &&res.data.id !=-1){

        }else if(res.data.code && res.data.code ==1){
          _this.cmcName=res.data.values[0][res.data.allCols[0]];
          
        }
      }); 
    },
    upMyPwd(){
      this.$refs["uppwddialog"].open()
    },
    cancel(){
      this.$refs["uppwddialog"].close()
    },
    async close(){
      if(this.newpwd != this.newpwd1){
        this.$notify.danger({content: '两次密码不一致！'});
        return;
      } 
      var uppwddata = {
        apiId: global.APIID_UPMYPWD,
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem('user')).userCode,
        oldPwd: this.base64Encode(this.oldpwd),
        newPwd: this.base64Encode(this.newpwd),
      }
      try{
        var res = await this.getDataByAPINew(uppwddata);
        this.upMyPwdSuccess(res);
      }catch(e){
        this.$notify.danger({content: '系统连接错误！'});
      } 
    },
    upMyPwdSuccess(res){
      let data = res.data;
      if(data.id == -1){
        this.$notify.danger({content: data.message});
      }else if(data.id == 0){
        this.$notify.success({content: data.message});
        this.logOut();
      }else{
        this.$notify.danger({content: '系统连接错误！'});
      }
    }
  },
  mounted() {
      this.load()
      this.getCMCName()
  },
  computed: {
    counts() {
      return this.taskNum + this.msgNum;
    }
  }
};
</script>

<style lang="scss" scoped>
.md-input-container.md-flex.md-header-search {
  margin: 0 0 0 60%;
  .md-header-search-input {
    border-radius: 0.04rem;
    width: 80%;
  }
}
// .md-input-container {
//   min-height: 0.3rem;
// }

.md-title {
  font-family: "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
  font-size: 0.18rem;
}

@media (max-width: 600px) {
  .md-title {
    font-family: "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
    font-size: 0.14rem;
  }
}

.md-input-container.md-has-value input {
  font-size: 0.14rem;
}

.md-avatar {
  width: 0.3rem;
  min-width: 0.3rem;
  height: 0.3rem;
  min-height: 0.3rem;
  border-radius: 0.3rem;
}
.bip-badge {
  position: absolute;
  right: 0;
  top: 3px;
  height: 15px;
  line-height: 15px;
  background-color: #f75d5d;
  color: #fff;
  border-radius: 15px;
  font-size: 0.14rem;
  text-align: center;
  white-space: nowrap;
  padding: 0 2px;
  z-index: 9;
}
.md-button.md-icon-button {
  border-radius: 0;
}

.md-list-item.bip-task-item{
    &.md-list-item-container{
      height: 0.48rem;
    }
}
.bip-task-item{
  min-height: .48rem;
  .md-list-item-container{
    height: 0.48rem;
  }
  .md-list.md-triple-line .md-list-item .md-list-item-container{
    min-height: 0.48rem;
  }
}
.md-list.md-triple-line .md-list-item .md-list-item-container {
    min-height: .48rem;
}
.badge {
 padding-top:1px;
 padding-bottom:3px;
 line-height:15px
}
.badge.radius-1 {
 border-radius:1px
}
.badge.radius-2 {
 border-radius:2px
}
.badge.radius-3 {
 border-radius:3px
}
.badge.radius-4 {
 border-radius:4px
}
.badge.radius-5 {
 border-radius:5px
}
.badge.radius-6 {
 border-radius:6px
}
.badge-transparent,.badge.badge-transparent,.label-transparent,.label.label-transparent {
 background-color:transparent
}
.badge-grey,.badge.badge-grey,.label-grey,.label.label-grey {
 background-color:#A0A0A0
}
.badge-info,.badge.badge-info,.label-info,.label.label-info {
 background-color:#3A87AD
}
.badge-primary,.badge.badge-primary,.label-primary,.label.label-primary {
 background-color:#428BCA
}
.badge-success,.badge.badge-success,.label-success,.label.label-success {
 background-color:#82AF6F
}
.badge-danger,.badge-important,.badge.badge-danger,.badge.badge-important,.label-danger,.label-important,.label.label-danger,.label.label-important {
 background-color:#D15B47
}
.badge-inverse,.badge.badge-inverse,.label-inverse,.label.label-inverse {
 background-color:#333
}
.badge-warning,.badge.badge-warning,.label-warning,.label.label-warning {
 background-color:#F89406
}
.badge-pink,.badge.badge-pink,.label-pink,.label.label-pink {
 background-color:#D6487E
}
.badge-purple,.badge.badge-purple,.label-purple,.label.label-purple {
 background-color:#9585BF
}
.badge-yellow,.badge.badge-yellow,.label-yellow,.label.label-yellow {
 background-color:#FEE188
}
.badge-light,.badge.badge-light,.label-light,.label.label-light {
 background-color:#E7E7E7
}
.badge-yellow,.label-yellow {
 color:#963;
 border-color:#FEE188
}
.badge-light,.label-light {
 color:#888
} 
</style>
