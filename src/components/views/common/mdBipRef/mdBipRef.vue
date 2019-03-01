<template>
  <div class="md-bip-ref">
    <template v-if="bpk"><a @click="pkclick">{{refData.name | formartObj(bipRefId,refData.name)}}</a></template>
    <template v-else>
      {{refData.name | formartObj(bipRefId,refData.name)}}
    </template>
  </div>
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
      showCols:'',
      script:null,//公式
      assType:this.bipRefId.assType//辅助类型   C_GROUP :inetbas.cli.cutil.CGroupEditor
    }
  },
  mixins:[common],
  props: {'inputValue':{default:null},'bipRefId':Object,mdNumeric: Boolean,'row':{default:null,type:Object}},
  mounted () { 
      this.initValue();
  },
  computed:{
    bpk(){
      if(this.bipRefId){
        if((this.bipRefId.attr&1)>0){
          return true;
        }
      }
        return false;
    }
  },
  watch: {
    'inputValue': function () {
      this.initValue();
    }
  },
  methods: {
    pkclick(){
      this.$emit('pkclick');
    },
    initValue(){ 
      this.refData.code = this.inputValue;
      this.refData.name = this.inputValue;
      if (this.bipRefId && this.bipRefId.refValue) {
        this.makeRefValue();
      }
    },
    async makeRefValue(){
      // console.log("makeRefValue")
      var s0 = this.bipRefId.refValue;
      if(s0 == '{&DATETIME}' || s0=='{&DATE}'){
        return ;
      }
      // if(s0&&s0.indexOf('$')>0){
      if(this.bipRefId.refCl){
        var cldata = JSON.parse(window.sessionStorage.getItem(this.bipRefId.refValue));
        if(cldata){
          this.makeRef(cldata);
        }
      }else{
        if(!this.refData.code){
          return ;
        }
        let code = this.refData.code;
        let codeArr = [];
        if(parseInt(code.indexOf(';'))==-1 ){
          codeArr[0] = this.refData.code;
        } else {
          codeArr = code.split(";");
        }
        var valName="";
        for(var i=0;i<codeArr.length;i++){
          var fh=";"
          if(i== codeArr.length-1){
            fh =""
          }
          var cldata = JSON.parse(window.sessionStorage.getItem(this.bipRefId.refValue+"."+codeArr[i]));
          // console.log("cldata:",cldata,codeArr[i])
          if(cldata && cldata!==null){
            // var id = this.scriptReference()
            var id = 1;
            valName+=cldata.value[cldata.allCols[id]]+fh
            this.refData.name = valName;
          }else{
            // console.log(this.assType)
            if(this.assType == 'C_GROUP'){
              var aa = this.bipRefId.script.split(";");      
              var sc = aa[aa.length-1];
              if(sc.indexOf("*") != -1){
                var arr = sc.split("*");
                this.script = this.row[arr[1]]
              }else{
                this.script = this.row[sc]
              }
            }
            var cc = await this.getCLByAPI({'assistid':this.bipRefId.refValue,'cont':codeArr[i],'assType':this.assType,'script':this.script});
 
            if(cc.data.code==1){ 
              for(var j=0;j<cc.data.values.length;j++){
                cldata = {'allCols':cc.data.allCols,'value':cc.data.values[j]}; 
                // var id = this.scriptReference()
                var id =1;
                valName+=cldata.value[cldata.allCols[id]]+fh
                this.refData.name = valName;
                console.log("要Set了！") 
                if(!window.sessionStorage.getItem(this.bipRefId.refValue+"."+cldata.value[cldata.allCols[0]])){
                  window.sessionStorage.setItem(this.bipRefId.refValue+"."+cldata.value[cldata.allCols[0]],JSON.stringify(cldata));
                }
              }
            }
          }
        }
      }
    },
    //解析辅助公式中的复制参照
    scriptReference(){
      var id =1; 
      if(this.bipRefId.script !=null && this.bipRefId.script !=''){
        var aa = this.bipRefId.script.split(";");      
        for(var i=0;i<aa.length;i++){
          var sc = aa[i];
          if(sc.indexOf('&') == -1){
            continue;
          }
          var cc  = sc.split('&');
          if(cc.length>1)
          id=cc[1];
        } 
      }
      return id;
    },
    makeRef(cldata){
      _.find(cldata.values,(item)=>{
        // console.log(item,'fdsfds');
        if(item[cldata.allCols[0]]==this.refData.code){
          this.refData.name=item[cldata.allCols[1]];
        }
      });
    },
 

  }
}
</script>

<style lang="scss" scoped>
.md-bip-ref{
  width: 100%;
  height: 100%;
  a{
    color: rgba(10, 61, 83, 0.76);
    // text-decoration-line: underline;
  }
  a:hover{
    color: red;
    font-weight:bold;
  }
}
</style>

