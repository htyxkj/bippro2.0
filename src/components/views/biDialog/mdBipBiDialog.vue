<template>
<div>
  <md-dialog ref="dialog" :md-click-outside-to-close="false" :md-esc-to-close="false">
      <!-- title -->
      <md-dialog-title> <div class="dia-title">{{btnInfo.name}}</div></md-dialog-title>
      <!-- content -->
      <md-dialog-content class="contentC"> 
          <md-layout v-if="ds_m !=null && ds_m.ccells !=null" >
            <md-bip-input :dsm="ds_m" v-for="cell in ds_m.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="ds_m.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout> 
      </md-dialog-content>
      <!-- action -->
      <md-dialog-actions class="actionC">
        <md-button class="md-raised btn " @click="closeDialog">取消</md-button>
        <md-button class="md-primary md-raised btn" @click="ok" >确定</md-button>
      </md-dialog-actions>
  </md-dialog> 

  <md-dialog ref="dialogMsg" :md-click-outside-to-close="false" :md-esc-to-close="false">
    <!-- title -->
    <md-dialog-title> <div class="dia-title">{{btnInfo.name}}</div></md-dialog-title>
    <!-- content -->
    <md-dialog-content class="contentC"> 
      <br/>
     　　　　 {{btnInfo.cellID}} 　　　　
      <br/>
    </md-dialog-content> 
    <md-dialog-actions class="actionC">
      <md-button class="md-raised btn " @click="closeDialog">取消</md-button>
      <md-button class="md-primary md-raised btn" @click="oksql">确定</md-button>
    </md-dialog-actions>
  </md-dialog> 

  <md-dialog ref="dialogMenu" :md-click-outside-to-close="false" :md-esc-to-close="false">
      <!-- title -->
      <md-dialog-title> <div class="dia-title">{{btnInfo.name}}</div></md-dialog-title>
      <!-- content -->
      <md-dialog-content class="contentC"> 
          <!-- <md-layout v-if="ds_m !=null && ds_m.ccells !=null" >
            <md-bip-input :dsm="ds_m" v-for="cell in ds_m.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="ds_m.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout>  -->
          <md-bip-bill-applet v-if="ds_m && ds_m.currRecord" :dsm="ds_m" :opera="opera" :mparams="mparams"></md-bip-bill-applet>
      </md-dialog-content>
      <!-- action -->
      <md-dialog-actions class="actionC">
        <md-button class="md-raised btn " @click="closeDialog">取消</md-button>
        <md-button class="md-primary md-raised btn" @click="okmenuid" >确定</md-button>
      </md-dialog-actions>
  </md-dialog>

</div>
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
      mparams:null,
    }
  },
  props: {
    getOpt:{
      type:Function,
    }, 
    btnInfo:null,  //{name:b[0],cellID:b[1],key:b[2]};
    selectData:null,  
    cdsm:null,
  },
  methods: {
    ok() {  
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
    oksql(){
      var jsonstr={};
      jsonstr = this.cdsm.currRecord; 
      var data1 = {
        "dbid": `${global.DBID}`,
        "usercode": JSON.parse(window.sessionStorage.getItem('user')).userCode,
        "apiId": "dlga", //cellparam pbuid=21243&pmenuid=22403 
        "jsonstr":JSON.stringify(jsonstr), 
        "btnInfo":JSON.stringify(this.btnInfo),
      };
      this.loading=1;
      let _this =this;
      var state=0;
      axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{  
          if(res.data.id==0){
            _this.$notify.success({content:'操作成功！'})
            _this.getOpt(1)
            _this.closeDialog()
          }else{
            _this.$notify.danger({content:'操作失败！'})
          }  
          _this.loading=0;
      }) .catch(err=>{
          console.log(err)
          _this.$notify.danger({content:'系统故障！'})
          _this.loading=0;
      })
    },
    okmenuid(){

    },
    closeDialog() {
      this.getOpt(0)
      this.$refs.dialog.close()
      this.$refs.dialogMsg.close() 
      this.$refs.dialogMenu.close()
    }, 
    async getCell(pcell) {
      if(pcell == null){
        pcell = this.btnInfo.cellID; 
      } 
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
    //获取菜单信息
    async getParams(menuId) {
      let pbuid = this.getPbuid(menuId,null);
      if(!pbuid){
        return false;
      }
      let data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_MPARAMS, 
        pbuid: pbuid,
        pmenuid: menuId
      };
      var res = await this.getDataByAPINewSync(data1);
      if (res.data.id == 0) {
        this.mparams = res.data.data.mparams;
      } else {
        this.$notify.warning({ content: "没有定义菜单参数" + pbuid + "!" });
        return false;
      }
      return true;
    },
    //根据菜单号获取菜单参数  并验证是否有该菜单的权限
    getPbuid(menuid,menu){ 
      if(menu == null)
        menu = JSON.parse(window.sessionStorage.getItem('menulist')); 
      for(var i=0;i<menu.length;i++){
        let one = menu[i];
        if(one.hhaveChild){
          return this.getPbuid(menuid,one.childMenu);
        }else{
          if(one.menuId == menuid){
            var command = one.command;//pbuid=800312&pmenuid=800312
            var cc = command.split("&");
            for(var j =0;j<cc.length;j++){
              let aa = cc[j];
              if(aa.indexOf("pbuid")!=-1){
                return aa.split("=")[1];
              }
            }
          }
        }
      }
    },
    //获取业务
    async getOpear(sbuid) {
      let data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: "buid",
        buid: sbuid
      }; 
      var bb = await this.getDataByAPINewSync(data1);
      if (bb.data.id == 0) { 
        this.opera = new Operation(bb.data.data.opt);
        return true;
      } else {
        this.opera = null;
        this.$notify.warning({ content: "没有" + sbuid + "业务号!" });
        return false;
      }
    },
  },
  created(){  
    
  },
  async mounted() { 
    console.log(this.btnInfo)
    this.ds_m = null;
    if(this.btnInfo.type =='B'){//根据对象
      await this.getCell(null);
      await this.initCellData();
      this.$refs.dialog.open();
    }else if(this.btnInfo.type =='A'){//执行SQL
      this.$refs.dialogMsg.open()
    }else if(this.btnInfo.type == 'C'){//根据菜单号
      if(await this.getParams(this.btnInfo.cellID) == false){
        this.$notify.warning({ content: "没有菜单权限！" + sbuid + "!" });
      }else{
        this.getCell(this.mparams.pcell)
        
        this.$refs.dialogMenu.open()
      }


    }
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
  /* position: absolute; */
  /* bottom: 0.2rem; 
  width: 100%; 
  margin: 0 auto; */
  padding: 0.24rem 0.24rem;
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
  /* margin-bottom: 0.9rem; */
  width: 100%;
  text-align: center;
  color: #919191;
  /* overflow: hidden; */
}
.btn{
  width: 1rem;
  margin: 0 auto;
}
</style>



