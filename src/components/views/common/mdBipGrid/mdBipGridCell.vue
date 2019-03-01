<template>
  <td @click="handleClick" :class="[objClass]">
    <md-bip-grid-cell-edit v-if="status=='editor'" class="md-bip-grid-cell-container" :column="column" :row="row">
      <template v-if="column&&inputType == INPUT_DATE">
        <md-input-container>
          <md-bip-child-date v-model="row.data[column.field]" :row="row"  :isReport="false" :column="column" :required="column.isReq"></md-bip-child-date>
        </md-input-container>
      </template>
      <!-- <template v-else-if="column&&inputType == INPUT_LIST">
        <md-input-container>
          <md-bip-child-input-list :row="row" :column="column" :ref="column.field" ></md-bip-child-input-list>
        </md-input-container>
      </template> -->
      <template v-else-if="column&&inputType == INPUT_FILE">
          <md-bip-child-input-file :row="row"  v-model="row.data[column.field]" :column="column" :ref="column.field" ></md-bip-child-input-file>
          <!-- <md-bip-child-input-list v-model="row.data[column.field]" :column="column" :ref="column.field" ></md-bip-child-input-list> -->
      </template>
      <template v-else-if="column&&column.templateEditor">
        <slot name="editor"></slot>
      </template>
      <template v-else-if="column&&column.dataType=='entity'">
        <md-input-container>
          <md-bip-input-entity :dsm="dsm" :column="column" :mdRefId="column.refId||column.refType" @init="on_init_ref" v-model="row.data[column.field]"></md-bip-input-entity>
        </md-input-container>
      </template>
      <template v-else-if="column&&column.dataType=='enum'">
        <md-input-container>
          <md-bip-enum :md-enum-id="column.refId||column.refType" v-model="row.data[column.field]"></md-bip-enum>
        </md-input-container>
      </template>
      <template v-else>
        <md-input-container>
          <md-input v-model="row.data[column.field]"></md-input>
        </md-input-container>
      </template>
    </md-bip-grid-cell-edit>
    <md-bip-grid-cell-show v-else class="md-bip-grid-cell-container" :column="column" :row="row" >
      <slot></slot>
    </md-bip-grid-cell-show>
  </td>
</template>
<script>
import getClosestVueParent from '@/components/core/utils/getClosestVueParent';
import mdBipGridCellShow from './mdBipGridCellShow';
import mdBipGridCellEdit from './mdBipGridCellEdit';
import billState from '../../classes/billState';
import comm from '../mdBipInput/modal.js';
export default {
  mixins:[comm],
  components: {
    mdBipGridCellShow,
    mdBipGridCellEdit
  },
  props: {
    column: { type: Object },
    row: { type: Object },
    selection: { default: false, type: Boolean },
    type: { default: 'td', type: String },
    dsm: { default: null, type: Object },
  },
  computed: {
    objClass() { 
      return {
        'is-tool': this.column && this.column.isTool,
        'md-bip-grid-selection': this.selection,
        'cell-focused': this.focused,
        'multiple': this.column && this.column.multiple,
      };
    },
    editable() {
      return (this.row && this.row.data) && (!this.selection) && this.column && (this.column.templateEditor || this.column.editable);
    }
  },
  watch:{ 
    columns : function(){
      this.initType();
    }, 
    //深度 watch
    // dsm:{
    //   handler: function () {
    //     console.log("GridCell")
    //     this.analysisScript(); 
    //   },
    //   deep: true
    // }
  },
  created(){
    this.initType();
  },
  data() {
    return {
      parentTable: {},
      status: 'display',
      focused: false,
      oldValue: {},
      inputType: 0,
      script:{ default: null, type: Object },
    };
  },
  methods: {
    handleFocused() {
      if (this.parentTable && this.parentTable.focusCell) {
        this.parentTable.focusCell.focused = false;
      }
      this.focused = true;
    },
    handleClick(event) { 
      if (!this.canFireEvents) return;
      this.handleFocused();
      this.$emit('click', event);
      this.beginEdit();
    },
    beginEdit() {
      if (!this.editable) {
        if (this.parentTable.focusCell) {
          this.parentTable.focusCell.endEdit();
        }
        this.parentTable.focusCell = this;
        return;
      }
      if (this.status == 'display') {
        if (this.parentTable.focusCell) {
          this.parentTable.focusCell.endEdit();
        }
        this.oldValue = this.row.getValueKey(this.column.field);
        this.parentTable.focusCell = this;
        this.status = 'editor';
      }
    },
    endEdit() {
      // console.log('endEdit',this.status,this.column.field);
      if (this.status == 'editor') {
        let newValue = this.row.getValueKey(this.column.field);
        if(this.column.dataType == 'numeric'){
          newValue = new Number(newValue).toFixed(this.column.ccPoint);
          this.$set(this.row.data,this.column.field,newValue);
        }
        // console.log(newValue,'newValue',this.column.field,this.oldValue);
        if (newValue != this.oldValue && (newValue || this.oldValue)) {
          this.checkGS();
          this.row.data.sys_updated = true;
          this.row.data.sys_stated = this.row.data.sys_stated | billState.EDITED;
          this.parentTable.rowChange(this.row.data,this.column);
        }
      }
      this.status = 'display'
    },
    on_init_ref(options, event) {
      this.column && this.row && this.column.refInit && this.column.refInit(options, this.row.data, event);
    },
    checkGS(){
      console.log("checkGS")
      const attr = this.column.attr;
      if((attr&0x100000)>0){
        this.checkMulCols();      
      }
      _.forEach(this.row.columns,col => {
        let scstr = col.script;
        if(scstr&&scstr.indexOf('=:')===0){
          scstr = scstr.replace('=:','');
          // 公式计算

          this.row.scriptProc.execute(scstr,null,col);
          // console.log(vl,this.row.data,col.field);
          // this.data[col.field] = vl;
          // this.$set(this.row.data,col.field,vl);
        }
      })
      // console.log(this.row);
    },
    // 多列计算
    checkMulCols(){
      console.log("多列计算")
      var script = this.column.script;
      if(script){
        script = script.split('&');
        var cols = script[0].split(',');
        var _indexs = script[1].split(',');
        var refValues = this.column.refValues;
        var id = this.row.data[this.column.field];
        var refInfo;
        if(refValues){
          _.forEach(refValues.values,(item ,n)=> {
            if(item[refValues.cols[0]] === id){
              refInfo = item;
            }
          });
        }
        if(refInfo){
          _.forEach(cols,(col,n)=>{
            var vv = refInfo[refValues.cols[_indexs[n]]];
            // console.log(vv,col);
            if(vv){
              var cl = this.row.getColumn(col);
              if ( cl.dataType == 'numeric' ) {
                vv = new Number(vv).toFixed(cl.ccPoint);
              }
              vv+='';
              this.$set(this.row.data,col,vv)
            }
          });
        }
      }
    },
    initType(){
      if(this.column){ 
        //先判断编辑器是什么类型，对应走什么组件
        if(this.column.editType==this.INPUT_LIST){
          this.inputType ="enum"//this.INPUT_LIST;
          return;
        }if(this.column.editType==this.INPUT_CHECK){
          this.inputType = this.INPUT_CHECK;
          return;
        }if(this.column.editType==this.INPUT_RADIO){
          this.inputType = this.INPUT_RADIO; 
          return;
        }if(this.column.editType==this.INPUT_TEXTAFC){
          this.inputType = this.INPUT_TEXTAFC;
          return;
        }
        //判断字段是辅助，并且是否是特殊辅助
        if(this.column.assist){
          // this.analysisScript();   
          var  editName = this.column.editName; 
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
      }
    },  
  },
  mounted() {   
    this.parentTable = getClosestVueParent(this.$parent, 'md-bip-grid');
    this.$nextTick(() => {
      this.canFireEvents = true;
    }); 
  },
};
</script>