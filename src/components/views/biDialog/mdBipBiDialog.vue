<template>
<div v-if="show">
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
 
  <md-dialog v-for="(pp,index) in prompt"  :key="index" :ref="'dialogMsg'+index" :md-click-outside-to-close="false" :md-esc-to-close="false">
    <!-- title -->
    <md-dialog-title> <div class="dia-title">{{btnInfo.name}}</div></md-dialog-title>
    <!-- content -->
    <md-dialog-content class="contentCMsg" :style="promptStyle[promptI]"> 
      <br/>{{prompt[promptI]}}<br/>
    </md-dialog-content> 
    <md-dialog-actions class="actionC">
      <md-button class="md-raised btn " @click="closeDialog">取消</md-button>
      <md-button class="md-primary md-raised btn" @click="oksql">确定</md-button>
    </md-dialog-actions>
  </md-dialog>    
  <div v-if="showMenu">
    <md-sidenav class="md-right md-bill-i" ref="sbillSidenav" @close="dialogClose" >  
      <md-layout style="background-color: rgb(33, 150, 243);color: rgb(255, 255, 255);min-height: .55rem;padding: 0px;margin: 0px;line-height: .55rem;font-size: 0.18rem;">
        <md-layout md-flex="90" md-align="center" style="padding: 0px;margin: 0px;">{{btnInfo.name}}</md-layout>
        <md-layout md-flex="10" md-align="center"> 
          <md-button class="md-icon-button" @click="dialogClose1">
            <md-icon>close</md-icon>
          </md-button>  
        </md-layout>
      </md-layout> 
      <template>
        <md-bip-bill-applet  v-if="ds_m && ds_m.currRecord" :dsm="ds_m" :opera="opera" :mparams="mparams" :menuP="menuP"></md-bip-bill-applet>
      </template>
      <md-loading :loading="loading"></md-loading>
    </md-sidenav>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import qs from 'qs'
import menuPattr from "../classes/menuPattr";
import CDataSet from "../classes/CDataSet";  
import Operation from "../operation/operation"; 
import BillState from '../classes/billState';
import common from '../../core/utils/common.js'; 
export default {
  data() {
    return {
      usrCode : JSON.parse(window.sessionStorage.getItem('user')).userCode ,
      cells:null, 
      ds_m:null,
      mparams:null,
      opera:null,
      contentCMenu:'contentCMenu',
      contentCMenuNoPC:'contentCMenuNoPC',
      menuP:{},//顶部按钮权限
      btnInfo:null,
      selectData:null,
      cdsm:null,
      getOpt:null,
      loading:0,
      showMenu:false,
      show:false,
      prompt:[],//A:提示语
      promptI:0,//当前提示语,
      promptStyle:[]//当前提示语样式
    }
  }, 
  methods: {
    async ok() {   
      this.loading=1; 
      let pcell = this.ds_m.pcell;
      var jsonstr={};
      jsonstr = this.ds_m.currRecord;
      jsonstr["sys_stated"]=2;//单据状态  
      var options = { pcell: pcell, jsonstr: JSON.stringify(jsonstr) };
      if((this.ds_m.currRecord&BillState.DELETE)==0){
        var isnull = this.checkNotNull(this.ds_m);
          if(!isnull)
            return;
      }
      var res = await this.saveData(options);
      if(res.data.id==0){
        this.$notify.success({content:'保存成功'})
        this.getOpt(1)
        this.closeDialog()
      }else{
        this.$notify.danger({content:'保存失败'})
      }  
      this.loading=0; 
    }, 
    oksql(){
      if(this.promptI != this.prompt.length-1){ 
        this.promptI++; 
        let dd = 'dialogMsg'+this.promptI;
        if(this.$refs[dd] instanceof Array){
          this.$refs[dd][0].open();
        }else{
          this.$refs[dd].open();
        } 
      }else{ 
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
              _this.$notify.danger({content:res.data.message})
              _this.getOpt(1)
              _this.closeDialog()
            }  
            _this.loading=0;
        }) .catch(err=>{
            console.log(err)
            _this.$notify.danger({content:'系统故障！'})
            _this.loading=0;
        }) 
      }
    },
    async okmenuid(){
      this.loading=1; 
      let pcell = this.ds_m.pcell;
      var jsonstr={};
      jsonstr = this.ds_m.currRecord;
      var options = { pcell: pcell, jsonstr: JSON.stringify(jsonstr) };
      var res = await this.saveData(options);
      if(res.data.id==0){
        this.$notify.success({content:'保存成功'})
        this.getOpt(1)
        this.closeDialog()
      }else{
        this.$notify.danger({content:'保存失败'})
      }  
      this.loading=0; 
    },
    dialogClose(){
      this.getOpt(1);
      this.showMenu=false;
    },
    dialogClose1(){
      this.getOpt(1);
      this.$refs.sbillSidenav.close();
      this.showMenu=false;
    },
    closeDialog() {
      this.showMenu=false;
      this.getOpt(0);
      this.$refs.dialog.close(); 
      for(var i=0;i<this.prompt.length;i++){
        let cc = 'dialogMsg'+i; 
        if(this.$refs[cc] instanceof Array){
          this.$refs[cc][0].close();
        }else{
          this.$refs[cc].close();
        }
      }
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
    //获取数据
    async initCellDataB(){
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
    async initCellDataC(){
      let cellID = this.btnInfo.cellID;
      let key = this.btnInfo.selKey;
      if(!key)
        return;
      let keyArr = key.split(",");
      //pdata
      let pdata = {};
      for(var i=0;i<keyArr.length;i++){
        let cc = keyArr[i].split("=")
        if(this.selectData[cc[1]]){
          pdata[cc[0]]=this.selectData[cc[1]];
        }else{
          pdata[cc[0]]=cc[1];
        }
      } 
      var data1 = {
        "dbid": `${global.DBID}`,
        "usercode": this.usrCode,
        "apiId": "findcelldata", //cellparam pbuid=21243&pmenuid=22403
        "pcell": this.btnInfo.key.split(",")[0].split("=")[1],
        "pdata": JSON.stringify(pdata),
      }; 
      let _this =this; 
      await axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
        if(res.data.id == 0){  
          if(res.data.data.pages.celData[0]){
            let cur = res.data.data.pages.celData[0];
            for(var cc in cur){
              _this.ds_m.currRecord[cc] = cur[cc];
            }
            _this.ds_m.currRecord.sys_stated = 512;
          }else{
            let dz = _this.btnInfo.key.split(",");
            if(dz.length>1){ 
              for(var i=1;i<dz.length;i++){
                let vv = dz[i].split("=");
                _this.ds_m.currRecord[vv[1]] = _this.selectData[vv[0]];
              }
            }
          }
        }else{
          let dz = _this.btnInfo.key.split(",");
          if(dz.length>1){ 
            for(var i=1;i<dz.length;i++){
              let vv = dz[i].split("=");
              _this.ds_m.currRecord[vv[1]] = _this.selectData[vv[0]];
            }
          }
        }
      }) .catch(err=>{
        console.log(err)
        _this.$notify.danger({content:'系统故障！'})
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
        if(one.haveChild){
          let pbuid0 =  this.getPbuid(menuid,one.childMenu);
          if(pbuid0){
            return pbuid0;
          }
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
    //顶部按钮权限！
    getMenuP(){
      // console.log("顶部按钮权限！")
      this.menuP = this.getMenuPermission(this.mparams); 
      this.menuP.LIST = false;
      this.menuP.COPY = false;    
    },
    async openREF(btn,selectData,ds_m,getOpt){
      this.show=true;
      this.cdsm = ds_m;
      this.getOpt = getOpt;
      this.btnInfo=btn;
      this.selectData = selectData;
      this.ds_m = null; 
      if(this.btnInfo.type =='B'){//根据对象
        await this.getCell(null);
        await this.initCellDataB();
        if(this.ds_m && this.ds_m.ccells &&this.ds_m.ccells.cels)
        for(var i=0;i<this.ds_m.ccells.cels.length;i++){
          let zz = this.ds_m.ccells.cels[i]; 
          if(zz.attr >= BillState.INITIALDATA){//二次初值
            if(zz.initValue){
              let initv = zz.initValue;
              if(zz.type == 93){
                initv = "[YMDHMS]";
              }
              this.ds_m.currRecord[zz.id] = this.formatVars(initv);
              this.ds_m.checkGS(this.ds_m.ccells.cels[i])
            }
          }
        }
        if(!this.$refs.dialog){
          setTimeout(() => {
            this.$refs.dialog.open();  
          }, 100);
        }else{
          this.$refs.dialog.open();  
        }
      }else if(this.btnInfo.type =='A'){//执行SQL 
        let pst = this.btnInfo.cellID.split(","); 
        for(var i=0;i<pst.length;i++){
          let onecont = pst[i].split("_style:");
          this.prompt[i] = (onecont[0]);
          if(onecont[1]){
            let style = onecont[1].replace("|",";")
            this.promptStyle[i] = style;
          }
        }
        this.promptI = 0;
        let cc = 'dialogMsg'+this.promptI; 
        console.log(cc);
        if(!this.$refs[cc]){
          setTimeout(() => { 
            if(this.$refs[cc] instanceof Array){
              this.$refs[cc][0].open();
            }else{
              this.$refs[cc].open();
            }
          }, 100);
        }else{
          if(this.$refs[cc] instanceof Array){
            this.$refs[cc][0].open();
          }else{
            this.$refs[cc].open();
          }  
        }
      }else if(this.btnInfo.type == 'C'){//根据菜单号 
        // this.showMenu = true;
        this.loading++;
        if(await this.getParams(this.btnInfo.cellID) == false){
          this.$notify.warning({ content: "没有菜单权限！" + this.btnInfo.cellID + "!" });
          this.closeDialog();
        }else{ 
          this.getOpear(this.mparams.pflow); 
          this.getMenuP();
          await  this.getCell(this.mparams.pcell);
          this.ds_m.createRecord(); 
          let cc = await this.initCellDataC(); 
          this.showMenu = true;
          if(!this.$refs.sbillSidenav){
            setTimeout(() => {
              this.$refs.sbillSidenav.open();  
            }, 100);
          }else{
            this.$refs.sbillSidenav.open();  
          }
        }
        this.loading--;
      }
    },
    formatVars(sinc) {
      sinc = sinc+'';
      var user = JSON.parse(window.sessionStorage.getItem('user'));
      var deptInfo = user.deptInfo;

      if(sinc == '[!]')
        return  deptInfo.deptCode;
      
      if(sinc == '[#]')
        return  deptInfo.cmcCode;
      
      if(sinc == '[$]')
        return  user.userCode;
      
      if(sinc == '[Y2M]')
        return  common.now('YYMM');
      
      if(sinc == '[YM]')
        return  common.now('YYYYMM');
      if(sinc == '[YMD]')
        return  common.now('YYYYMMDD'); 
      if(sinc == '[YMDHMS]') 
        return  common.now(); 
      // sinc = sinc.replace(/\[!\]/g, deptInfo.deptCode);
      // sinc = sinc.replace(/\[#\]/g, deptInfo.cmcCode);
      // sinc = sinc.replace(/\[$\]/g, user.userCode);
      // sinc = sinc.replace(/\[Y2M\]/g, common.now('YYMM'));
      // sinc = sinc.replace(/\[YM\]/g, common.now('YYYYMM'));
      // sinc = sinc.replace(/\[YMD\]/g, common.now('YYYYMMDD')); 
      return sinc;
    },
    checkNotNull(cds) { 
      let field = [];
      for(var item in this.sth){
        let vv = cds.currRecord[item]
        let cc = this.sth[item].showField;
        for(var i=0;i<cc.length;i++){
          let dd = cc[i].split(":");
          if(vv != dd[0]){
            let ff = dd[1].split(",");
            for(var it in ff){
              field.push(ff[it])
            }
          }
        }
      }
      for (let i = 0; i < cds.ccells.cels.length; i++) {
        var item = cds.ccells.cels[i]; 
        if(this.isInArray(field,item.id)){
        }else{
          if (item.unNull) {
            var vl = cds.currRecord[item.id];
            // console.log(vl,this.dsm.currRecord);
            if (!vl) {
              this.$notify.warning({
                content: "【" + item.labelString + "】"+this.$t('commInfo.notNull')+"!",
                placement: "mid-center"
              });
              return false;
            }
          }
        } 
      } 
      return true;
    },    
    isInArray(arr,value){
      for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
          return true;
        }
      }
      return false;
    },
  },
  created(){  
    
  },
  async mounted() {  
    
  },
  watch:{
  }
}
</script>

<style scoped lang="scss">
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
.contentCMsg{
  width: 100%;
  text-align: center;
  color: #919191;
}
.contentCMenu{
  min-width: 10rem;
}
.contentCMenuNoPC{
  min-width: 100%;
  min-height: 100%;
}
.contentC {
  width: 100%;
}
.btn{
  width: 1rem;
  margin: 0 auto;
}
.mydialog{
  width: 100%;
} 

</style>



