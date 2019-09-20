<template>
  <md-dialog ref="dialog" :md-click-outside-to-close="false" :md-esc-to-close="false">
    <div>
      <!-- title -->
      <md-dialog-title> <div class="dia-title">{{diaTitle}}</div></md-dialog-title>
      <!-- content -->
      <md-dialog-content class="contentC">
        <div class="content-area">
           <div :class="ISPC()?careapc:carea">
            <md-layout md-row md-gutter="16"> 
              <md-layout md-flex="100" md-flex-small="100"> 
                <md-bip-input-ref  :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-ref>
              </md-layout>
            </md-layout>
          </div>
          <div :class="ISPC()?careapc:carea">
            <md-layout md-row md-gutter="16"> 
              <md-layout md-flex="100" md-flex-xsmall="100">
                <md-input-container>
                  <label for="plane">用户标识</label> 
                  <md-input :required="true" v-model="planeVal"></md-input>
                </md-input-container> 
              </md-layout>
            </md-layout>
          </div>
          <div :class="ISPC()?careapc:carea" >
             <md-layout md-row md-gutter="16"> 
               <md-layout md-flex="50" md-flex-xsmall="50">
                <!-- <md-input-container>
                  <label>开始时间</label>  -->
                  <md-bip-date v-model="modaleimt.startTime" :value="modaleimt.startTime" :modal="modaleimt" :isReport="false" :cell="sTCell" :required="sTCell.isReq" :disabled="false" ></md-bip-date> 
                <!-- </md-input-container> -->
              </md-layout> 
              <md-layout md-flex="50" md-flex-xsmall="50">
                <!-- <md-input-container>
                  <label>结束时间</label>  -->
                  <md-bip-date v-model="modaleimt.endTime" :value="modaleimt.endTime" :modal="modaleimt" :isReport="false" :cell="eTCell" :required="eTCell.isReq" :disabled="false" ></md-bip-date> 
                <!-- </md-input-container> -->
              </md-layout>
            </md-layout>
          </div>
          
          <div v-if="redio" :class="ISPC()?careapc:carea">
            <md-layout md-row md-gutter="16">
              <md-layout md-flex="15" md-flex-xsmall="15">
                <label class="area-label">查询类型</label>
              </md-layout>
              <md-layout md-flex="28" md-flex-xsmall="28" >  
                <div>
                  <md-radio  v-model="redioVal" id="my-test4" name="my-test-group2" md-value="1" class="md-primary">航迹查询</md-radio>
                  <md-radio v-model="redioVal" id="my-test6" name="my-test-group2" md-value="3" class="md-primary">航带查询</md-radio>
                  <md-radio v-model="redioVal" id="my-test5" name="my-test-group2" md-value="2" class="md-primary">混合查询</md-radio>
                </div>
              </md-layout>
            </md-layout>
            <md-layout md-row md-gutter="16">
              <md-layout md-flex="15" md-flex-xsmall="15">
                <label class="area-label">显示作业区</label>
              </md-layout>
              <md-layout md-flex="28" md-flex-xsmall="28" >  
                <div>
                  <md-radio  v-model="isShowZYQ" id="my-test4" name="my-test-group2" md-value="1" class="md-primary">是　　　</md-radio>
                  <md-radio v-model="isShowZYQ" id="my-test6" name="my-test-group2" md-value="0" class="md-primary">否</md-radio>
                </div>
              </md-layout>
            </md-layout>
          </div>
        </div>
      </md-dialog-content>
      <!-- action -->
      <md-dialog-actions class="actionC">
        <md-button class="md-primary md-raised" @click="ok">确定</md-button>
        <md-button class="md-raised" @click="closeDialog">取消</md-button>
      </md-dialog-actions>
    </div>
  </md-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import qs from 'qs'
export default {
  data() {
    return {
      mdSelection:false,
      multiple:false,
      disabled:false,
      modal:{
        sid:'',
      },
      cell:{
        editName:"TKMSG",
        editType:0,
        id:"sid",
        index:0,
        isReq:true,
        labelString:"任务标识",
        refValue:"{&TKMSG}",
      },
      classA: 'classA',
      classB: 'classB',
      planeno:'',
      planeVal:'',
      taskno:'', 
      tasks:[],
      // startTime:'',
      // endTime:'',
      modaleimt:{startTime:'',endTime:''},
      careapc:'c-areapc',
      carea:'c-area',
      cmcCode : '',// JSON.parse(window.sessionStorage.getItem('user')).deptInfo.cmcCode,
      snkey :JSON.parse(window.sessionStorage.getItem('snkey')), 
      redioVal:"1",
      isShowZYQ:"1",
      param:{
        apiId: "assisto",
        dbid: `${global.DBID}`,
        usercode: JSON.parse(window.sessionStorage.getItem('user')).userCode, 
        page:1,
        assistid: null,
        cont:null,
      },
      //开始时间
      sTCell:{  
        editName: "DATETIME", 
        id: "startTime", 
        isReq: true, 
        labelString:"开始时间",
      }, 
      //结束时间
      eTCell:{  
        editName: "DATETIME", 
        id: "endTime", 
        isReq: true, 
        labelString:"结束时间",
      }, 
    }
  },
  props: {
    getOpt:{
      type:Function,
    },
    getCurrentOpt:{
      type:Function,
    },
    diaTitle:'', 
    redio:false,
  },
  methods: {
    dataChange(data){ 
      this.taskno=data.value[data.cellId] 
      this.modaleimt.startTime = data.value['bgtime'];
      this.modaleimt.endTime = data.value['edtime'];  
    },
    ok() {
      if(this.redio){
        if(this.redioVal==''){
          this.$notify.warning({content:'请选择查询类型'})
          return
        }
      }
      if(this.taskno==''){
        this.$notify.warning({content:'任务标识不能为空'})
        return
      }
      if(this.planeno==''){
        this.$notify.warning({content:'用户标识不能为空'})
        return
      } 
      if(!this.modaleimt.startTime || !this.modaleimt.endTime){
        this.$notify.warning({content:'时间不能为空'})
        return
      }
      if(!this.compareDate(this.modaleimt.startTime,this.modaleimt.endTime)){
        this.$notify.warning({content:'结束时间不能大于开始时间'})
        return
      }
      if(this.redio){
        this.getOpt(this.planeno,this.taskno,this.modaleimt.startTime,this.modaleimt.endTime,this.redioVal,this.isShowZYQ)
      }else{
        this.getOpt(this.planeno,this.taskno,this.modaleimt.startTime,this.modaleimt.endTime)
      }
      this.closeDialog()
    },
    compareDate(t1,t2){
      //比较结束时间大于开始时间
      if(t1 && t2){
        return (new Date(t2.replace(/-/g,"\/"))) > (new Date(t1.replace(/-/g,"\/")))
      }
      return true
    },
    closeDialog() {
      this.$refs.dialog.close()
    }, 
    //获取任务对应的 用户标识
    getAirId(){
        let taskno = this.taskno
        let param = this.param;
        param.assistid="GETUSERTASK";
        param.cont="~t.sid ='"+taskno+"'";
        axios.post(global.BIPAPIURL+global.API_COM, qs.stringify(param)).then(res => {
          this.planeno=res.data.values[0].usrcode;
          this.planeVal=res.data.values[0].usrname;
        }); 
    }
  },
  created(){
    let usrCode = JSON.parse(window.sessionStorage.getItem('user')).userCode
    if(usrCode == 'admin'){
      this.cmcCode =2;
    }else{
      this.cmcCode = usrCode.substring(0,6)
    } 
  },
  mounted() {
    this.$refs.dialog.open()
  },
  watch:{
    'taskno':function(){
      this.getAirId() 
    } 
  }
}
</script>

<style scoped>
.classA {
  min-height: 4rem;
  max-width: 6.5rem;
  max-height: 4.6rem;
  min-width: 5.5rem;
}

.actionC {
  position: absolute;
  bottom: 0.1rem;
  right: 0.1rem;
}

.contentC {
  margin-bottom: 0.7rem;
  overflow: hidden;
}
.classB {
  max-width: 3rem;
}
@media screen and (min-width: 300px) and (max-width: 321px) {
  .classB {
    min-height: 5rem;
    max-height: 5rem;
  }
  .area-inner {
    max-height: 1.2rem;
    width: 100%;
  }
}

@media screen and (min-width: 321px) and (max-width: 361px) {
  .classB {
    min-height: 5rem;
    max-height: 5rem;
  }
  .area-inner {
    width: 100%;
  }
}

@media screen and (min-width: 362px) and (max-width: 380px) {
  .classB {
    min-height: 5rem;
    max-height: 5rem;
  }
  .area-inner {
    width: 100%;
  }
}

@media screen and (min-width: 381px) and (max-width: 420px) {
  .classB {
    min-height: 6rem;
    max-height: 6rem;
  }
  .area-inner {
    width: 80%;
  }
}

@media screen and (min-width: 420px) {
  .classB {
    min-height: 6rem;
    max-height: 6rem;
  }
  .area-inner {
    width: 80%;
  }
}

.dia-title {
  width: auto;
  text-align: center;
}

.content-area {
  color: #48576a;
  font-size: 14px;
}

.c-areapc {
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
  margin-bottom: 0.2rem;
}
.c-area {
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
  margin-bottom: 0.05rem;
}

.area-inner {
  display: block;
  resize: none;
  padding: 5px 7px;
  line-height: 1.5;
  color: #1f2d3d;
  background-color: #fff;
  background-image: none;
  border: 1px solid #bfcbd9;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  box-sizing: border-box;
  height: 1.5rem;
  /* width:80%; */
  float: left;
}
.area-label {
  width: 0.8rem;
  float: left;
  padding-top: 0.2rem;
}
.md-layout {
  margin: 0;
}
.md-button.md-icon-button {
  height: 0.24rem !important;
  line-height: 0.24rem;
}
.md-button {
  margin: 0;
}
</style>



