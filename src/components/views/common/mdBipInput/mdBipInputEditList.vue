<template>
  <md-input-container>
    <div class="md-input-ref layout layout-row">
      <label>{{cell.labelString}}</label>
      <md-input v-model="refValue" :required="cell.isReq" :disabled="disabled"></md-input>
      <md-button class="md-icon-button md-ref-filter" @click="openRef()" :disabled="disabled">
        <md-icon>search</md-icon>
      </md-button>
      <md-bip-dia :assType="cell.assType" ref="ref" :mdRefId="cell.editName" :multiple="multiple" :mdSelection="mdSelection" @close="onRefClose" :disabled="disabled"></md-bip-dia>
    </div>
  </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  props: {dsm:{default:null,type:Object},},
  data(){
    return{
      refValue:this.modal[this.cell.id],
      refData:null,
      oldvalue:'',
    }
  },
  mounted(){  
    if(this.modal){ 
      var bb = this.modal[this.cell.id];
      if(bb){
        this.oldValue = this.modal[this.cell.id];
      }else{
        this.oldValue = '';
      }
    } 
    this.initVV();
  },
  methods:{
    async initVV(){
      var defv = this.modal[this.cell.id];
      if(defv){
        // this.refValue = defv;
      }else{
        this.refValue=''; 
        this.refData = null; 
      }
    },
    async openRef(){ 
      this.$refs['ref'].open()
    },
    onRefClose(data){
      if(data){
        data.cellId = this.cell.id;
        this.refData = data;
        if(this.multiple){
          this.refData.value = data.value;
          let val=""; 
          for(var i =0 ;i<data.value.length;i++){
            let refDv=this.refData.value[i];
            if(i== data.value.length-1){
              val+=refDv[this.refData.cols[0]]
            }else{
              val+=refDv[this.refData.cols[0]]+";"
            }
          }
          if(val !== this.oldValue){
            this.refData.oldValue = this.oldValue;
          }
          this.$set(this.modal,this.cell.id,val);
          this.refValue=this.refData.value[this.refData.cols[0]];
        }else{
          this.refData.value = data.value[0];
          if(this.refData.value[this.refData.cols[0]] !== this.oldValue){ 
            this.refData.oldValue = this.oldValue;
            this.$set(this.modal,this.cell.id,this.refData.value[this.refData.cols[0]]);
            this.refValue=this.refData.value[this.refData.cols[0]];
          }
        }
      }
    }, 
  }, 
  watch:{
    refValue:function(val, oldVal){
      console.log("Sdf")
      this.oldvalue = oldVal; 
      if(this.refData){

      }else{
        this.refData = {
          cellId: this.cell.id,
          multiple: this.multiple,
          oldValue: this.oldvalue,
          value: this.refValue,
        };
      }  
      this.$set(this.modal,this.cell.id,this.refValue); 
      this.$emit('change',this.refData); 
    },
    modal:{
      handler: function () { 
        if(this.oldValue !=this.modal[this.cell.id]){
          this.oldValue = this.modal[this.cell.id];
          this.initVV();
        }
      },
      deep: true
    }, 
  } 
}
</script>

