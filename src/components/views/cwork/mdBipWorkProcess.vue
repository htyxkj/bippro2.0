<template>
  <div>
    <md-dialog ref="dialog" class="md-work-dialog" >
      <md-toolbar>
        <md-layout md-flex="100">
          <md-layout md-flex="90">
            <h1 class="md-title">流程查看</h1> 
          </md-layout>
          <md-layout  md-flex="10">
            <md-button class="md-icon-button" @click.native="cancel()">
              <md-icon>close</md-icon>
            </md-button>
          </md-layout>
        </md-layout>
      </md-toolbar>
      <md-dialog-content style="background-color: #f0eff4;">
        <div>
          <div class="md-work-dialog">
            <md-avatar class="md-large md-fab md-fab-top-left" tabindex="-9999">
              <template v-if="chkinfo && chkinfo.currState.stateId =='6'">
                <img src="../../../img/check/shtg.png">
              </template>
            </md-avatar>
          </div>
          <!-- <div class="div1"> 
            <div class="div2-1">
              <img class="image2" src="../../../img/check/process_ty.png">
              <div class="div3">
                <div style="float:left;">&nbsp;&nbsp;{{oneRow.namefr}}<br/>&nbsp;&nbsp;
                  <span style="color:#8FB95C;font-size: 10px">发起申请</span>
                </div>
                <div class="div4">
                  <span style="font-size:11px">
                    {{oneRow.datefr}}
                  </span>
                </div>
              </div>
            </div> 
            <div class="div2-1">
              <img class="image2" v-if="oneRow.cid == -1" src="../../../img/check/process_bh.png">
              <img class="image2" v-else-if="oneRow.cid == -2" src="../../../img/check/process_ds.png">
              <img class="image2" v-else src="../../../img/check/process_ty.png">
              <div class="div3">
                <div style="float:left;">&nbsp;&nbsp;{{oneRow.nameto}}<br/>&nbsp;&nbsp;
                  <span style="color:#8FB95C;font-size: 10px">{{oneRow.stto}}</span>
                </div>
                <div class="div4">
                  <span style="font-size:11px">
                    {{oneRow.dateto}}
                  </span>
                </div>
                <div class="div4">
                  <img class="image3" v-if="oneRow.cid == -1" src="../../../img/check/process_bh1.png">
                  <img class="image3" v-else-if="oneRow.cid == -2" src="../../../img/check/process_ds1.png">
                  <img class="image3" v-else src="../../../img/check/process_ty1.png">
                </div>
              </div>
            </div> 
            </div> -->
            <div v-for="(item,index) in info" :key="index">
              <template v-if="item.stfr =='one'">
                <img class="image2" src="../../../img/check/process_ty.png">
                <div class="div3">
                  <div style="float:left;">&nbsp;&nbsp;{{item.namefr}}<br/>&nbsp;&nbsp;
                    <span style="color:#8FB95C;font-size: 10px">发起申请</span>
                  </div>
                  <div class="div4">
                    <span style="font-size:11px">
                      {{item.datefr}}
                    </span>
                  </div>
                </div>
              </template>
              <template v-else>
              <div class="div2-1" v-if=" (item.stfr == '驳回' || item.stfr == '新建')">
                <img class="image2" src="../../../img/check/process_ty.png">
                <div class="div3">
                  <div style="float:left;">&nbsp;&nbsp;{{item.namefr}}<br/>&nbsp;&nbsp;
                    <span style="color:#8FB95C;font-size: 10px">发起申请</span>
                  </div>
                  <div class="div4">
                    <span style="font-size:11px">
                      {{item.datefr}}
                    </span>
                  </div>
                </div>
              </div>
              <div class="div2-1">
                <img class="image2" v-if="item.cid < 0 && item.cid != -20000" src="../../../img/check/process_bh.png">
                <img class="image2" v-else-if="item.cid == -20000" src="../../../img/check/process_ds.png">
                <img class="image2" v-else src="../../../img/check/process_ty.png">
                <div class="div3">
                  <div style="float:left;">&nbsp;&nbsp;{{item.nameto}}<br/>&nbsp;&nbsp;
                    <span style="color:#8FB95C;font-size: 10px">
                      <template v-if="chkinfo && chkinfo.state =='6'">
                        <!-- 已批准/可执行 -->
                        {{item.stto}}
                      </template>
                      <template v-else>
                        {{item.stto}}
                      </template>
                    </span>
                  </div>
                  <div class="div4">
                    <span style="font-size:11px">
                      {{item.dateto}}
                    </span>
                  </div>
                  <div class="div5">
                    <span style="font-size:11px"  >
                      {{item.dscto}}
                  </span>
                  </div>
                  <div class="div4">
                    <img class="image3" v-if="item.cid <0 && item.cid != -20000" src="../../../img/check/process_bh1.png">
                    <img class="image3" v-else-if="item.cid == -20000" src="../../../img/check/process_ds1.png">
                    <img class="image3" v-else src="../../../img/check/process_ty1.png">
                  </div>
                </div>
              </div> 
              </template>
            </div> 
        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-raised" @click.native="close(false)">{{$t('commInfo.cancel')}}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      info:[],
      oneRow:{},
    };
  },
  props: { chkinfo: Object },
  methods: {
    async getSubmitProcess(ceaParams){
      this.info = [];
      var res = await this.getCeaCheckInfo(ceaParams, 35); 
      if(res.data.id == 0){
        this.info = res.data.data.info;
      }
      // if(this.chkinfo && this.chkinfo.chkInfos && this.chkinfo.chkInfos.length>0){
      //   let data = this.info[this.info.length-1];
      //   if(data && !data.nameto){
      //     let name ="";
      //     this.chkinfo.chkInfos .forEach(item => {
      //       name += item.userName+" , "
      //     });
      //     name = name.substring(0,name.length-1)
      //     this.info[this.info.length-1].nameto=name; 
      //     this.info[this.info.length-1].cid=-20000; 
      //   }
      // }
      if(this.info.length==0){
        let d = {cid:0,namefr:this.chkinfo.upUser.userName,stfr:'one'}
        this.info.unshift(d)
      }
      
      if(this.chkinfo && this.chkinfo.currState && this.chkinfo.currState.checked == false){
        if(this.chkinfo.currState.hq){
          let nodes  = this.chkinfo.currState.cnodes;
          _.forEach(nodes,item => {
            if(!item.checked){
              let stto = item.stateName;
              let d = {cid:-20000,nameto:"",stto:stto}
              let users = item.users;
              if(users){
                _.forEach(users,u=>{
                  d.nameto = u.userName;
                  this.info.push(d);
                })
              }
            }
          });
        }else{
          if(!this.chkinfo.currState.checked){
              let stto = this.chkinfo.currState.stateName;
              let users = this.chkinfo.currState.users;
              if(users){
                _.forEach(users,u=>{
                  let d = {cid:-20000,nameto:"",stto:stto}
                  d.nameto = u.userName;
                  this.info.push(d);
                })
              }
          }
        }
      }

      this.oneRow = this.info[0];
      // this.info = this.info.slice(1);
      this.$refs["dialog"].open();

    },
    close() {
      this.$refs["dialog"].close();
    }, 
    async open(ceaparam, billU) {
      this.getSubmitProcess(ceaparam);
    },
    cancel() { 
      this.$refs["dialog"].close();
    }, 
  },
  watch: { 
  },
  mounted() { 
  },
  computed: { 
  }
};
</script>
<style lang="scss" scoped> 
  .image2 {
    margin-left: -13px;
    margin-top: 34px;
    width: 26px;
    height: 26px;
    border-radius: 200px;
  }
  .div1 {
    background-color: #eeeeee;
    width: 100%;
    height: 100%; 
  }
  .div2-1 {
    background-color: #F0EFF4;
    border-left: 3px solid #E6E5EA;
    // margin-left: 20px;
    // padding-bottom: 13px;
  }
  .div3 {
    background-color: #FFFFFF;
    height: 65px;
    // width: 85%;
    margin: auto;
    margin-top: -43px;
    color: #999;
    font-size: 11px;
    padding-bottom: 8px;
    padding-top: 8px;
    padding-left: 14px;
  }
  .div4 {
    margin-top: -5px;
    float: right;
    height: 100%;
    margin-right: 3px;
    // max-width: 80px;
  }
  .div5{
    margin-top: 34px;
    float:left; 
    height:100%;
    margin-left: 6px;
    position: absolute;
  }
  .image3 {
    width: 50px;
    height: 34px;
    position: absolute;
    right: 30%;
    margin-top: 20px;
  }

</style>


