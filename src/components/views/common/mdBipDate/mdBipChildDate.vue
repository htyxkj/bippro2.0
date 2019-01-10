<template>
  <div class="md-date md-input-ref layout-row">
    <input 
    :name="name"
    :id="dateID"
    ref="input"
    type="text"
    :value="value"
    :disabled="disabled" 
    v-on:input="updateValue($event.target.value)" />
    <div md-menu-trigger v-on:click="dateIconClick">
      <slot>
        <md-button class="md-icon-button" :disabled="disabled" v-if="!disabled"><md-icon>date_range</md-icon></md-button>
      </slot>
    </div> 
  </div>
</template>

<script>
  // import common from './common';
  // import getClosestVueParent from '../../../core/utils/getClosestVueParent';
 
  import moment from 'moment';
  export default {
    // mixins: [common],
    props: {
      column:null,
      isReport:null, 
      row:null,
      value: [String, Number,Array],
      name: String, 
    },
    data () {
      return { 
        dateID:this._dateID(),
        checkVal:"",  
        dateFomt:'YYYY-MM-DD', 
        range:false,
        disabled:false,
      }
    }, 
    watch: { 
      checkVal(){ 
        // this.$emit("change",this.checkVal);
        if (this.checkVal == undefined) {
          this.checkVal = '';
        }
        if(this.disabled){
          return ;
        }  
        var formattedValue =this.formattedValue(this.checkVal);
        if (formattedValue !== this.checkVal||this.$refs.input.value !=formattedValue) {
          this.$refs.input.value = formattedValue;
        }
        this.$emit('input',this.checkVal);
      },
    },
    methods: {   
      _dateID(){
        var reg = new RegExp( '\\.' , "g" ) 
        return this.row.data.vueRowId.replace(/_/g, "").replace( reg , '' )+"row"; 
      },
      dateIconClick(){
        jeDate('#'+this.dateID ,{ 
          trigger:false,
          format:this.dateFomt, 
          range:this.range,
          theme:{ bgcolor:"#2196F3",color:"#ffffff", pnColor:"#00CCFF"},
          isClear:false,
          donefun: (obj) => { 
            this.checkVal = obj.val 
          }, 
          clearfun:(elem,val)=>{ 
          },
        });
      },
      formtDate(){ 
        // 文档地址:http://www.jemui.com/uidoc/jedate.html
        // 注意：zz 的含义 就是补全00
        // 例如 YYYY-MM-DD hh 得到的是 2017-05-02 10
        // 如果 YYYY-MM-DD hh:zz 得到的是 2017-05-02 10:00
        // 日期格式 可以随意组合，下面随意列出几种格式：
        // 1、 YYYY-MM-DD hh:mm:ss   或者   MM-DD-YYYY hh:mm:ss   或者   MM/DD/YYYY hh:mm:ss
        // 2、 YYYY-MM-DD hh:mm   或者   MM-DD-YYYY hh:mm   或者   MM/DD/YYYY hh:mm
        // 3、 YYYY-MM-DD hh   或者   MM-DD-YYYY hh   或者   MM/DD/YYYY hh
        // 4、 YYYY-MM-DD   或者   MM-DD-YYYY   或者   MM/DD/YYYY
        // 5、 YYYY-MM
        // 6、 YYYY
        // 7、 hh:mm:ss
        // 8、 hh:mm
        // 9、 hh
        // 10、 YYYY-MM-DD hh:zz
        // 11、 hh:zz
        // 规则  DATE、DATETIME、HS、H_S、H_SM、H_S_M、YM、Y-M
        //       DATE:2018-07-01
        //       DATETIME:2018-07-01 10:00:21
        //       HS:0510
        //       H_S:05:10
        //       H_S_M:01:01:01
        //       YM:201708
        //       Y-M:2017-08 
        if(this.column.editName=='DATE'){
          this.dateFomt='YYYY-MM-DD';
        }else if(this.column.editName=='DATETIME'){
          this.dateFomt='YYYY-MM-DD hh:mm:ss';
        }else if(this.column.editName=='HS'){ 
          this.dateFomt='hh:mm';
        }else if(this.column.editName=='H_S'){ 
          this.dateFomt='hh:mm';
        }else if(this.column.editName=='H_SM'){ 
          this.dateFomt='hh:mm:ss';
        }else if(this.column.editName=='YM'){ 
          this.dateFomt='YYYYMM';
        }else if(this.column.editName=='Y-M'){ 
          this.dateFomt='YYYY-MM';
        } 
      },
      updateValue: function (value) {
        if (value == undefined) {
          value = '';
        }
        if(this.disabled){
          return ;
        }  
        var formattedValue =this.formattedValue(value);
        if (formattedValue !== value||this.$refs.input.value !=formattedValue) {
          this.$refs.input.value = formattedValue;
        }
        // this.setParentValue(formattedValue);
        this.$emit('input',formattedValue);
        // this.$emit('change',formattedValue);
      },
      formattedValue(value){ 
        var format = this.dateFomt.replace('hh','HH')
        value= moment(value).format(format);
        return value=='Invalid date'?'':value;
      },
    },
    mounted() {
      console.log("sdsd")
      var aa = 0x40;
      let notedit = this.column.attr & aa;
      this.disabled = notedit > 0 ? true : false; 
      if(this.isReport){
        this.range="~"
      } 
      this.formtDate() 
      this.checkVal =this.formattedValue(this.value); 
      this.updateValue(this.checkVal);
    }
  };
</script>
