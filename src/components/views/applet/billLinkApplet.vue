<template>
<!-- <transition name="fade"> -->
  <div v-show="blink" >
    <md-sidenav class="md-right md-bill-i" ref="sbill" v-if="opera" @close="close" >  
        <!-- <div style="background-color: rgb(33, 150, 243);color: rgb(255, 255, 255);min-height: .6rem;padding: 0px;margin: 0px;text-align: center;line-height: .6rem;font-size: 0.18rem;">
          <div style="width:90%; display:inline">{{opera.pname}}</div>
          <div style="width:5%; display:inline;float: right;min-height: .6rem;line-height: .6rem"  @click="blink_close">
              <md-tooltip md-direction="left">关闭</md-tooltip>
              <md-icon>close</md-icon>       
          </div>
        </div>  -->

        <md-layout style="background-color: rgb(33, 150, 243);color: rgb(255, 255, 255);min-height: .55rem;padding: 0px;margin: 0px;line-height: .55rem;font-size: 0.18rem;">
          <md-layout md-flex="90" md-align="center" style="padding: 0px;margin: 0px;">{{opera.pname}}</md-layout>
          <md-layout md-flex="10" md-align="center" > 
            <md-button class="md-icon-button" @click="blink_close"  >
              <md-icon>close</md-icon>
            </md-button>  
          </md-layout>
        </md-layout> 
        <template v-if="isPC">
          <!-- <md-bip-bill-applet :dsm="ds_m" :dsext="ds_ext" :opera="opera" v-if="!blist" :mparams="mparams" @list="list"></md-bip-bill-applet> -->
          <md-bip-bill-applet v-if="ds_m && ds_m.currRecord && ds_m.currRecord[this.opera.pkfld]" :dsm="ds_m" :opera="opera" :mparams="mparams" :menuP="menuP"></md-bip-bill-applet>      
        </template>
        <template v-else> 
          <md-mobile-bill-info v-if="ds_m && ds_m.currRecord && ds_m.currRecord[this.opera.pkfld]" :dsm="ds_m" :opera="opera" :mparams="mparams" :menuP="menuP"></md-mobile-bill-info>
        </template> 
        <md-loading :loading="loading"></md-loading>
    </md-sidenav>
  </div>
<!-- </transition> -->
</template>
<script>
import CDataSet from "../classes/CDataSet";
import Operation from "../operation/operation";
import menuPattr from "../classes/menuPattr";
import BillState from '../classes/billState';
export default {
  data() {
    return {
      opera: {},
      menus: JSON.parse(window.sessionStorage.getItem("menulist")),
      mparams: null,
      ds_m: null,
      ds_ext: [],
      isPC: this.ISPC(),
      currMenu: {},
      sidv:'', 
      blink:false,
      loading:0,
      menuP:{},//顶部按钮权限
      sbuid:null,
    };
  },
  methods: {
    async open(sid, sbuid) {  
      if(this.sbuid != sbuid){ 
        this.ds_m=null;
        this.mparams=null;
        this.sbuid = sbuid;
      }
      this.loading++; 
      let bok = await this.checkOpear(sbuid); 
      // console.log(bok)
      if (bok) { 
        this.getMenuP();
        if(this.sidv !== sid ){
          this.sidv = sid; 
          await this.loadData();
        } 
          this.blink=true;
        this.$refs["sbill"].open(); 
      }  
      
      this.loading--;
    },
    async getParams(sbuid, menuId) {
      // console.log(sbuid,menuId)
      let data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_MPARAMS,
        pbuid: sbuid,
        pmenuid: menuId
      };
      var res = await this.getDataByAPINewSync(data1);
      if (res.data.id == 0) {
        this.mparams = res.data.data.mparams;
      } else {
        this.$notify.warning({ content: "没有定义菜单参数" + sbuid + "!" });
        return false;
      }
      return true;
    },
    async getCell() {
      var pcell = this.mparams.pcell;
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
    async checkOpear(sbuid) {
      if (!this.opera || this.opera.buid !== sbuid) {
        // console.log("远程调用getOpear");
        await this.getOpear(sbuid);
      }
      if (this.opera&&!this.opera.pmenuid) {
        this.$notify.warning({ content: "业务" + sbuid + "没有绑定菜单!" });
        return false;
      }
      let mm =this.getMenu(this.menus);
      // console.log(mm)
      if (!mm) {
        this.$notify.info({
          content: "没有" + this.opera.pmenuid + "菜单权限!"
        });
        return false;
      } else {
        this.currMenu = mm; 
        if (!this.mparams) {
          // console.log("远程调用mparams");
          let command =  mm.command;
          let cmmArr = command.split("&");
          let pbuId = "";
          for(var i=0;i<cmmArr.length;i++){
            let cmm = cmmArr[i]
            if(cmm.indexOf("pbuid")!=-1){
              console.log(cmm)
              pbuId = cmm.split("=")[1]
            }
          }
          let bok = await this.getParams(pbuId, mm.menuId);
          if (bok) {
            // console.log("远程调用getCell");
            return await this.getCell();
          } else {
            return bok;
          }
        }
        return true;
      }
    },
    async loadData(){
      if(this.ds_m == null)
        return; 
      //pdata={sid}
      let bb = {};
      let n = this.opera.purl.split('{');
      let n2 = n[1].split('}');
      let cc = 'aa'; 
      bb[n2[0]] = this.sidv 
      let count = bb;
      count = JSON.stringify(count);
      let data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_FINDCELLDATA,
        'pcell': this.ds_m.pcell,
        'pdata': count,
        'bebill':  1,
        'currentPage': 1,
        'pageSize': 10,
        'cellid': '',
        'celCondiction':'false',
      }
      var res = await this.getDataByAPINewSync(data1);
      // console.log(res,'21321321');
      if(res.data.id==0 ){
          let row = res.data.data.pages.celData[0];
          if(row){
            row.sys_stated = BillState.HISTORY;
            this.ds_m.currRecord = row;
            this.ds_m.addRow(row);
          }
      }
    },
    getMenu(menus){
      let mm;
      for (let i = 0; i < menus.length; i++) {
        let menu = menus[i];
        if (menu.menuId === this.opera.pmenuid) {
          mm = menu;
          break;
        }
        if(menu.haveChild){
          mm = this.getMenu(menu.childMenu);
          if(mm)
            break;
        }
      }
      return mm;
    },
    blink_close(){
      this.close();
    },
    close(){  
      this.blink=false;
      this.opera= null;
      if(this.ds_m){
        this.ds_m.clearData();
        this.ds_m.currRecord=null;
      }
      this.sidv='';
    },
    //顶部按钮权限！
    getMenuP(){
      // console.log("顶部按钮权限！").
      this.menuP = this.getMenuPermission(this.mparams); 
      this.menuP.LIST = false;
      this.menuP.COPY = false; 
    }
  }, 
};
</script>
<style  scope>
  /* .fade-enter-active, .fade-leave-active {
    transition: opacity 5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }  */
</style>
