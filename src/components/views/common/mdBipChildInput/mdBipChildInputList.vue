<!-- 
  本类暂时没有用处  
  select 下拉列表用的是 mdInputEnum 
-->
 
<template>  
    <!-- <md-select v-model="checkVal" :name="column.field" :id="column.field" :required="column.isReq" :disabled="disabled" @change="dataCC" :value="values">
      <md-option :value="item[header[0]]+''" v-for="(item,index) in values" :key="index">{{item[header[1]]}}</md-option>
    </md-select>   -->
      <div class="md-input-ref layout layout-row" @click.native="applyInputFocus">
      <!-- <md-input-value
        v-for="(chip ,columnIndex) in selectedValues"
        :md-deletable="!disabled"
        :disabled="disabled"
        :key="columnIndex"
        @delete="deleteChip(chip)">
        <slot :value="chip"><span>currentInputValue</span></slot>
      </md-input-value>
      <md-input
        v-show="canEdit"
        v-model="currentInputValue"
        type="text"
        :placeholder="placeholder"
        :id="inputId"
        :name="name"
        :disabled="disabled"
        :required="required"
        @keydown.native.delete="deleteLastChip"
        @keydown.native.prevent.enter="addInputChip"
        @keydown.native.prevent.186="addInputChip"
        @dblclick.native="openRef()"
        tabindex="0"
        md-container=""
        ref="input">
      </md-input>
      <md-button class="md-icon-button md-ref-filter" @click.native="openRef()">
        <md-icon>search</md-icon>
      </md-button> -->
      <div>   
        <md-select v-model="row.data[column.field]" md-container=""  >
          <md-option :value="item[header[0]]+''" v-for="(item,index) in values" :key="index">{{item[header[1]]}}</md-option>
        </md-select>
    </div>
  </div>
    
</template>
<script> 
import common from './common';
import comm from "./modal.js";
export default {
  mixins: [comm,common],
  props:{
    column:{default:null,type:Object,},  
    row:{default:null,type:Object,},  
  },
  data() {
    return {
      header: [],
      values: [],  
      checkVal:'',
      currentInputValue:null,
    };
  },
  watch:{
    // value:function(){
    //   this.checkVal=this.value;
    // }
  },
  methods: {
    async doQuery() {
      // console.log(this.cell.refValue)
      if (this.column.refValue) {
        if (this.column.refValue.indexOf("$") > 0) {
          var data = JSON.parse(window.sessionStorage.getItem(this.column.refValue));
          this.makeData(data);
        }else if (this.column.refValue.indexOf("&") > 0) {
          var res = await this.getCLByAPI({'assistid':this.column.refValue}); 
          if(res.data)
            this.makeData(res.data);
        } else {
          this.header = ["code", "name"];
          var selectList = this.column.refValue.split(";"); 
          _(this.values).take(0);
          if(!this.column.isReq){
            // var item = { code: '', name: '' };
            var item = { value: '', text: '' };
            this.values.push(item);
          }
          for (let i = 0; i < selectList.length; i++) {
            var key = selectList[i];
            var datas = key.split(":");
            var code = datas[0] + "";
            // var item = { code: code, name: datas[1] };
            var item = { value: code, text:  datas[1] };
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
          if(!this.column.isReq){
            var item = { code: '', name: '' };
            this.values.splice(0, 0, item);  
          }
        }
      }
    },
    getCallError(res) {
      this.$notify.danger({ content: res.data.message });
    },
    dataCC(value) {   
      this.currentInputValue=value;
      // this.checkVal=value; 
      // this.setParentValue(value);
      // this.$emit('input',value); 
    }
  },
  mounted() {  
    if (this.column) {  
      // let notedit = this.column.attr & this.NOTEDIT;
      // this.disabled = notedit > 0 ? true : false; 
      this.doQuery();  
      // this.checkVal=this.value;  
    }
  }
};
</script>