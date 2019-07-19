<template>
  <md-dialog ref="dialog"  class="md-refs-dialog">
      <md-toolbar> 
        <md-layout md-gutter md-flex="100" md-row> 
          <md-layout md-flex-xsmall="90" :md-flex="true" style=" margin-top: .12rem;">
            <h1 class="md-title">{{title}}</h1> 
          </md-layout> 
          <md-layout md-flex-xsmall="10" md-flex-small="10" md-flex-medium="10" md-flex-large="10" >
            <md-button class="md-icon-button" @click.native="close()">
              <md-icon>close</md-icon>
            </md-button>   
          </md-layout>
        </md-layout> 
      </md-toolbar>
      <md-dialog-content class="no-padding"> 
        <md-content class="flex layout-column">
          <md-layout v-if="dscont&&dscont.ccells!=null&&showDscont" style="margin-bottom:10px">
            <md-bip-input v-for="cell in dscont.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dscont.currRecord"
            :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout>
          <md-layout class="flex">
            <md-table-card>
              <md-table @select="onTableSelect" class="flex">
                <md-table-header>
                  <md-table-row v-if="dsm">
                    <md-table-head v-for="(item) in dsm.ccells.cels" :key="item.id" v-if="item.isShow" :md-numeric="item.type===3">{{item.labelString}}</md-table-head>
                  </md-table-row>
                </md-table-header>
                <md-table-body v-if="dsm">
                  <md-table-row v-if="dsm.cdata.length==0">
                    <md-layout>
                      <md-content>
                        <md-button class="md-fab md-fab-center-center">
                          <md-icon>verified_user</md-icon>
                        </md-button>
                        <span class="md-fab-center-center">{{$t('commInfo.noDatas')}}</span>
                      </md-content>
                    </md-layout>
                  </md-table-row>
                  <md-table-row v-else :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in dsm.cdata" :key="rowIndex"
                  :md-item="row" :md-auto-select="mdAutoSelect" :md-selection="mdSelection">
                    <md-table-cell v-for="(column, columnIndex) in dsm.ccells.cels" :key="columnIndex" v-if="column.isShow"
                    :md-numeric="column.type<12" :class="numRed(row[column.id],column) ? 'md-num-red':''">
                      <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type === 3" :modal="row" :row="row"></md-bip-ref>
                    </md-table-cell>
                  </md-table-row>  
                </md-table-body>
              </md-table>
              <md-table-tool>
                <md-layout class="flex"></md-layout>
                <md-table-pagination :md-size="pageInfo.size" :md-total="pageInfo.total" :md-page="pageInfo.page" :md-label="$t('commInfo.Per')"
                md-separator="/" :md-page-options="[5,10,15,20, 30, 50]" @pagination="onTablePagination">
                </md-table-pagination>
              </md-table-tool>
              <md-table-card v-show="false">
                <md-table class="flex" v-if="dssub">
                  <md-table-header>
                    <md-table-row v-if="dssub">
                      <md-table-head v-for="(item) in dssub.ccells.cels" :key="item.id" v-if="item.isShow" :md-numeric="item.type===3">{{item.labelString}}</md-table-head>
                    </md-table-row>
                  </md-table-header>
                  <md-table-body v-if="dssub">
                    <md-table-row v-if="dssub.cdata.length==0">
                      <md-layout>
                        <md-content>
                          <md-button class="md-fab md-fab-center-center">
                            <md-icon>verified_user</md-icon>
                          </md-button>
                          <span class="md-fab-center-center">{{$t('commInfo.noDatas')}}</span>
                        </md-content>
                      </md-layout>
                    </md-table-row>
                    <md-table-row v-else :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in dssub.cdata"
                    :key="rowIndex" :md-item="row" :md-auto-select="mdAutoSelect" :md-selection="mdSelection">
                      <md-table-cell v-for="(column, columnIndex) in dssub.ccells.cels" :key="columnIndex" v-if="column.isShow"
                      :md-numeric="column.type<12" :class="numRed(row[column.id],column) ? 'md-num-red':''">
                        <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type === 3" :modal="row"></md-bip-ref>
                      </md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table>
              </md-table-card>
            </md-table-card>
          </md-layout>
        </md-content>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-raised md-primary" @click="selectOK">确定</md-button>
        <md-button class="md-raised md-primary" @click="refresh">刷新</md-button>
        <md-button class="md-raised md-accent" @click="close">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
</template>

<script>
import qs from 'qs'
import axios from 'axios'
import CDataSet from "../../classes/CDataSet";
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
      default:'5'
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
    disabled:{
      type:Boolean,
      default:false
    },
    assType:null,//辅助类型 
    cds:{
      type:Object,
      default:null
    }
  },
  data(){
    return{ 
      pageInfo:{
          size:this.mdPageSize,
          total:0,
          page:1
      },
      title:"",
      dscont:null,
      dsm:null,
      dssub:null, 
      selectData:null,
      cpsparam:null,
      mdAutoSelect: true,
      cpinf:[],
      mdSelection:false,
      showDscont:false,
    } 
  },
  mounted(){ 

  },
  methods:{ 
    selectOK() { 
      if (this.selectData) {
        if(this.mdSelection){
          this.cpinf[0].cdata = this.selectData;
        }else{
          let robj = this.dsm.currRecord;        
          this.cpinf[0].cdata = robj;
          if(this.dssub){
            let cldata = this.dssub.cdata;
            if(this.dssub.cdata.length>0)
              this.cpinf[1].cdata = cldata;
          }
        }
        // console.log(this.cpinf)
        this.$emit('writeBack',this.cpinf); 
        this.close();
      } else {
        this.$notify.warning({
          content: "没有选择任何数据!",
          placement: "mid-center"
        });
      } 
    },
    refresh() {
      this.pageInfo.page = 1;
      this.featchData();
    },
    close() {
      this.$refs["dialog"].close();
    },
    dataChange(pars) {
      // console.log(pars);
      this.featchData();
    },
    async open(){ 
      this.showDscont=false;
      this.selectData = null;
      this.dsm = null;
      await this.doQuery();
      //初始化条件
      this.initDscont();
      this.$refs['dialog'].open();
      this.showDscont=true;
      await this.featchData(); 
      this.initCPInf();
    }, 
    async doQuery(){
      var option={
        'pageSize': this.pageInfo.size,
        'page':this.pageInfo.page,
        'assistid': this.mdRefId,
        'assType':this.assType, 
      }; 
      if (this.mdRefId) {
        await this.getAssistODataByAPI(option,this.getCallBack,this.getCallError);
      }
    },
    getCallBack(res){  
      var data = res.data;
      data = JSON.stringify(data);
      data = JSON.parse(data);
      this.cpsparam = data;
      this.title = data.title;  
      if(data.code==1){
        this.dscont = null;
        this.dscont = new CDataSet(data.cells[0]);
        this.dsm = new CDataSet(data.cells[1]);
        this.dsm.cdata = [];
        this.dsm.pcell = data.pcell;
        if(data.cells[1].subLayCells){
          this.dssub = new CDataSet(data.cells[1].subLayCells[0]);
          this.dssub.cdata = [];
        }
      }else{
        this.refData = [];
        this.pageInfo.total = 0;
        this.$notify.danger({content: data.message});
      }
      if((this.dsm.ccells.attr & 0x40 )>0)
        this.mdSelection = true;
    },
    getCallError(res){ 
      this.$notify.danger({content: "出错了！"});
    },
    onTableSelect(item) {
      // console.log(item);
      if(this.mdSelection){
        this.selectData = [];
        this.selectData = item;
      }else{
        this.selectData = Object.values(item)[0]; 
        this.dsm.currRecord = this.selectData;
      }
      // console.log(this.selectData)
      if (this.selectData && this.dssub) this.getChildData(Object.values(item)[0]);
    },
    onTablePagination(pager) {
      this.pageInfo.page = pager.page;
      this.pageInfo.size = pager.size;
      this.featchData();
    },
    async featchData() { 
      var pdata = JSON.stringify(this.dscont.currRecord);
      var data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_FINDCELLDATA,
        pcell: this.cpsparam.pcell,
        pdata: pdata,
        bebill: 0,
        currentPage: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        cellid: ""
      };

      let res = await this.getDataByAPINewSync(data1);

      // console.log(res);
      if (res.data.id == 0) {
        // console.log(11)
        this.pageInfo.total = res.data.data.pages.totalItem;
        if (this.dsm.cdata.length > 0) {
          this.dsm.clearData();
          if(this.dssub)
          this.dssub.clearData();
        }
        this.dsm.cdata = res.data.data.pages.celData;
        // _.forEach(res.data.data.pages.celData, row => {
        //   // row.sys_stated = BillState.HISTORY;
        //   this.dsm.addRow(row);
        //   // console.log(row)
        // });
      }
    },
    setRowColor(_index) {
      _index = _index % 2;
      if (_index !== 0) {
        return true;
      }
      return false;
    },
    numRed(vals, cell) {
      if (cell.type === 3 && vals < 0) return true;
      return false;
    },
    async getChildData(row) {
      if (!row) return;
      let key = this.dsm.ccells.pkid;
      let id = this.dsm.ccells.cels[key].id;
      var count = {};
      count[id] = row[id];
      count = JSON.stringify(count);
      var data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_FINDCELLDATA,
        pcell: this.dsm.pcell,
        pdata: count,
        bebill: 1,
        currentPage: 1,
        pageSize: 99999,
        cellid: this.dssub.ccells.obj_id
      }; 
      var res = await this.getDataByAPINewSync(data1);
      if (res.data.id == 0) {
        if (this.dssub.cdata.length > 0) {
          this.dssub.clearData();
        }
        _.forEach(res.data.data.pages.celData, row => {
          // row.sys_stated = BillState.HISTORY;
          this.dssub.addRow(row);
          // console.log(row)
        });
      }
    },
    initCPInf(){
      let scopys = this.cpsparam.scopys;
      let cpinf1 = [];
      _.forEach(scopys,function(item){
        let keys = [];
        let inf = {};
        if(item.smap){
          let nn = item.smap.split(',');
          _.forEach(nn,function(key){
            let mm = key.split('/');
            let key1 = {keyf:mm[0],keyt:mm[1]};
            keys.push(key1);
          });
        }
        inf['kft'] = keys;
        cpinf1.push(inf);
      });
      this.cpinf = cpinf1;
    }, 
    initDscont(){  
      let cels = this.dscont.ccells.cels;
      for(var i =0;i<cels.length;i++){
        let cel = cels[i]
        if(cel.script){
          let scr = cel.script.split("*");
          let dd = this.cds.getDataSet(scr[0])
          if(dd)
          this.dscont.currRecord[cel.id] = dd.currRecord[scr[1]]
        }
      }
    }

  },
  watch:{ 
  },
 
};
</script>
