<template>
  <md-dialog ref="dialog" :md-click-outside-to-close="false" :md-esc-to-close="false">
    <div :class="ISPC()?classA:classB">
      <!-- title -->
      <md-dialog-title><div class="dia-title">{{diaTitle}}</div></md-dialog-title>
      <!-- content -->
      <md-dialog-content class="contentC">
        <div class="content-area">
           <div class="c-area"> 
              <md-layout md-flex="85">
                <md-bip-input-ref :cell="carCell" :modal="carModal" @change="carDataChange" :ref="carCell.id"></md-bip-input-ref>
            </md-layout>
          </div> 
           <div class="c-area" >
             <md-layout md-row md-gutter="16">
               <md-bip-input-date :isReport="false" :cell="sTCell" :modal="sTModal" :ref="sTCell.id" @change="STDataChange"></md-bip-input-date>
            </md-layout>
          </div>
          <div class="c-area">
             <md-layout md-row md-gutter="16">
               <md-bip-input-date :isReport="false" :cell="eTCell" :modal="eTModal" :ref="eTCell.id" @change="ETDataChange"></md-bip-input-date>
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
      classA: 'classA',
      classB: 'classB',
      zdsid:'',
      carid:'',//车牌号
      startTime:'',
      endTime: new Date(),
      carCell:{ 
        assType: "C_SELECT",
        assist: true,
        attr: 10,  
        editName: "CARID",
        editType: 0,
        id: "zdsid",  
        isReq: true,
        isShow: true,
        labelString: "车  牌  号", 
        type: 12,
        unNull: true,
      },
      carModal:{
        zdsid:this.zdsid,
      },
      sTCell:{ 
        assType: "C_DATE",
        assist: true,
        attr: 10, 
        editName: "DATETIME",
        editType: 0,
        id: "startTime",
        index: 0,
        isReq: true,
        isShow: true,
        labelString: "开始时间", 
        // refValues: {cellId: "startTime", value: "", oldValue: "", multiple: false},
        unNull: true,
      },
      sTModal:{ 
        startTime: this.startTime,
      },
      eTCell:{ 
        assType: "C_DATE",
        assist: true,
        attr: 10, 
        editName: "DATETIME",
        editType: 0,
        id: "endTime",
        index: 0,
        isReq: true,
        isShow: true,
        labelString: "结束时间", 
        // refValues: {cellId: "endTime", value:  this.endTime, oldValue: "", multiple: false},
        unNull: true,
      },
      eTModal:{ 
        endTime: this.endTime,
      }
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
  },
  methods: {
    ok() { 
      if(!this.zdsid){
        this.$notify.warning({content:'车牌不能为空'})
        return
      }
      if(!this.compareDate(this.startTime,this.endTime)){
        this.$notify.warning({content:'结束时间不能大于开始时间'})
        return
      }
      if(!this.startTime || !this.endTime){
        this.$notify.warning({content:'时间不能为空'})
        return
      } 
      this.getOpt(this.carid,this.zdsid,this.startTime,this.endTime)
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
    carDataChange(data){
      this.carid = data.value.id;
      this.zdsid = data.value[this.carCell.id] 
    },
    STDataChange(data){
      this.startTime=data.value;
    },
    ETDataChange(data){
      this.endTime = data.value;
    },
  },
  created(){ 
  },
  mounted() {
    this.$refs.dialog.open()
  },
  watch:{
 
  }
}
</script>

<style scoped>
.classA {
  min-height: 4.5rem;
  max-width: 5.5rem;
  max-height: 4.5rem;
  min-width: 5.5rem;
}

.actionC {
  position: absolute;
  bottom: .1rem;
  right: .1rem
}

.contentC {
  margin-bottom: .7rem;
  padding-bottom: 0;
}

@media screen and (min-width:300px) and (max-width:321px) {
  .classB {
    min-height: 5rem;
    max-height: 5rem;
  }
  .area-inner {
    max-height: 1.2rem;
    width: 100%;
  }
}

@media screen and (min-width:321px) and (max-width:361px) {
  .classB {
    min-height: 5rem;
    max-height: 5rem;
  }
  .area-inner{
    width: 100%;
  }
}

@media screen and (min-width:362px) and (max-width:380px) {
  .classB {
    min-height: 5rem;
    max-height: 5rem;
  }
  .area-inner{
    width: 100%;
  }
}

@media screen and (min-width:381px) and (max-width:420px) {
  .classB {
    min-height: 6rem;
    max-height: 6rem;
  }
  .area-inner{
    width: 100%;
  }
}

@media screen and (min-width:420px) {
  .classB {
    min-height: 6rem;
    max-height: 6rem;
  }
  .area-inner{
    width: 80%;
  }
}

.dia-title{
  text-align: center;
}

.content-area {
  color: #48576a;
  font-size: 14px;
}

.c-area {
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
  margin-bottom: .2rem;
}

.area-inner {
  display: block;
  resize: none;
  padding: 5px 7px;
  line-height: 1.5;
  color: #1f2d3d;
  background-color: #fff;
  background-image:none;
  border:1px solid #bfcbd9;
  border-radius: 4px;
  transition:border-color .2s cubic-bezier(.645,.045,.355,1);
  box-sizing: border-box;
  height: 1.5rem;
  /* width:80%; */
  float: left;
}
.area-label{
  width:.8rem;
  float: left;
  padding-top:.2rem;
}
.md-layout{
  margin:0;
}
</style>



