<template>
  <div class="md-input-ref layout layout-row" @click.native="applyInputFocus">
      <md-input-value
        v-for="(chip ,columnIndex) in selectedValues"
        :md-deletable="!disabled"
        :disabled="disabled"
        :key="columnIndex"
        @delete="deleteChip(chip)">
        <slot :value="chip"><span>{{ chip[cols[0]] }}</span></slot>
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
        ref="input" >
      </md-input>
      <md-button class="md-icon-button md-ref-filter" @click.native="openRef()">
        <md-icon>search</md-icon>
      </md-button>
      <!-- <md-bip-dia :assType="column.assType" ref="ref" :options="refOptions" :multiple="multiple" :mdSelection="true" :disabled="disabled" :md-ref-id="mdRefId" @open="onRefOpen" @close="onRefClose"></md-bip-dia> -->

      <md-bip-dia :assType="column.assType" ref="ref" :mdRefId="column.editName" :multiple="multiple" :mdSelection="mdSelection" @close="onRefClose" :disabled="disabled"></md-bip-dia> 

  </div>
</template>

<script>
import getClosestVueParent from "../../../core/utils/getClosestVueParent";
import common from "../../../core/utils/common";
import commonInput from "../../../commonUI/mdInputContainer/common";
export default {
  props: {
    id: String,
    name: String, 
    mdRefId: String,
    mdKeyField: String,
    mdNameField: String,
    maxlength: {
      type: [Number, String],
      default: 1
    },
    dsm:{default:null,type:Object},
    column:{default:null,type:Object},
  },
  mixins: [commonInput],
  data() {
    return {
      currentInputValue: null,
      selectedValues: [],
      inputId: this.id || "refs-" + common.uniqueId(),
      refInfo: {},
      refData: [],
      loading: 0,
      canEdit: true,
      refIsOpened: false,
      refOptions: { wheres: {}, orders: {} },
      cols: [], 
      mdSelection:false,
      multiple:false,
    };
  },
  watch: {
    value(value) { 
      this.setValue(value);
    },
    selectedValues(v) {
      if (this.multiple) {
        this.canEdit =
          this.maxlength > 1
            ? this.selectedValues.length < this.maxlength
            : true;
      } else {
        this.canEdit = this.selectedValues.length < 1;
      }
      this.setParentValue(v);
    }, 
  },
  methods: {
    setValue(value) {
      // console.log("select values", this.selectedValues);
      this.setParentValue(value);
      this.getColumnValueIndex(value)
    },
    async openRef() {
      //进行公式解析 
      var script = await this.analysisScript();  
      // if(script){ 
        this.refIsOpened = true;
        this.$emit("init", this.refOptions);
        this.$refs["ref"].open(script);
      // }
    },
    async onRefOpen(type) { 
    },
    onRefClose(resdata) { 
      if (resdata) {
        this.refInfo = resdata;
      }else if(this.value){
        var parentRefs = this.$parent.$parent.column.refValues;
        this.refInfo.cols = parentRefs.cols;
        this.refInfo.value = [];
        var vv = this.value.split(';')||this.value.split(',');
        _.forEach(vv,v =>{
          _.forEach(parentRefs.values,item=>{
            if(item[this.refInfo.cols[0]]==v){
              this.refInfo.value.push(item);
            }
          });
        });
      }
      var data = this.refInfo.value;
      this.cols = this.refInfo.cols;
      this.refIsOpened = false;
      if (!data || data.length == 0) return;
      if (this.$parent.$parent.column.refValues == undefined) {
        this.$parent.$parent.column.refValues = {};
        this.$parent.$parent.column.refValues.cols = this.refInfo.cols;
        this.$parent.$parent.column.refValues.multiple = this.refInfo.multiple;
        this.$parent.$parent.column.refValues.values = [];
      }
      // if (!this.multiple)
      this.selectedValues = [];
      let  d={};
      data &&
        data.forEach((row, index) => {
          this.addValue(row);
        }); 
      // for(var i=0;i<data.length;i++){ 
      //   for(var j=0;j<this.cols.length;j++){
      //     if(i == 0){
      //       d[this.cols[j]] = data[i][this.cols[j]];
      //     }else {
      //       if( i ==1){
      //         if(i == data.length-1){
      //           d[this.cols[j]] += ";"+data[i][this.cols[j]];
      //         }else{
      //           d[this.cols[j]] += ";"+data[i][this.cols[j]]+";";
      //         }
      //       }else{
      //         if(i == data.length-1){
      //           d[this.cols[j]] += data[i][this.cols[j]];
      //         }else{
      //           d[this.cols[j]] += data[i][this.cols[j]] +";";
      //         } 
      //       }
      //     }
      //   }
      // }
      // this.addValue(d);
    },
    applyInputFocus() {
      this.$nextTick(() => {
        this.$refs.input.$el.focus();
      });
    },
    addValue(value) {
      if (!value || !value[this.cols[0]]) {
        return;
      }
      if (this.multiple && this.maxlength > 1 && this.selectedValues.length >= this.maxlength ) {
        return;
      }
      if (!this.multiple && this.selectedValues.length > 1) {
        return;
      }
      const index = this.getValueIndex(value);
      if (index < 0) {
        this.selectedValues.push(value);
        const _ii = this.getColumnValueIndex(value);
        if (_ii < 0) {
          this.$parent.$parent.column.refValues.cols = this.cols;
          if(!this.$parent.$parent.column.refValues.values){
            this.$parent.$parent.column.refValues.values = [];
          }
          this.$parent.$parent.column.refValues.values.push(value);
        }
        const nv = this.formatValue();
        this.$emit("input", nv);
        this.$emit("change", nv);
        this.applyInputFocus();
      }
    },
    addInputChip() {
      if (this.currentInputValue) {
        const value = { name: this.currentInputValue.trim() };
        value.id = value.name;
        this.currentInputValue = null;
        this.addValue(value);
      }
    },
    deleteChip(chip) {
      const index = this.getValueIndex(chip);
      if (index >= 0) {
        this.selectedValues.splice(index, 1);
        const nv = this.formatValue();
        this.$emit("input", nv);
        this.$emit("change", nv);
        this.applyInputFocus();
      }
    },
    getValueIndex(value) {
      for (var i = 0; i < this.selectedValues.length; i++) {
        if (
          value[this.cols[0]] &&
          this.selectedValues[i][this.cols[0]] == value[this.cols[0]]
        ) {
          return i;
        }
      }
      return -1;
    },
    getColumnValueIndex(value) {
      var values = this.$parent.$parent.column.refValues.values;
      if (values) {
        for (var i = 0; i < values.length; i++) {
          if (
            value[this.cols[0]] &&
            values[i][this.cols[0]] == value[this.cols[0]]
          ) {
            return i;
          }
          // if (
          //   value[this.cols[1]] &&
          //   values[i][this.cols[1]] == value[this.cols[1]]
          // ) {
          //   return i;
          // }
        }
      }
      return -1;
    },
    deleteLastChip() {
      if (!this.currentInputValue) {
        if (this.selectedValues.length) {
          this.selectedValues.pop();
          const nv = this.formatValue();
          this.$emit("input", nv);
          this.$emit("change", nv);
          this.applyInputFocus();
        }
      }
    },
    formatValue() {
      if (!this.multiple) {
        if (this.selectedValues.length) {
          this.currentInputValue = this.selectedValues[0][this.cols[0]];
          return this.selectedValues[0][this.cols[0]];
        } else {
          return "";
        }
      }else{
        let id ="";
        for(var i=0;i<this.selectedValues.length;i++){
          if(i == this.selectedValues.length-1){
            id += this.selectedValues[i][this.cols[0]];
          }else{
            id += this.selectedValues[i][this.cols[0]]+";"
          }
        }
        // this.currentInputValue = id;
        return id;
      }
      // return this.selectedValues;
    },
    // getCallBack(res) {
    //   console.log(res);
    // },
    // getCallError(res) {}
    //C_GROUP公式解析
    analysisScript(){      
      if(this.column.assType == 'C_GROUP'){ 
          var aa = this.column.script.split(";");      
          var sc = aa[aa.length-1];
          if(sc.indexOf("*") != -1){
            var arr = sc.split("*");
            return this.checkScript(this.dsm,arr[0],arr[1])
          }else{
            return this.checkScript(this.dsm,this.column.objid,sc)
          }
      }
    },
    //c_group 检查所有对像 中的字段
    checkScript(cell,objid,valid){
      if(cell.ccells.obj_id == objid){//先检查主对象
        var len = parseInt(this.dsm.cdata.length)-1;  
        // return this.dsm.cdata[len][valid];
        return this.dsm.currRecord[valid];
      }else{
        if(cell.ccells.haveChild){
          for(var i =0;i<cell.ds_sub.length;i++){
            return this.checkScript(cell.ds_sub[i],objid,valid);
          }
        }
      }
    },
  }, 
  mounted() { 
    this.$nextTick(() => {
      this.parentContainer = getClosestVueParent(
        this.$parent,
        "md-input-container"
      );
      this.updateValues(this.formatValue());
      this.setParentDisabled();
      this.setParentRequired();
    });
    this.$refs["ref"].cancel();
  },
  created(){   
    console.log("created") 
    //MULTIPLE:0x200000,//多项
    let _multiple=this.column.attr&0x200000;
    // console.log(_multiple)
    if(_multiple>0){   
      this.multiple =true;
      this.mdSelection=true; 
    }else{
      this.multiple =false;
      this.mdSelection=false;
    } 
  }
};
</script>
