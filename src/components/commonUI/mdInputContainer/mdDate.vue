<template>
  <div class="md-date md-input-ref layout-row">
    <input type="text" 
      ref="input"
      class="md-input" 
       @focus="onFocus"
       @blur="onBlur" 
       :value="value" 
       :disabled="disabled" 
       :required="required" 
       v-on:input="updateValue($event.target.value)" />
    <md-select-date :value="value" @change="updateValue" :boption="option" :disabled="disabled" ></md-select-date>
  </div>
</template>
<script>
import common from './common';
import getClosestVueParent from '../../core/utils/getClosestVueParent';
import moment from 'moment';
export default {
  mixins: [common],
  props: {
    btime:null,
    btimeformat:null,
    option: {
      type: Object,
      default () {
        return {
          type: this.btime ,
          SundayFirst: false,
          week: ['一', '二', '三', '四', '五', '六', '日'],
          month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          format: this.btimeformat ,
          color: {
            checked: '#F50057',
            header: '#3f51b5',
            headerText: '#fff'
          },
          wrapperClass: '',
          placeholder: '',
          buttons: {
            ok: '确定',
            cancel: '取消'
          },
          overlayOpacity: 0.5,
          dismissible: true,
        }
      }
    },
    disabled:false,
  },
  watch: {
    value(value) {
      // console.log(value);
      if(value === '' || value===undefined){
        value = '';
      }else{
        value=this.formattedValue(value||moment.now());
      }
      this.setParentValue(value);
      this.updateValues(value);
      this.updateValue(value);
    },
  },
  methods: {
    formattedValue(value){   
      if(this.option.type == 'hour'){ 
        let val = value; 
        if(val.indexOf("-")==-1){
          val = '2018-06-27 '+value; 
        } 
        value = moment(val).format(this.option.format)  
        return value;
      }
      value= moment(value).format(this.option.format);  
      return value=='Invalid date'?'':value;
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
      this.setParentValue(formattedValue);
      this.$emit('input',formattedValue);
      this.$emit('change',formattedValue);
    },
    onFocus() {
      if (this.parentContainer) {
        this.parentContainer.isFocused = true;
        if (!this.$refs.input.value)
          this.updateValue(this.value);
      }
    },
    onBlur() {
      if(this.parentContainer){
        this.parentContainer.isFocused = false;
      }
      this.setParentValue();
    },
  },
  mounted() {  
    this.$nextTick(() => {
      this.parentContainer = getClosestVueParent(this.$parent, 'md-input-container');

      if (!this.parentContainer) {
        this.$destroy();
        throw new Error('You should wrap the md-textarea in a md-input-container');
      }
      this.setParentDisabled();
      this.setParentRequired();
      this.updateValues();
      this.updateValue(this.value);
    });
  },
}
</script>