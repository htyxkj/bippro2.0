<template>
    <md-input-container>
      <label>{{cell.labelString}}</label> 
        <md-bip-date v-model="modal[cell.id]" :modal="modal" :isReport="isReport" :cell="cell" :required="cell.isReq" :disabled="disabled"  @blur="onBlur" @change="dataChange" ></md-bip-date> 
    </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  data(){
    return {
      upData:''
    }
  },
  mixins:[comm],
  props:['isReport'],
  watch:{
    modal(){
      // console.log('modal change')
    }
  },
  methods:{ 
    dataChange(value){
      
      var refBackData = {
          cellId:this.cell.id,
          value:value,
          oldValue:this.oldValue,
          multiple:false
      };
      // console.log(refBackData)
      if(value !== this.oldValue&&value!==this.upData){
        this.upData = value;
        this.$emit('change',refBackData);
      } 
    },
    onBlur(){ 
      if(this.oldValue != this.modal[this.cell.id]){
        var data = {};
        data.cellId = this.cell.id;
        data.value = this.modal[this.cell.id];
        data.oldValue = this.oldValue;
        data.multiple = false;
        // this.oldValue = this.modal[this.cell.id];
        // console.log('datachange');
        this.$emit('change',data);
      }
    },
  },
  mounted(){
    // console.log("mdInputDate_mounted")
    if(this.modal&&this.modal[this.cell.id]!=undefined){
      this.oldValue = this.modal[this.cell.id]; 
    }
  },
  computed:{
    getType(){
      if(this.cell.type<12){
        return "number";
      }else if(this.cell.type === 91 || this.cell.type===93){
        return 'dates';
      }
      return "string";
    }
  }
}
</script>

<style scoped>
textarea.md-input{max-height:.32rem !important;overflow: auto !important;}
</style>