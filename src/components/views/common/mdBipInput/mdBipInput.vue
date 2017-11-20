<template>
  <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20" v-if="cell.isShow">
    <slot name="editor"></slot>
    <template v-if="inputType == INPUT_COMMON" >
      <md-bip-input-comm :cell="cell" :modal="modal"  :ref="cell.id" @change="dataChange"></md-bip-input-comm>
    </template>
    <template v-if="inputType == INPUT_DATE" >
      <md-bip-input-date :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-date>
    </template>
    <template v-if="inputType == INPUT_REF">
      <md-bip-input-ref  :cell="cell" :modal="modal" @change="dataChange" :ref="cell.id"></md-bip-input-ref>
    </template>
    <template v-if="inputType == INPUT_LIST">
      <md-bip-input-list :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-list>
    </template>
    <template v-if="inputType == INPUT_FILE">
      <md-bip-input-file-tmp></md-bip-input-file-tmp>
    </template>

  </md-layout>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  data () {
    return {
      inputType: 0
    }
  },
  created () {
    this.initType();
  },
  watch:{
    'cell': function(){
      this.initType();
    },
    'modal':function(){
      // console.log('modal input');
      // this.onBlur();
    }
  },
  methods: {
    dataChange (data) {
      this.$emit('change',data);
    },
    initType(){
      this.inputType = 0;
      if (this.cell) {
        if (this.cell.type === 91 || this.cell.type === 93 || this.cell.editName == 'DATE' ) {
            if(this.btj){
              this.inputType = 0;
            }else{
              this.inputType = this.INPUT_DATE;
            }
            return ;
        }
        if (this.cell.assist){
          if (this.cell.editName == 'UPDOWN') {
            this.inputType = this.INPUT_FILE;
            return ;
          }else {
            if(this.cell.editType==1){
              this.inputType = this.INPUT_LIST;
            }else{
              this.inputType = this.INPUT_REF;
            }
            return ;
          }
        } else {
          this.inputType = 0;
          var refv = this.cell.refValue;
          if(refv == '{&DATETIME}'){
            this.inputType = 0;
            return ;
          }
          if (refv !== undefined &&refv !=='') {
            var _index = refv.indexOf('&');
            if (_index>0){
              this.inputType = this.INPUT_REF;
              return ;
            }
            this.inputType = this.INPUT_LIST;
              return ;
          }
        }
      }
    },
    list(){
      this.$emit('list');
    }

  }
}
</script>

