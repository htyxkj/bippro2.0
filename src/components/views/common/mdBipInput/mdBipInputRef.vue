<template>
  <md-input-container>
    <div class="md-input-ref layout layout-row">
      <label>{{cell.labelString}}</label>
      <md-input v-model="refValue" @focus="onFocus" @blur="onBlur" :required="cell.isReq" :disabled="disabled"></md-input>
      <md-button class="md-icon-button md-ref-filter" @click="openRef()" :disabled="disabled">
        <md-icon>search</md-icon>
      </md-button>
      <md-bip-dia :assType="cell.assType" ref="ref" :mdRefId="cell.editName" :multiple="multiple" :mdSelection="mdSelection" @close="onRefClose" :disabled="disabled"></md-bip-dia>
    </div>
  </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  props: {dsm:{default:null,type:Object},},
  data(){
    return{
      refValue:'',
      refData:{},

      // mdSelection:false, 
      // multiple:false
    }
  },
  mounted(){  
    if(this.modal){ 
      var bb = this.modal[this.cell.id];
      if(bb){
        this.oldValue = this.modal[this.cell.id];
      }else{
        this.oldValue = '';
      }
    } 
    this.initVV();
  },
  methods:{
    async initVV(){ 
      // console.log('initVV')
      var defv = this.modal[this.cell.id];
      if(defv){
        this.refValue = defv;
        this.onBlur();
      }else{
        this.refValue=''; 
        this.refData = {};
        // console.log(this.refData);
      }
    },
    async openRef(){
      let script = await this.analysisScript()
      // if(script)
      this.$refs['ref'].open(script)
    },
    onRefClose(data){
      if(data){
        // console.log('REF')
        data.cellId = this.cell.id;
        this.refData = data;
        if(this.multiple){
          this.refData.value = data.value;
          let val="";

          for(var i =0 ;i<data.value.length;i++){
            let refDv=this.refData.value[i];
            if(i== data.value.length-1){
              val+=refDv[this.refData.cols[0]]
            }else{
              val+=refDv[this.refData.cols[0]]+";"
            }
          }
          if(val !== this.oldValue){
            this.refData.oldValue = this.oldValue;
          }
          this.$set(this.modal,this.cell.id,val);
          this.$emit('change',data);
          this.makeRefInput(data);
        }else{
          this.refData.value = data.value[0];
          // console.log(this.refData.value[this.refData.cols[0]],this.oldValue);、
          // console.log(this.refData.value[this.refData.cols[0]]);
          // console.log(this.oldValue);
          if(this.refData.value[this.refData.cols[0]] !== this.oldValue){
            // this.oldValue = this.refData.value[this.refData.cols[0]] ;
            this.refData.oldValue = this.oldValue;
            this.$set(this.modal,this.cell.id,this.refData.value[this.refData.cols[0]]);
            this.$emit('change',data);
            this.makeRefInput(data);
          }
        }
      }
    },
    makeRefInput(data){
      if (this.cell.refValue) {
        // var id =this.scriptReference(); 
        var id = 1;
        if(this.multiple){
          var  val='';
          for(var i=0;i<data.value.length;i++){
            if(i==data.value.length-1){
              val = val +data.value[i][data.cols[id]]
            }else{
              val = val +data.value[i][data.cols[id]]+";"
            }
          }
          this.refValue=val;
        }else{
           
          this.refValue = data.value[data.cols[id]];
        }
      } else {
         if(this.multiple){
          var  val='';
          for(var i=0;i<data.value.length;i++){
            if(i==data.value.length-1){
              val = val +data.value[i][data.cols[0]]
            }else{
              val = val +data.value[i][data.cols[0]]+";"
            }
          }
          this.refValue=val;
        }else{
          this.refValue = data.value[data.cols[0]];
        }
      }
    },
    onFocus(){
      // console.log("onFocus")
      if (this.refData.cols){
        if(this.multiple){
          var val=""
          for(var i =0;i<this.refData.value.length;i++){
            var aa = this.refData.value[i];
            if(i==this.refData.value.length-1){
              val += aa[this.refData.cols[0]]
            }else{
              val += aa[this.refData.cols[0]]+";"
            }
          }
          this.refValue=val;
        }else{
          this.refValue=this.refData.value[this.refData.cols[0]];
        }
      }
    },
    onBlur(){
      // console.log("onBlur")
      if (this.refData.cols){
        if(this.refValue ===''){
        //  console.log(166)
          this.refData.value=[];
          this.refData.oldValue = this.refValue;
          // if(this.refData.value[this.refData.cols[0]] !== this.oldValue){
          this.$set(this.modal,this.cell.id,'');
          this.$emit('change',this.refData);
          // }
        }else{
          if(this.refValue==this.refData.value[this.refData.cols[0]]){
            this.$set(this.modal,this.cell.id,this.refValue);
            if(this.cell.refValue){
              // var id =this.scriptReference(); 
              var id =1;
              this.refValue=this.refData.value[this.refData.cols[id]];
            }else{
              this.refValue=this.refData.value[this.refData.cols[0]];
            }
            // console.log(165)
          }else{
            if(this.cell.editName){
              // console.log(167)
              var indexFH = this.refValue.indexOf(";");
              var count ="";
              if(indexFH!=-1){
                var val =this.refValue.replace(/;/g,"','")
                var key= this.cell.id
                // count = "~"+key+" in ('"+val+"')";
                count = "@('"+val+"')";
              }else{
                count = this.refValue
              }
              let script =  this.analysisScript();
              let assType = this.cell.assType;
              this.getAssistDataByAPICout(this.cell.editName,count,script,assType,this.getCallBack,this.getCallError);
            }
          }   
        }
      }else{
        if(this.refValue !== ''){
          if(this.cell.editName){
            // console.log(188)
            var indexFH = this.refValue.indexOf(";");
              var count ="";
              if(indexFH!=-1){
                var val =this.refValue.replace(/;/g,"','")
                var key= this.cell.id
                // count = "~"+key+" in ('"+val+"')";
                count = "@('"+val+"')";
              }else{
                count = this.refValue
              }
              let script =  this.analysisScript();
              let assType = this.cell.assType;
              this.getAssistDataByAPICout(this.cell.editName,count,script,assType,this.getCallBack,this.getCallError);
          }
        }else{
          this.modal[this.cell.id]='';
        }
      }
    },
    getCallBack(res){ 
      var data = res.data;
      if(data.code == 1) {
        var refBackData = {
          cols:[],
          value:[],
          multiple:false,
        };
        refBackData.cols = data.allCols;
        refBackData.cellId = this.cell.id;
        refBackData.multiple = this.multiple;
        if (this.multiple){
          refBackData.value = data.values;
        }else{
          refBackData.value = data.values[0];
        }
        this.refData = refBackData;
        let newValue ="";
        if(this.multiple){
          for(var i=0;i<this.refData.value.length;i++){
            if(i==this.refData.value.length-1){
              newValue += this.refData.value[i][this.refData.cols[0]];
            }else{
              newValue += this.refData.value[i][this.refData.cols[0]]+";";
            }
          }
        }else{
          newValue = this.refData.value[this.refData.cols[0]];
        }
        this.refData.oldValue = this.oldValue;
        if(newValue !== this.oldValue){
            this.$emit('change',this.refData);
        }
        this.$set(this.modal,this.cell.id,newValue);
        this.makeRefInput(this.refData);
      }else if(data.code == 0){
        if(this.refData.cols){
          this.makeRefInput(this.refData);
        }else{
          this.refValue='';
        }
        this.$notify.warning({content: data.message});
      }else{
        this.$notify.danger({content: data.message});
      }
    },
    getCallError(res){
      this.$notify.danger({content: res.data.message});
    }, 
    analysisScript(){ 
      // console.log(this.cell.assType);
      if(this.cell.assType == 'C_GROUP'){
        var aa = this.cell.script.split(";");      
        var sc = aa[aa.length-1];
        if(sc.indexOf("*") != -1){
          var arr = sc.split("*");
          return this.checkScript(this.dsm,arr[0],arr[1])
        }else{
          return this.checkScript(this.dsm,this.cell.c_par.obj_id,sc)
        }
      }
    },
    //c_group 检查所有对像 中的字段
    checkScript(cell,objid,valid){
      if(cell.ccells.obj_id == objid){//先检查主对象
        // var len = parseInt(this.dsm.cdata.length)-1; 
        // console.log(this.dsm.currRecord[valid])
        return this.dsm.currRecord[valid];
      }else{
        if(cell.ccells.haveChild){
          for(var i =0;i<cell.ds_sub.length;i++){
            this.checkScript(cell.ds_sub[i],objid,valid);
          }
        }
      }
    },
    //解析辅助公式中的复制参照
    scriptReference(){
      var id =1;
      if(this.cell.script!=null && this.cell.script !=''){
        var aa = this.cell.script.split(";");      
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
    }
  }, 
  watch:{
    modal:{
      handler: function () { 
        if(this.oldValue !=this.modal[this.cell.id]){
          this.oldValue = this.modal[this.cell.id];
          this.initVV();
        }
      },
      deep: true
    }, 
  } 
}
</script>

