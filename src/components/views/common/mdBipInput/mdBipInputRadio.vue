
<template> 
  <md-layout class="md-radio-container md-theme-default md-style" :class="disabled?disabledStyleA:disabledStyleB">
    <label :class="mdStyleLable" :for="cell.id">{{cell.labelString}}{{xing}}</label>
    <md-radio v-model="modal[cell.id]" :md-value="item[header[0]]+''" :id="item[header[0]]" :name="item[header[0]]" v-for="(item,index) in values" :key="index" class="md-primary" @change="dataCC" :disabled="disabled">
      {{item[header[1]]}}
    </md-radio>
  </md-layout>
</template>

<style lang="scss" scoped>
  .md-style {
    width: 100%;
    min-height: .48rem;
    margin: .04rem .1rem .12rem 0;
    padding-top: .16rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: relative;
  }
  .md-radio{ 
    margin-top:0px;
    margin-bottom: 0px;
    margin-left: .1rem;
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
  .lable{
    color: rgba(0, 0, 0, 0.54);
    font-size: .16rem;  
    margin-bottom:0px;
  }
  .disabledStyleA{
  color:#9E9E9E;
} 
.disabledStyleC{
  color:#9E9E9E;
  font-size: .16rem;  
  margin-bottom:0px;
}

</style>
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
      radio1:'',
      disabledStyleA:'disabledStyleA',
      disabledStyleB:'',
    };
  },
  methods: {
    async doQuery() { 
      if (this.cell.refValue) {
        if (this.cell.refValue.indexOf("$") > 0) { 
          var data = JSON.parse(window.sessionStorage.getItem(this.cell.refValue));
          this.makeData(data);
        }else if (this.cell.refValue.indexOf("&") > 0) {
          var res = await this.getCLByAPI({'assistid':this.cell.refValue}); 
          if(res.data)
            this.makeData(res.data);
        } else {
          this.header = ["code", "name"];
          var selectList = this.cell.refValue.split(";"); 
          _(this.values).take(0);
          if(!this.cell.isReq){
            var item = { code: '', name: '' };
            this.values.push(item); 
          }
          for (let i = 0; i < selectList.length; i++) {
            var key = selectList[i];
            var datas = key.split(":");
            var code = datas[0] + "";
            var item = { code: code, name: datas[1] };
            this.values.push(item);
          }
        }
      }
    },
    getCallBack(res) { 
      var data = res.data;
      if (data.code == -1) {
        this.$notify.danger({ content: data.message });
      } else {
        var len = data.labers.length;
        if (len > 1) {
          for (let i = 0; i < 2; i++) {
            this.header[i] = data.allCols[data.showCols[i]];
          }
        } else {
          this.header[0] = data.labers[0];
          this.header[1] = data.labers[0];
        }
        if (data.code == 1) {
          this.values = data.values;
        }
      }
    },

    makeData(data) { 
      if (data.code == -1) {
        this.$notify.danger({ content: data.message });
      } else {
        var len = data.labers.length;
        if (len > 1) {
          for (let i = 0; i < 2; i++) {
            this.header[i] = data.allCols[data.showCols[i]];
          }
        } else {
          this.header[0] = data.labers[0];
          this.header[1] = data.labers[0];
        }
        if (data.code == 1) {
          this.values = data.values;
          if(!this.cell.isReq){
            // var item = { code: '', name: '' };
            // this.values.splice(0, 0, item);
            if(!this.disabled){
              this.mdStyleLable = 'lable' ;
            }else{
              this.mdStyleLable = 'disabledStyleC' ;
            }
            this.xing = ''
          }
        }
      }
    },
    getCallError(res) {
      this.$notify.danger({ content: res.data.message });
    },
    dataCC(value) {
      var refBackData = {
        cellId: this.cell.id,
        value: value,
        oldValue:this.oldValue,
        multiple: false
      };
      if (value !== this.oldValue) this.$emit("change", refBackData);
      setTimeout(() => {
        var modalValue = this.modal[this.cell.id];
        this.oldValue = modalValue?modalValue:'';        
      }, 200);
    }
  },
  mounted() {
    if (this.cell) {
      let notedit = this.cell.attr & this.NOTEDIT;
      this.disabled = notedit > 0 ? true : false;
      var modalValue = this.modal[this.cell.id];
      this.oldValue = modalValue?modalValue:'';
      this.doQuery();
    }
  }
};
</script>





