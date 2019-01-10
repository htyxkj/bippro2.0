<template>
    <md-layout class="md-checkbox-container md-theme-default md-style " >
        <label :class="mdStyleLable" :for="cell.id">{{cell.labelString}} {{xing}}</label>
          <md-checkbox  v-model="array" :id="item[header[1]]" :md-value="item[header[1]]+''" v-for="(item,index) in values" :key="index" class="md-primary">{{item[header[1]]}}</md-checkbox>
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
      array: [],
      xing:'*',
      mdStyleLable:'md-style-lable',
    };
  },
  methods: {
    async doQuery() { 
      if (this.cell.refValue) {
        if (this.cell.refValue.indexOf("$") > 0) {
          var data = JSON.parse(
            window.sessionStorage.getItem(this.cell.refValue)
          );
          this.makeData(data);
        } else if (this.cell.refValue.indexOf("&") > 0) {
          var res = await this.getCLByAPI({ assistid: this.cell.refValue }); 
          if (res.data) this.makeData(res.data);
        } else {
          this.header = ["code", "name"];
          var selectList = this.cell.refValue.split(";"); 
          _(this.values).take(0);
          if (!this.cell.isReq) {
            var item = { code: "", name: "" };
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
          if (!this.cell.isReq) {
            // var item = { code: "", name: "" };
            // this.values.splice(0, 0, item);
            this.mdStyleLable = "label";
            this.xing = ''
          }
        }
      }
    },
    getCallError(res) {
      this.$notify.danger({ content: res.data.message });
    },
    dataCC() {
        let _val = "";
        for (var i = 0; i < this.array.length; i++) {
          if(this.array[i]!=null&&this.array[i]!=''){
            if (i == this.array.length - 1) {
            _val += this.array[i];
            } else {
            _val += this.array[i] + ";";
            }
          }
        } 
        var refBackData = {
            cellId: this.cell.id,
            value: _val,
            oldValue: _val,
            multiple: false
        }; 
        this.modal[this.cell.id]=_val;
        this.$emit("change", refBackData);  
    }
  },
  mounted() {  
    if (this.cell) {
      let notedit = this.cell.attr & this.NOTEDIT;
      this.disabled = notedit > 0 ? true : false;
      var modalValue = this.modal[this.cell.id];
      this.oldValue = modalValue ? modalValue : "";
      this.array=this.oldValue.split(";");
      this.doQuery();
    }
  },
  watch:{
    array(){ 
        this.dataCC();
    }
  }
};
</script>
<style  lang="scss" scoped>
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
    margin-left:0px; 
  }
  .md-checkbox .md-checkbox-label {  
    padding-left: 0.04rem;
  }
  .md-checkbox{
    margin-top:0px;
    margin-bottom: 0px;
    margin-left: .1rem; 
  }
  .label { 
    color:rgba(0, 0, 0, 0.54);
    font-size: .16rem;  
    margin-bottom:0px;
    padding: .16em .6em .3em 0em;
  }
</style>