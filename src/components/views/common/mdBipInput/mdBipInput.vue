<template>
  <md-layout md-flex-xsmall="100" :md-flex-small="callsmall" :md-flex-medium="callmedium" :md-flex-large="calllarge" v-if="cell.isShow">
    <slot name="editor"></slot>
    
    <template v-if="inputType == INPUT_COMMON" >
      <md-bip-input-comm :cell="cell" :modal="modal"  :ref="cell.id" @change="dataChange"></md-bip-input-comm>
    </template>
    <template v-if="inputType == INPUT_DATE" >
      <md-bip-input-date :isReport="is_Report" :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-date>
    </template>
    <template v-if="inputType == INPUT_REF">
      <md-bip-input-ref :script="script" :cell="cell" :modal="modal" @change="dataChange" :ref="cell.id"></md-bip-input-ref>
    </template>
    <template v-if="inputType == INPUT_LIST">
      <md-bip-input-list :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-list>
    </template>
    <template v-if="inputType == INPUT_FILE">
      <md-bip-input-file-tmp :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-file-tmp>
    </template>
      <!-- <md-bip-input-ueditor :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-ueditor> -->
    <template v-if="inputType == INPUT_TEXTAFC"> 
      <md-bip-input-editor  :cell="cell" :modal="modal" :id="cell.id" :ref="cell.id"  @change="dataChange"></md-bip-input-editor >
    </template>
    <template v-if="inputType == INPUT_CHECK">
      <md-bip-input-check :cell="cell"  :modal="modal"  :ref="cell.id" @change="dataChange"></md-bip-input-check>
    </template>
    <template v-if="inputType == INPUT_RADIO">
      <md-bip-input-radio :cell="cell"  :modal="modal"  :ref="cell.id" @change="dataChange"></md-bip-input-radio>
    </template>
  </md-layout>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  props: {isReport:{default:null},dsm:{default:null,type:Object}},
  data () {
    return {
      inputType: 0,
      is_Report:false,
      script:null, 
    }
  },
  created () {   
    this.is_Report= this.isReport==undefined?false:true;  
    this.initType(); 
  },
  watch:{
    'cell': function(){
      this.initType();
    },
    'modal':function(){
      // console.log(this.modal);
    },
    // 深度 watcher
    dsm:{
      handler: function () {  
        this.analysisScript() 
      },
      deep: true
    }
  },
  computed:{
    callsmall(){
      if(this.cell){
        const w = this.cell.ccHorCell>0?this.cell.ccHorCell:1;
        if(w === 1) {
          return "50";
        }else{
          return "100";
        }
      }
    },
    callmedium(){
      if(this.cell){
        const w = this.cell.ccHorCell>0?this.cell.ccHorCell:1;
        if(w === 1) {
          return "33";
        }else if(w===2){
          return "66";
        }else{
          return "100";
        }
      }
    },
    calllarge(){
      const i = 25;
      if(this.cell){
        const w = this.cell.ccHorCell>0?this.cell.ccHorCell:1;
        const t = w*i;
        return t>100?"100":t+'';
      }
    }
  },
  methods: {
    dataChange (data) {  
      this.$emit('change',data);
    },
    initType(){ 
      // console.log(this.cell)
      // console.log(this.modal)
      //this.inputType = 0;   
      if(this.cell){ 
        //先判断编辑器是什么类型，对应走什么组件
        if(this.cell.editType==this.INPUT_LIST){
          this.inputType = this.INPUT_LIST;
          return;
        }if(this.cell.editType==this.INPUT_CHECK){
          this.inputType = this.INPUT_CHECK;
          return;
        }if(this.cell.editType==this.INPUT_RADIO){
          this.inputType = this.INPUT_RADIO; 
          return;
        }if(this.cell.editType==this.INPUT_TEXTAFC){
          this.inputType = this.INPUT_TEXTAFC;  
          return;
        }
        //判断字段是辅助，并且是否是特殊辅助
        if(this.cell.assist){
          this.analysisScript()
          var  editName = this.cell.editName; 
          if (editName == 'UPDOWN') {
            this.inputType = this.INPUT_FILE;
            return ; 
          }else if("DATE、DATETIME、HS、H_S、H_SM、H_S_M、YM、Y-M".indexOf(editName)>-1){
            this.inputType = this.INPUT_DATE;
          }else if(editName == 'COPY'){
            this.inputType = this.INPUT_COMMON;
          }else{
            this.inputType = this.INPUT_REF;
          }
          return;
        }

        this.inputType = this.INPUT_COMMON;
        var refv = this.cell.refValue;
        if(refv == '{&DATETIME}'){
          this.inputType = this.INPUT_COMMON;
          return ;
        } 
        if (refv !== undefined &&refv !=='') {
          var _index = refv.indexOf('&');
          if (_index>0){
            this.inputType = this.INPUT_REF;
            return ;
          }
          this.inputType = this.INPUT_LIST;
            return ;
        }
      }
    },
    list(){
      this.$emit('list');
    },
     analysisScript(){ 
      if(this.cell.assType == 'C_GROUP'){
        var aa = this.cell.script.split(";");      
        var sc = aa[aa.length-1];
        if(sc.indexOf("*") != -1){
          var arr = sc.split("*");
          this.checkScript(this.dsm,arr[0],arr[1])
        }else{
          this.checkScript(this.dsm,this.cell.c_par.obj_id,sc)
        }
      }
    },
    //c_group 检查所有对像 中的字段
    checkScript(cell,objid,valid){
      if(cell.ccells.obj_id == objid){//先检查主对象
        var len = parseInt(this.dsm.cdata.length)-1; 
        this.script = this.dsm.cdata[len][valid];
      }else{
        if(cell.ccells.haveChild){
          for(var i =0;i<cell.ds_sub.length;i++){
            this.checkScript(cell.ds_sub[i],objid,valid);
          }
        }
      }
    },

  }
}
</script>

