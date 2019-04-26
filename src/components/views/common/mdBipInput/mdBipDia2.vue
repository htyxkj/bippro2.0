<template>
  <md-dialog ref="dialog"  @close="onRefClose" class="md-refs-dialog">
      <md-toolbar> 
        <md-layout md-gutter md-flex="100" md-row>
          <md-layout md-flex-xsmall="90" :md-flex="true" style=" margin-top: .12rem;">
            <h1 class="md-title">{{title}}</h1> 
          </md-layout>
          <md-layout md-flex-xsmall="0" :md-flex="true">
            <md-input-container class="md-flex md-header-search">
              <md-input class="md-header-search-input"  placeholder="search" @keyup.enter.native="doQuery(word)" v-model="word"></md-input>
              <md-button class="md-icon-button md-inset" @click="doQuery(word)">
                <md-icon>search</md-icon>
              </md-button>
            </md-input-container>  
          </md-layout>
          <md-layout md-flex-xsmall="10" md-flex-small="10" md-flex-medium="10" md-flex-large="10" >
            <md-button class="md-icon-button" @click.native="cancel()">
              <md-icon>close</md-icon>
            </md-button>   
          </md-layout>
        </md-layout> 
      </md-toolbar>
      <md-dialog-content class="no-padding">
        <md-table ref="table" @select="selectedRow" :multiple="multiple" :md-selection="mdSelection">
          <md-table-header>
            <md-table-row>
              <md-table-cell v-for="(name,index) in header" :key="index">
                {{name}}
              </md-table-cell>
              <!-- 辅助类型是 CGDIC 单独添加商品单位列 -->
              <md-table-cell v-if='assType == "C_GDIC"'>
                单位
              </md-table-cell>

            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="(row, rowIndex) in refData" 
              :key="rowIndex" 
              :md-item="row"
              :md-selection="mdSelection" md-auto-select
              :initCheckbox="isCheckd(row,showCols)">
              <md-table-cell v-for="(column, columnIndex) in showCols" :key="columnIndex"  @dblclick.native="dblclick(row)">
                {{row[allCols[column]]}}
              </md-table-cell>
              <md-table-cell v-if='assType == "C_GDIC"'>
                <md-select v-model="row.cc">
                  <md-option  v-for="(dw,index) in toJSONARR(row.ghsunit,row)" :key="index"  :value="dw.bzunit+'-'+dw.hsgx">{{dw.name}}</md-option>
                </md-select>            
              </md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-dialog-content>
      <md-dialog-actions>
        <md-table-pagination
          :md-size="pageInfo.size"
          :md-total="pageInfo.total"
          :md-page="pageInfo.page"
          :md-page-options="[20]"
           @pagination="onTablePagination"
         >
        </md-table-pagination>
        <span class="flex"></span>
        <md-button class="md-accent md-raised" @click.native="close()">确定</md-button>
        <md-button class="md-warn" @click.native="cancel()">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
</template>

<script>
import qs from 'qs'
import axios from 'axios'
export default {
  props: {
    value: { 
      default:null,
    },
    multiple: {
      type: Boolean,
      default: false
    },
    mdMax: {
      type: Number,
      default: Infinity
    },
    mdPageSize:{
      type:[Number,String],
      default:'20'
    },
    mdRefId: String,
    options:{
      type:Object,
      default(){
        return {
          wheres:{},
          orders:{}
        }
      }
    },
    mdSelection:{
      type:Boolean,
      default:false
    },
    disabled:{
      type:Boolean,
      default:false
    },
    assType:null,//辅助类型 
  },
  data(){
    return{
      word:'',
      refData:[],
      pageInfo:{
          size:this.mdPageSize,
          total:0,
          page:1
      },
      selectedRows:[],
      parentTable:'',
      header: [],
      showCols:[],
      allCols:[],
      title:'',
      unit:null,
      script:null,
      allSelectRow:{},//多页选中行
      refvalue:[],//
    } 
  }, 
  mounted(){
    
  },
  methods:{
    async open(script){
      this.refvalue = this.value.split(";");
      this.allSelectRow=[];
      this.script = script;
      // console.log(this.assType)
      if(this.assType == 'C_GDIC'){
        if(this.unit == null){
          await this.getUNIT();
        }
      }
      this.$refs['dialog'].open()
      this.doQuery('')
    },
    onRefClose(){
    },
    selectedRow(items){ 
      this.allSelectRow=[];
      let sleRow =[];
      if(this.multiple){
        var i=0
        for(var x in items){
          sleRow[i] = items[x]
          i++;
        }
      }else { 
        for(var x in items){
          sleRow[0] = items[x]
        }
      }
      this.selectedRows = sleRow;

    },
    doQuery(word){ 
      var option={
        'pageSize': this.pageInfo.size,
        'page':this.pageInfo.page,
        'assistid': this.mdRefId,
        'cont': word,
        'assType':this.assType,
        'script':this.script,
      }; 
      if (this.mdRefId) {
        this.getAssistODataByAPI(option,this.getCallBack,this.getCallError);
      }
    },
    getCallBack(res){  
      this.refData = [];
      var data = res.data;
      this.title = data.title;
      this.header = data.labers;
      this.showCols = data.showCols;
      this.allCols = data.allCols;
      if(data.code==1){
        this.refData = data.values;
        if(this.assType == 'C_GDIC'){
          for(var i=0;i<this.refData.length;i++){
            this.refData[i].cc = this.refData[i][this.allCols[this.allCols.length-2]]+'-1';
          }
        }
        this.pageInfo.total = data.total;
        this.pageInfo.size = data.size;
      }
      // else if (data.code==0){
      //   // this.$notify.warning({content: data.message});
      else{
        this.pageInfo.total = 0;
        this.$notify.danger({content: data.message});
      }
    },
    getCallError(res){
      // console.log(res);
      this.$notify.danger({content: res.data.message});
    },
    cancel(){
      this.$refs['dialog'].close();
      this.$emit('close',false);
    },
    close(){ 
      if(this.assType == 'C_GDIC'){
        for(var i=0;i<this.selectedRows.length;i++){
          var bb = this.selectedRows[i].cc+'';
          var cc =bb.split("-");
          this.selectedRows[i][this.allCols[this.allCols.length-2]]=cc[0];
          this.selectedRows[i][this.allCols[this.allCols.length-1]]=cc[1];
        }
      }
      if(this.selectedRows.length>0){
        var refBackData = {
          cols:[],
          value:[],
          multiple:this.multiple
        };
        refBackData.cols = this.allCols;
        if(!this.multiple){
          refBackData.value[0] = this.selectedRows[0];
        }else{
          refBackData.multiple = true; 
          refBackData.value= this.selectedRows; 
        }
        this.$emit('close',refBackData);
      }
      this.$refs['dialog'].close();
    },
    makeRefData () {
      if(this.selectedRows){
      }
    },
    dblclick(row){
      this.close();
    },
    onTablePagination(page){ 
      this.pageInfo.page = page.page;
      this.pageInfo.size = page.size;
      this.doQuery(this.word);
    },
    toJSONARR(json,row){  
      if(this.unit == null){
        this.getUNIT();
      } 
      var hsunit = row[this.allCols[this.allCols.length-2]];
      var arr = {"bzunit":hsunit,"hsgx":"1","name":this.unit[hsunit]} 
      var j = JSON.parse(json); 
      j.unshift(arr); 
      j=JSON.stringify( j )  
      return JSON.parse(j); 
    },
    //获取单位信息
    async getUNIT(){ 
        this.unit = {};
        var option={
          'dbid': global.DBID,
          'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
          'pageSize': 100000,
          'page':1,
          'assistid': '$D.UNIT',
          'apiId': "assist",  
        }; 
        let _this = this;
        await axios.post(`${global.BIPAPIURL}`+`${global.API_COM }`,qs.stringify(option)) .then(res=>{
            for(var i=0;i<res.data.values.length;i++){
              _this.unit[res.data.values[i].ubm] = res.data.values[i].umc;
            }
        }) .catch(err=>{
            console.log(err)
        }) 
    },
    isCheckd(row,showCols){  
      let cc = false;
      for(var i=0;i<this.refvalue.length;i++){
        cc = (this.refvalue[i] === row[this.allCols[showCols[0]]]);
        if(cc == true){ 
          break;
        }
      } 
      return cc;
    }
  },
  watch:{
    word(val){
      // this.doQuery(val)
    }, 
  },
 
};
</script>
