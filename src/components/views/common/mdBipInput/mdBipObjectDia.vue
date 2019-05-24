<template>
  <md-dialog ref="dialog"  class="md-refs-dialog">
      <md-toolbar> 
        <md-layout md-gutter md-flex="100" md-row> 
          <md-layout md-flex-xsmall="90" :md-flex="true" style=" margin-top: .12rem;">
            <h1 class="md-title">{{title}}</h1> 
          </md-layout> 
          <md-layout md-flex-xsmall="10" md-flex-small="10" md-flex-medium="10" md-flex-large="10" >
            <md-button class="md-icon-button" @click.native="cancel()">
              <md-icon>close</md-icon>
            </md-button>   
          </md-layout>
        </md-layout> 
      </md-toolbar>
      <md-dialog-content class="no-padding">
        <!-- <md-table ref="table" @select="selectedRow" :multiple="multiple" :md-selection="mdSelection">
          <md-table-header>
            <md-table-row>
              <md-table-cell v-for="(name,index) in header" :key="index">
                {{name}}
              </md-table-cell> 
              <md-table-cell v-if='assType == "C_GDIC"'>
                单位
              </md-table-cell>

            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="(row, rowIndex) in refData" 
              :key="rowIndex" 
              :md-item="row"
              :md-selection="mdSelection" md-auto-select> 
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
        </md-table> -->
      </md-dialog-content>
      <md-dialog-actions>
        <!-- <md-table-pagination
          :md-size="pageInfo.size"
          :md-total="pageInfo.total"
          :md-page="pageInfo.page"
          :md-page-options="[20]"
           @pagination="onTablePagination"
         >
        </md-table-pagination>
        <span class="flex"></span>
        <md-button class="md-accent md-raised" @click.native="close()">确定</md-button>
        <md-button class="md-warn" @click.native="cancel()">取消</md-button> -->
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
      pageInfo:{
          size:this.mdPageSize,
          total:0,
          page:1
      },
      title:"",
    } 
  },
  mounted(){ 

  },
  methods:{ 
    async open(){ 
      this.$refs['dialog'].open();
      this.doQuery();
    },
    cancel(){
      this.$refs['dialog'].close();
      this.$emit('close',false);
    },
    doQuery(){
      console.log("doQuery")
      var option={
        'pageSize': this.pageInfo.size,
        'page':this.pageInfo.page,
        'assistid': this.mdRefId,
        'assType':this.assType, 
      }; 
      if (this.mdRefId) {
        this.getAssistODataByAPI(option,this.getCallBack,this.getCallError);
      }
    },
    getCallBack(res){ 
      console.log(res)
      var data = res.data;
      this.title = data.queryVal.slable;  
      if(data.code==1){
         
      }else{
        this.refData = [];
        this.pageInfo.total = 0;
        this.$notify.danger({content: data.message});
      }
    },
    getCallError(res){ 
      this.$notify.danger({content: res.data.message});
    },
  },
  watch:{ 
  },
 
};
</script>
