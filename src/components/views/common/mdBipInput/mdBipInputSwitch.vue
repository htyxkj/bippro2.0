
<template> 
  <md-layout class="md-theme-default md-style" >
    <md-layout md-flex="40">  
      <label :class="mdStyleLable" :for="cell.id">{{cell.labelString}}{{xing}}</label>
    </md-layout>  
    <md-layout md-flex="60" class="md-align-end">
      <md-switch class="md-primary switch" v-model="myswitch" :id="cell.id" :name="cell.id" :disabled="disabled"></md-switch>
    </md-layout>
  </md-layout>
</template>

<script>

import comm from "./modal.js";
export default {
  mixins: [comm],
  data() {
    return {
      header: [],
      values: [],
      mdStyleLable:'md-style-lable',
      xing:'*',
      myswitch:false,
      modalValue:this.modal[this.cell.id],
    };
  },
  methods: {  
    getCallError(res) {
      this.$notify.danger({ content: res.data.message });
    },
    dataCC(value) { 
      if(this.modal[this.cell.id]!=value)
        this.modal[this.cell.id]=value;
      var refBackData = {
        cellId: this.cell.id,
        value: value,
        oldValue:this.oldValue,
        multiple: false,
      };
      if (value != this.oldValue) 
        this.$emit("change", refBackData);
      setTimeout(() => {
        this.$emit("switchUP",refBackData)  
      }, 100);
    }
  },
  mounted() {
    if (this.cell) {   
      let notedit = this.cell.attr & this.NOTEDIT;
      this.disabled = notedit > 0 ? true : false; 
      this.oldValue = this.modalValue?this.modalValue:''; 
      if(this.oldValue =="")
        this.oldValue = "0"
      this.myswitch = this.oldValue=="0"?false:true;
    }
  },
  watch:{
    myswitch:function(){
      this.dataCC(this.myswitch==true?"1":"0");
    }
  }
};
</script>
<style lang="scss" scoped>
  .switch{
    margin: 0px; 
    height: .16rem;
  }
  .md-style {
    width: 100%;
    min-height: .48rem;
    margin: .04rem .1rem .0rem 0;
    padding-top: .16rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: relative;
  } 
  .md-style:after{
      content:'';
      height: 1px;
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.12);
    }
  .md-style-lable{
    color:#c1303f;
    font-size: .16rem;  
    margin-bottom:0px;
  } 
</style>





