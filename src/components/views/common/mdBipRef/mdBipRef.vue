<template>
  <div class="md-bip-ref">{{refData.name | formartObj(bipRefId,refData.name)}}</div>
</template>
<script>
import common from '../../commonModal.js'
export default {
  data () {
    return {
      refData: {
        code:'',
        name: ''
      },
      showCols:''
    }
  },
  mixins:[common],
  props: {'inputValue':null,'bipRefId':Object,mdNumeric: Boolean},
  mounted () {
    // if(this.inputValue)
      this.initValue();
  },
  watch: {
    'inputValue': function () {
      this.initValue();
    }
  },
  methods: {
    initValue(){
      this.refData.code = this.inputValue;
      this.refData.name = this.inputValue;
      if (this.bipRefId && this.bipRefId.refValue) {
        this.makeRefValue();
      }
    },
    async makeRefValue(){
      var s0 = this.bipRefId.refValue;
      if(s0 == '{&DATETIME}' || s0=='{&DATE}'){
        return ;
      }
      if(this.bipRefId.refCl){
        var cldata = JSON.parse(window.sessionStorage.getItem(this.bipRefId.refValue));
        if(cldata){
          this.makeRef(cldata);
        }
      }else{
        if(!this.refData.code){
          return ;
        }
        var cldata = JSON.parse(window.sessionStorage.getItem(this.bipRefId.refValue+"."+this.refData.code));
        if(cldata){
          this.refData.name = cldata.value[cldata.allCols[1]];
        }else{
          var cc = await this.getCLByAPI({'assistid':this.bipRefId.refValue,'cont':this.refData.code});
          if(cc.data.code==1){
            cldata = {'allCols':cc.data.allCols,'value':cc.data.values[0]};
            this.refData.name = cldata.value[cldata.allCols[1]];
            if(!window.sessionStorage.getItem(this.bipRefId.refValue+"."+this.refData.code))
              window.sessionStorage.setItem(this.bipRefId.refValue+"."+this.refData.code,JSON.stringify(cldata));
          }
        }
      }
    },

    makeRef(cldata){
      let _self = this;
      _.find(cldata.values,function(item){
        // console.log(item);
        if(item[cldata.allCols[0]]==_self.refData.code){
          _self.refData.name=item[cldata.allCols[1]];
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.md-bip-ref{
  width: 100%;
  height: 100%;
}
</style>

