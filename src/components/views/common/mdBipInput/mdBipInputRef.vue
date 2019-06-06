<template>
  <md-input-container>
    <div class="md-input-ref layout layout-row">
      <label>{{cell.labelString}}</label>
      <md-input v-model="refValue" @focus="onFocus" @blur="onBlur" :required="cell.isReq" :disabled="disabled"></md-input>
      <md-button class="md-icon-button md-ref-filter" @click="openRef()" :disabled="disabled">
        <md-icon>search</md-icon>
      </md-button>
      <md-bip-dia :value="modal[this.cell.id]" :assType="cell.assType" ref="ref" :mdRefId="cell.editName" :multiple="multiple" :mdSelection="mdSelection" @close="onRefClose" :disabled="disabled"></md-bip-dia>
      <md-bip-object-dia ref="objcetCell" :value="modal[this.cell.id]" :cell="cell" :assType="cell.assType" :mdRefId="cell.editName" @writeBack="writeBack" :disabled="disabled"></md-bip-object-dia>
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
      groupCell:null,
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
      if(this.cell.assType == 'C_GROUP'){
        if(!script){
          if(this.groupCell){
            this.$notify.danger({content: '请先填写 : "'+this.groupCell.labelString +'"'});
          }
          return;
        }
      }else if(this.cell.assType == 'C_QUERY'){
        this.$refs['objcetCell'].open(script) 
        return;
      }
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
          this.makeRefInput(data);
          this.$emit('change',data);
        }else{
          this.refData.value = data.value[0];
          // console.log(this.refData.value[this.refData.cols[0]],this.oldValue);
          // console.log(this.refData.value[this.refData.cols[0]]);
          // console.log(this.oldValue);
          if(this.refData.value[this.refData.cols[0]] !== this.oldValue){
            // this.oldValue = this.refData.value[this.refData.cols[0]] ;
            this.refData.oldValue = this.oldValue;
            this.$set(this.modal,this.cell.id,this.refData.value[this.refData.cols[0]]);
            this.makeRefInput(data);
            this.$emit('change',data);
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
              
              
              // let script = "";
              // let assType = "";
              // let assid = this.cell.refValue.replace("{&","{")
              // this.getAssistDataByAPICout(assid,count,script,assType,this.getCallBack,this.getCallError);
              if(this.cell.assType && this.cell.assType =='C_QUERY'){
                let script = "";
                let assType = "";
                let assid = this.cell.refValue.replace("{&","{")
                this.getAssistDataByAPICout(assid,count,script,assType,this.getCallBack,this.getCallError);
              }else{
                let script =  this.analysisScript();
                let assType = this.cell.assType;
                this.getAssistDataByAPICout(this.cell.editName,count,script,assType,this.getCallBack,this.getCallError);
              }
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

              if(this.cell.assType && this.cell.assType =='C_QUERY'){
              
                let script = "";
                let assType = "";
                let assid = this.cell.refValue.replace("{&","{")
                this.getAssistDataByAPICout(assid,count,script,assType,this.getCallBack,this.getCallError);
              }else{
                let script =  this.analysisScript();
                let assType = this.cell.assType;
                this.getAssistDataByAPICout(this.cell.editName,count,script,assType,this.getCallBack,this.getCallError);
              }
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
          newValue += this.refData.value[this.refData.cols[0]];
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
          this.groupCell = this.getCell(arr[1]);
          return this.checkScript(this.dsm,arr[0],arr[1])
        }else{
          this.groupCell = this.getCell(sc);
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
    },
    getCell(id){
      return _.find(this.dsm.ccells.cels,item=>{
        return id === item.id
      });
    },
    writeBack(res){ 
      if(this.dsm.canEdit){
        let rtnpar = res[0];
        let crd = this.dsm.currRecord;
        let _self = this;
        _.forEach(rtnpar.cdata,function(key,v){
          let i = _.findIndex(rtnpar.kft,function(n){
            return n.keyf ===v;
          });
          if(i>-1){
            _self.$set(_self.dsm.currRecord,rtnpar.kft[i].keyt,key);
          }else{
            _self.$set(_self.dsm.currRecord,v,key);
          }
        })
        // console.log("Set 子表")
        //单子表
        if(!this.istabs){
          let oneChild = res[1]; 
          _self.dsm.ds_sub[0].cdata=[];
          _.forEach(oneChild.cdata,function(key,v){  
            _self.onLineAdd(_self.dsm.ds_sub[0]); 
            let data ={};
            _.forEach(key,function(value,index){
              let i = _.findIndex(oneChild.kft,function(n){ 
                return n.keyf ===index;
              }); 
              if(i>-1){
                _self.$set(_self.dsm.ds_sub[0].cdata[v],oneChild.kft[i].keyt,value); 
              }else{ 
                _self.$set(_self.dsm.ds_sub[0].cdata[v],index,value);
              }   
            }); 
          }); 
        }else{//多个子表
          for(var p=1;p<=res.length;p++){
            let oneChild = res[p]; 
            _self.dsm.ds_sub[p].cdata=[];
            _.forEach(oneChild.cdata,function(key,v){  
              _self.onLineAdd(_self.dsm.ds_sub[p]);  
              let data ={};
              _.forEach(key,function(value,index){  
                let i = _.findIndex(oneChild.kft,function(n){ 
                  return n.keyf ===index;
                }); 
                if(i>-1){
                  _self.$set(_self.childrens[p].data.cdata[v],oneChild.kft[i].keyt,value);  
                }else{ 
                  _self.$set(_self.childrens[p].data.cdata[v],index,value); 
                }   
              }); 
            });
          }
        }  
        let cc = {cellId:this.cell.id};
        this.$emit('change',cc);
      }
    }, 
    onLineAdd(subdsm) {  
      // this.curr_dsm = subdsm;
      var subId = subdsm.ccells.obj_id;
      if (!this.dsm.canEdit) return;
      var crd = subdsm.createRecord();
      // console.log(subdsm,subId,crd);
      if (!this.dsm.currRecord[subId]) {
        this.dsm.currRecord[subId] = [];
      }
      this.dsm.currRecord[subId] = subdsm.cdata;
    },    
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

