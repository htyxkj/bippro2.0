<template>
  <div>
    <div class="md-work-dialog">
      <md-avatar class="md-large md-fab md-fab-top-left" tabindex="-9999">
        <template v-if="isSH==3 || isSH==4">
          <img src="../../../img/check/ysh.png">
        </template>
        <template v-if="isSH==2">
          <img src="../../../img/check/dsh.png">
        </template>
        <template v-if="isSH==1">
          <img src="../../../img/check/bh.png">
        </template>
      </md-avatar>
    </div>
    <div class="md-work-dialog" v-if="chkinfo && cea">
      <md-dialog ref="dialog" class="md-work-dialog" :md-click-outside-to-close="false" :md-esc-to-close="false">
        <md-toolbar>
          <h1 class="md-title">{{$t('cwork.title')}}</h1>
            <md-input-container class="md-flex md-header-search">
            </md-input-container>
          <md-button class="md-icon-button" @click.native="cancel()">
            <md-icon>close</md-icon>
          </md-button>
        </md-toolbar>
        <md-dialog-content>
          <template v-if="!isReview">
                <template v-if="this.cea && this.cea.statefr =='6'  && this.cea.stateto =='6' ">
                    <md-layout class="bip-work-title"><h4>执行</h4></md-layout>
                </template>
                <template v-else>
                    <md-layout class="bip-work-title"><h3>审批人员</h3></md-layout>
                    <template v-if="chkinfo">
                        <md-layout v-if="chkinfo.currState.hq">
                            <md-layout>
                                <template v-for="cnodes in chkinfo.currState.cnodes">
                                    <md-layout v-for="user in cnodes.users" :key="user.userName">{{user.userName}}</md-layout>
                                </template>
                                <template v-for="cnodes in chkinfo.currState.cnodes">
                                    <md-layout v-for="user in cnodes.userssh" :key="user.userName">{{user.userName}}  √</md-layout>
                                </template>
                            </md-layout>
                        </md-layout>
                        <md-layout v-if="!chkinfo.currState.hq">
                            <template v-if="!chkinfo.currState.checked">
                              <md-layout  v-for="user in chkinfo.currState.users" :key="user.userName">{{user.userName}}</md-layout>
                            </template>
                            <template v-else>
                              <md-layout  v-for="user in chkinfo.currState.userssh" :key="user.userName">{{user.userName}}  √</md-layout>
                            </template>
                        </md-layout>
                    </template>
                </template>
          </template>
          <template v-else>
            <md-subheader>{{$t('cwork.nextNode')}}</md-subheader>
            <md-radio v-model="stateId" v-for="(item,index) in list" :key="index" :id="item.stateId" name="group1" :md-value="item.stateId">{{item.stateName}}</md-radio>
            <md-subheader>{{$t('cwork.approver')}}</md-subheader>
            <div v-for="(item0,index) in users" :key="'A'+index">
              {{item0.node}}
              <md-checkbox :disabled="item0.hq" v-for="item in item0.users" :key="item.userCode" :id="item.userCode" :name="item.userCode" v-model="userIds" :md-value="item.userCode">{{item.userName}}</md-checkbox>
            </div>
            <md-input-container md-theme="red">
              <label>{{$t('cwork.reasons')}}</label>
              <md-input v-model="content"></md-input>
            </md-input-container>
            <template v-if="signature">
              <md-layout  md-flex-xsmall="100">
                <md-bip-input-autograph :dsm="dsm" :cell="cell" :modal="modal" :ref="cell.id"></md-bip-input-autograph>
              </md-layout>
            </template>
          </template>
        </md-dialog-content>
        <md-dialog-actions>
            <md-button class="md-primary md-raised" @click.native="checkUp()" :disabled="canYes">{{getYes}}</md-button>
            <md-button class="md-accent md-raised" @click.native="checkBack()" :disabled="canBH">{{$t('cwork.reject')}}</md-button>
            <!-- <md-button class="md-accent md-raised" @click.native="checkBack()" :disabled="canBH">驳回到上一节点</md-button> -->
            <md-button class="md-accent md-raised" @click.native="cancelCheck()" :disabled="canTH">{{$t('cwork.back')}}</md-button>
            <md-button class="md-raised" @click.native="close(false)">{{$t('commInfo.cancel')}}</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      stateId: "",
      userIds: [],
      //content: this.$t('cwork.agree'),
      content:this.content,
      users: [],
      list: [],
      cea: null,
      currUser: JSON.parse(window.sessionStorage.getItem("user")).userCode,
      billuser: "",
      hqnodestate:"",//会签节点状态
      isReview:null,//是否是当前节点的审批人
      signature:false,//审批时是否需要签名

      cell:{
        id:"signature",
        labelString:"签名",
      },
      modal:{
        signature:null,
      },
      dsm:{
        canEdit:true,
      }
    };
  },
  props: { chkinfo: Object },
  methods: {
    openImg(){ 
      if (this.chkinfo.chkInfos) {
        var exitu = "";
        _.forEach(this.chkinfo.chkInfos, item => {
          if (item.userCode&&item.userCode === this.currUser) {
            exitu = this.currUser;
          }
        }); 
      }
    },
    close() {
      this.$refs["dialog"].close();
    },
    //同意并提交到下一个节点
    async checkUp() {
      if(this.signature){
        if(!this.modal.signature){
          this.$notify.danger({ content: "请签名", placement: "mid-center" });
          return;
        }
      }
      if(!this.content|| this.content.length<=0){
        this.content="同意";
      }
      if(this.cea.sbuid == "100301" && this.stateId=="806"){
        if(this.userIds.length <2){
          this.$notify.danger({ content: "请勾选至少两位审批人！", placement: "mid-center" });
          return;
        }
      }
      let check =null;//下一审批节点
      for(var i=0;i<this.chkinfo.list.length;i++){
        let item = this.chkinfo.list[i];
        if(item.stateId == this.stateId){
          check = item;
          break;
        }
      }
      this.cea.stateto = this.stateId;
      this.cea.yjcontext = this.content;
      this.cea.ckd = this.chkinfo.checked;
      this.cea.signature = this.modal.signature;
      this.cea.tousr = this.makeUU();
      if(check.hq){ //会审
        let cnodes = check.cnodes;
        let schk_mk = "";
        for(var i=0;i<cnodes.length;i++){
          let node = cnodes[i];
          schk_mk+= node.stateId+","
          node.users.forEach(item =>{
            schk_mk += item.userCode+","
          })
          schk_mk = schk_mk.substring(0,schk_mk.length-1);
          schk_mk +=";"
        }
        schk_mk = schk_mk.substring(0,schk_mk.length-1);
        this.cea.schk_mk = schk_mk; 
      }else{
        
      }

      //当前审批节点
      let cuCheck = this.chkinfo.currState;
      if(cuCheck.hq){//当前进行审批的节点是会签
        _.forEach(cuCheck.cnodes,item=>{
          if(item.users){
            _.forEach(item.users,usr=>{
              if(usr.userCode == this.currUser){
                this.cea.stateagr = item.stateId;
              }
            })
          }
        })
      }else{
        this.cea.stateagr = cuCheck.stateId;
      } 
      var res = null;
      if (this.stateId == 6) {
        res = await this.getCeaCheckInfo(this.cea, 34);
      } else {
        if (this.cea.tousr == "") {
          this.$notify.danger({ content: "没有审批人", placement: "mid-center" });
          return;
        } else {
          res = await this.getCeaCheckInfo(this.cea, 34);
        }
      }
      if (res.data.id == 0) {
        this.$emit("dataCheckUp", this.stateId);
        this.$notify.success({ content: "提交成功！", placement: "mid-center" });
      } else {
        this.$notify.danger({
          content: res.data.message,
          placement: "mid-center"
        });
      }
      this.close();
      // this.$notify.danger({ content: "没有审批人", placement: "mid-center" });
      // console.log(res,'同意并提交');
    },
    makeUU() {
      var ids = "";
      for (var i = 0; i < this.userIds.length; i++) {
        ids += this.userIds[i] + ",";
      }
      if (ids.length > 0) {
        ids = ids.substring(0, ids.length - 1);
      }
      return ids;
    },
    //驳回
    checkBack() {
      if (this.content == "") {
        this.$notify.danger({ content: "驳回说明不能为空" });
      }else {
         this.$dialog
        .confirm("确定驳回吗？", {
          okText: "确定",
          cancelText: "取消"
        })
        .then(() => {
          this.bh(false);
      });
      this.close();
      }
    },
    async bh(bup) {
      let cuCheck = this.chkinfo.currState;
      if(cuCheck.hq){//当前进行审批的节点是会签
        _.forEach(cuCheck.cnodes,item=>{
          if(item.users){
            _.forEach(item.users,usr=>{
              if(usr.userCode == this.currUser){
                this.cea.stateto = item.stateId;
              }
            })
          }
        })
      }else{
        this.cea.stateto = this.chkinfo.currState.stateId;
      }
      this.cea.bup = "2";
      this.cea.yjcontext = this.content; 
      this.cea.tousr = bup ? "#" : this.billuser;
      this.cea.schk_mk = this.cea.stateto + "," + this.currUser;
      var res = await this.getCeaCheckInfo(this.cea, 34);
      if(res.data.id === 0){
        this.$emit("dataCheckUp",res.data.data.info);
        this.$notify.success({content:"驳回成功"});
      }
    },
    //退回
    async cancelCheck() {
      if (this.chkinfo) {
        let checked = false;
        let cuCheck = this.chkinfo.currState;
        if(cuCheck.hq){//当前进行审批的节点是会签
          if(!checked){
            _.forEach(cuCheck.cnodes,item=>{
              if(item.userssh){
                console.log(item)
                _.forEach(item.userssh,usr=>{
                  if(usr.userCode == this.currUser){
                    checked = item.checked;
                  }
                })
              }
            })
          }
        }else{
          checked = cuCheck.checked;
        }
        console.log(checked)
        if (checked) {
          this.cea.stateto = this.chkinfo.currState.stateId;
          this.cea.statefr =  this.chkinfo.currState.stateId;
          this.cea.stateagr =  this.chkinfo.currState.stateId;
          this.cea.yjcontext = this.content;
          var id = 39;
          if (this.chkinfo.currState.stateId !== "6") {
            id = 40;
          }
          if(id== 40 && this.chkinfo.currState.hq){//当前进行审批的节点是会签
            _.forEach(cuCheck.cnodes,item=>{
              if(item.userssh){
                _.forEach(item.userssh,usr=>{
                  if(usr.userCode == this.currUser){
                    this.cea.stateto = item.stateId;
                  }
                })
              }
            })
          }
          console.log(this.cea)
          var res = await this.getCeaCheckInfo(this.cea, id);
          if (res.data.id === 0) {
            this.$emit("dataCheckUp", res.data.data.info + "");
          }else{
            this.$notify.danger({content:res.data.message})
          }
        } else {
          this.cea.stateto = this.stateId;
          this.cea.stateagr =  this.chkinfo.currState.stateId;
          this.cea.statefr = this.chkinfo.currState.stateId;
          console.log(this.cea)
          var id = 39;
          var res = await this.getCeaCheckInfo(this.cea, id);
          console.log(res)
          if (res.data.id === 0) {
            this.$emit("dataCheckUp", res.data.data.info + "");
          }else{
            this.$notify.danger({content:res.data.message})
          }
        }
      }
      this.close();
    },
    async open(ceaparam, billU) {
      this.isReview = false;
      this.cea = ceaparam;
      // this.$notify.danger({ content: "没有审批人", placement: "mid-center" });
      this.billuser = billU;
      // console.log(billU,this.currUser);
      if (this.cea.statefr == "0" || this.cea.statefr == "1" || this.cea.statefr == "5") {
        if (billU !== this.currUser && this.billuser != undefined) {
          this.$notify.danger({
            content: "只有制单人可以提交!",
            placement: "mid-center"
          });
          return;
        }
        this.isReview = true;
      } else {
        if(this.chkinfo.currState.hq){//会签
          if(this.chkinfo.currState.cnodes.length <= 0){//没有人
            if (this.cea.statefr !== "6") {
              this.$notify.danger({
                content: "没有审批人!",
                placement: "mid-center"
              });
            }
          }
        }else{
          if(!this.chkinfo.currState.users && !this.chkinfo.currState.userssh){
            if (this.cea.statefr !== "6") {
              this.$notify.danger({
                content: "没有审批人!",
                placement: "mid-center"
              });
            }
          }
          if(!this.chkinfo.list || this.chkinfo.list.length<=0 && this.cea.statefr !== "6"){
            this.$notify.danger({
              content: "未找到下一审批节点!",
              placement: "mid-center"
            });
          }else{
            _.forEach(this.chkinfo.list,item => {
              if(!item.users && item.stateId !='6'){
                this.$notify.danger({
                  content: "节点："+item.stateName+" 未定义审批人！",
                  placement: "mid-center"
                });
              }
            });
          }
        }
        if(this.cea.statefr == "0" || this.cea.statefr == "1" || this.cea.statefr == "5"){
          this.isReview = true;
        }
        let noCheck = false;
        if(!this.chkinfo.currState.checked)
            noCheck = true;
        let noUser = false;
        if(this.chkinfo.currState.cnodes){
          this.chkinfo.currState.cnodes.forEach((node) => {
              if(node.users)
              node.users.forEach((user) =>{
                if(user.userCode == this.currUser){
                    noUser = true;
                }
              })
          });
        }
        if(this.chkinfo.currState.users){
          this.chkinfo.currState.users.forEach((user) =>{
            if(user.userCode == this.currUser){
                noUser = true;
            }
          })
        }
        if(noUser && noCheck)
          this.isReview = true;
        // if (this.chkinfo.currState.cnodes ) {
        //   var exitu = "";
        //   _.forEach(this.chkinfo.currState.cnodes, item => {
        //     if (item.userCode&&item.userCode === this.currUser) {
        //       exitu = this.currUser;
        //     }
        //   });
        //   // if(!exitu){
        //   //   this.$notify.danger({ content: "没有审批权限！", placement: "mid-center" });
        //   //   return ;
        //   // }
        // } else {
        //   if (this.cea.statefr !== "6") {
        //     this.$notify.danger({
        //       content: "没有审批人!",
        //       placement: "mid-center"
        //     });
        //   }
        // }
      }
      setTimeout(() => {
        this.$refs["dialog"].open();  
      }, 200);
    },
    cancel() {
      // console.log("cccc");
      this.$refs["dialog"].close();
    },
    makeUsers() { 
      if (this.chkinfo) {
        _.forEach(this.chkinfo.list, item => {
          if (item.stateId === this.stateId) {
            if(item.hq){//会审
              this.userIds = [];
              this.users = [];
              if(item.cnodes){
                for(var j=0;j<item.cnodes.length;j++){
                  let users = item.cnodes[j].users;
                  for(var k=0;k<users.length;k++){
                    this.userIds.push(users[k].userCode)
                  }
                  let u = {node:null,users:[],hq:true}
                  u.node = item.cnodes[j].stateName;
                  u.users = item.cnodes[j].users;
                  this.users.push(u);
                }
              }else{
                // this.$notify.danger({ content: "没有审批人", placement: "mid-center" });
              }
            }else{
              this.userIds = [];
              this.users = []; 
              let u = {node:null,users:[],hq:false}
              let usrCode =[];
              let users =[];
              _.forEach(item.users,u=>{
                if(usrCode.indexOf(u.userCode) == -1 ){
                  usrCode.push(u.userCode);
                  users.push(u);
                }
              })
              u.node = item.stateName;
              u.users = users;
              this.users.push(u); 
              if(this.users.length>0){
                let user = this.users[0].users;
                if(user && user.length>0){
                  if(item.attr && (item.attr&16)>0){//签名
                    this.signature = true;
                  }
                  if(item.attr && (item.attr&8)>0){//审批人全选
                    for(var j=0;j<user.length;j++){
                      this.userIds.push(user[j].userCode)
                    }
                  }else{
                    this.userIds.push(user[0].userCode)
                  }
                }
              }
            }
          }
        });
      }
    },
    getIndexState() {
      if (this.chkinfo) {
        if (this.chkinfo.list && this.chkinfo.list.length > 0) {
          this.stateId = this.chkinfo.list[0].stateId;
          this.list = this.chkinfo.list;
        } else {
          this.list = [];
        }
      } else {
        this.list = [];
      }
    },
    initEA() {
      if (this.chkinfo) {
        this.getIndexState();
        this.makeUsers();
      }
    }
  },
  watch: {
    stateId() {
      this.makeUsers();
    },
    chkinfo() {
      // console.log("chkinfoChange");
      this.initEA();
      // this.getYes();
    }
  },
  mounted() {
    this.initEA();
  },
  computed: {
    isSH() {  
      //0：新建状态，1:驳回状态；2:待审核；3:已审核;4:执行状态
      var id = 0;
      if (this.chkinfo && this.chkinfo.currState) {
        if (this.chkinfo.currState.stateId == "0" || this.chkinfo.currState.stateId == "5") {
          id = 0;
        } else if (this.chkinfo.currState.stateId == "1") {
          id = 1;
        } else if (this.chkinfo.currState.stateId == "6") {
          id = 4;
        } else {
          if (this.chkinfo.currState.checked) {
            id = 3;
          } else {
            id = 2;
          }
        }
      } else {
        id = 0;
      }
      // console.log(id,this.chkinfo);
      return id;
    },
    getYes() {
      // console.log(this.chkinfo);
      if (this.chkinfo) {
        if (this.chkinfo.currState.stateId == "0" || this.chkinfo.currState.stateId == "1" || this.chkinfo.currState.stateId == "5") {
          return this.$t('cwork.submit');
        }
      }
      return this.$t('cwork.agree');
    },
    canYes() {
      if (this.chkinfo) {
        if (this.chkinfo.currState.stateId === "6") {
          this.dsm.canEdit = false;
          return true;
        }
        if(this.chkinfo.currState.stateId === "0" || this.chkinfo.currState.stateId === "1" || this.chkinfo.currState.stateId === "5"){
          if(this.billuser == this.currUser || this.billuser == undefined){
            this.dsm.canEdit = true;
            return false;
          }
          this.dsm.canEdit = false;
          return true;
        }
        var exitu = "";
        if(this.chkinfo.currState.hq){//会签
          _.forEach(this.chkinfo.currState.cnodes,item =>{
            if(!item.checked){
              _.forEach(item.users,u =>{
                if(u.userCode == this.currUser){
                  exitu = this.currUser;
                  return;
                }
              })
            }
          })
        }else{
          if(!this.chkinfo.currState.checked){
            _.forEach(this.chkinfo.currState.users,usr =>{
              if(usr.userCode == this.currUser){
                exitu = this.currUser;
                return;
              }
            })
          }
        }
        if (exitu) {
          this.dsm.canEdit = true;
          return false;
        } else {
          this.dsm.canEdit = false;
          return true;
        }
      }
      this.dsm.canEdit = true;
      return false;
    },
    canTH() {
      if (this.chkinfo.currState.stateId) {
        console.log(this.chkinfo);
        if (this.chkinfo.currState.stateId === "0" || this.chkinfo.currState.stateId === "1") {
          return true;
        }
        if(this.chkinfo.currState.stateId === "5"){
          return false;
        }
        if(this.chkinfo.currState.stateId === "6" && this.chkinfo.upState === "0"){
          if(this.currUser === this.billuser  || this.billuser == undefined){
            return false;
          }else{
            return true;
          }
        }
        if (this.chkinfo.checked&&this.chkinfo.chkInfos) {
          if(this.chkinfo.chkInfos[0].userCode === this.currUser)
            return false;
          return true;
        }
        if(this.chkinfo.currState.checked){
          let sshu = this.chkinfo.currState.userssh
          if(sshu){
              for(var z=0;z<sshu.length;z++){
                if(sshu[z].userCode == this.currUser){
                    return false;
                }
              }
          }
        }
        if (this.chkinfo.upUser&&this.currUser === this.chkinfo.upUser.userCode) {
          return false;
        } else {
          return true;
        }
        // return false;
      }
      return false;
    },
    canBH() {
      if (this.chkinfo) {
        if (this.chkinfo.currState.stateId === "0" ||this.chkinfo.currState.stateId === "1" || this.chkinfo.currState.stateId === "5" ||this.chkinfo.currState.stateId === "6") {
          return true;
        }
         var exitu = "";
         if(!this.chkinfo.currState.hq){
          _.forEach(this.chkinfo.currState.users, item => {
            if (item.userCode === this.currUser) {
              exitu = this.currUser;
              return;
            }
          });
         }else{
           _.forEach(this.chkinfo.currState.cnodes, item => {
             _.forEach(item.users,us=>{
                if (us.userCode === this.currUser) {
                  exitu = this.currUser;
                  return;
                }
             })
          });
         }
        if (exitu) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
<style lang="scss" scoped>
.md-dialog-actions .md-button {
  min-width: .55rem;
  margin: 0; 
  margin-right: .05rem;
}
.md-dialog-actions .md-button+.md-button {
    margin-left: 0rem;
}
</style>


