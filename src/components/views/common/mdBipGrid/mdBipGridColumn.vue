<template>
  <!-- Never render the contents -->
  <!-- The scoped slot won't have the required data -->
  <div v-if="false">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    field: { required: false, type: String },
    label: { default: null, type: String },
    dataType: { default: 'string', type: String },
    multiple: { default: false, type: Boolean },
    refType: { default: '', type: String },
    refId: { default: '', type: String },
    refInit: { default: v => v, type: Function },
    editable: { default: false, type: Boolean },
    sortable: { default: false, type: Boolean },
    sortBy: { default: null },
    filterable: { default: false, type: Boolean },
    filterOn: { default: null },
    formatter: { default: v => v, type: Function },
    hidden: { default: false, type: Boolean },
    isTool: { default: false, type: Boolean },
    cellClass: { default: '' },
    headerClass: { default: '' },
    width: { default: '150px' },//宽度
    script:{default:'',type:String},
    attr:{default:0,type: Number},
    ccPoint:{default:0,type:Number},
    refValue:{default:'',type:String},
    isReq:{default:false,type:Boolean},//是否必填
    editName:{default:'',type:String},//字段类型   规则字段
    editType:{default:-1,type:Number},//字段类型   编辑器字段
    assist:{default:false,type:Boolean},//是否是辅助
    objid:{default:'',type:String},//业务标识
    assType:{default:null,type:String},//辅助类型
  },
};
</script>