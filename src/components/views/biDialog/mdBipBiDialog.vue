<template>
  <md-dialog ref="dialog" :md-click-outside-to-close="false" :md-esc-to-close="false">
      <!-- title -->
      <md-dialog-title> <div class="dia-title">{{btnInfo.name}}</div></md-dialog-title>
      <!-- content -->
      <md-dialog-content class="contentC">
        <!-- <md-content class="layout-fill"> -->
          <md-layout v-if="ds_m !=null && ds_m.ccells !=null" >
            <md-bip-input :dsm="ds_m" v-for="cell in ds_m.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="ds_m.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout>
        <!-- </md-content> -->
      </md-dialog-content>
      <!-- action -->
      <md-dialog-actions class="actionC">
        <md-button class="md-primary md-raised" @click="ok">确定</md-button>
        <md-button class="md-raised" @click="closeDialog">取消</md-button>
      </md-dialog-actions>
  </md-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import qs from 'qs'
import CDataSet from "../classes/CDataSet"; 
export default {
  data() {
    return {
      usrCode : JSON.parse(window.sessionStorage.getItem('user')).userCode ,
      cells:null, 
      ds_m:null,
    }
  },
  props: {
    getOpt:{
      type:Function,
    }, 
    btnInfo:null,  //{name:b[0],cellID:b[1],key:b[2]};
    selectData:null,  
  },
  methods: {
    ok() { 
      console.log(this.ds_m);
      let pcell = this.btnInfo.cellID
      var jsonstr={};
      jsonstr = this.ds_m.currRecord;
      jsonstr["sys_stated"]=2;//单据状态 
      var data1 = {
        "dbid": `${global.DBID}`,
        "usercode": JSON.parse(window.sessionStorage.getItem('user')).userCode,
        "apiId": "savedata", //cellparam pbuid=21243&pmenuid=22403
        "pcell": pcell,
        "jsonstr":JSON.stringify(jsonstr),
        "datatype":1
      };
      this.loading=1;
      let _this =this;
      var state=0;
      axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
        console.log(res.data)
          if(res.data.id==0){
            _this.$notify.success({content:'保存成功'})
            _this.getOpt(1)
            _this.closeDialog()
          }else{
            _this.$notify.danger({content:'保存失败'})
          }  
          _this.loading=0;
      }) .catch(err=>{
          console.log(err)
          _this.$notify.danger({content:'系统故障！'})
          _this.loading=0;
      })  
    }, 
    closeDialog() {
      this.getOpt(0)
      this.$refs.dialog.close()
    }, 
    async getCell() {
      var pcell = this.btnInfo.cellID; 
      var data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_CELLPARAMS,
        pcell: pcell
      };
      var res = await this.getDataByAPINewSync(data1);
      var data = res.data;
      if (data.id === 0) {
        var cells = data.data.layCels;
        const celL = cells.length;
        if (celL == 1) {
          var cells0 = cells[0];
          cells0 = await this.makeCellCL(cells0);
          this.ds_m = new CDataSet(cells0);
          this.ds_m.setPcell(pcell);
        } else {
          var cells0 = await this.makeCellCL(cells[0]);
          this.ds_m = new CDataSet(cells0);
          this.ds_m.setPcell(pcell);
          for (var i = 0; i < celL - 2; i++) {
            var cellsi = await this.makeCellCL(cells[i + 1]);
            var ds = new CDataSet(cellsi);
            this.ds_ext[i] = ds;
          }
        }
        return true;
      }
      return false;
    },
    async initCellData(){
      let cellID = this.btnInfo.cellID;
      let key = this.btnInfo.key;
      let keyArr = key.split("\\|");
      //pdata
      let pdata = {};
      for(var i=0;i<keyArr.length;i++){
        pdata[keyArr[i]]=this.selectData[keyArr[i]];
      } 
      var data1 = {
        "dbid": `${global.DBID}`,
        "usercode": this.usrCode,
        "apiId": "findcelldata", //cellparam pbuid=21243&pmenuid=22403
        "pcell": cellID,
        "pdata": JSON.stringify(pdata),
      }; 
      this.loading=1;
      let _this =this; 
      await axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
        console.log(res);
        if(res.data.id == 0){  
          _this.ds_m.currRecord = res.data.data.pages.celData[0];
        } 
        _this.loading=0;
      }) .catch(err=>{
        console.log(err)
        _this.$notify.danger({content:'系统故障！'})
        _this.loading=0;
      })
    },
    dataChange(pars) {
    },
  },
  created(){  
    
  },
  async mounted() { 
    this.ds_m = null;
    await this.getCell();
    await this.initCellData();
    this.$refs.dialog.open()
    
  },
  watch:{ 
  }
}
</script>

<style scoped>
.md-dialog{
  max-height: 100%;
}
.classA {
  min-height: 6.5rem;
  max-width: 9.5rem;
  max-height: 9.5rem;
  min-width: 6.5rem;
}
.actionC {
  position: absolute;
  bottom: 0.1rem;
  right: 0.1rem;
}
.dia-title {
  width: auto;
  text-align: center;
}
.content-area {
  color: #48576a;
  font-size: 14px;
}
.c-areapc {
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
}   
.contentC {
  margin-bottom: 0.7rem;
  /* overflow: hidden; */
}
</style>



