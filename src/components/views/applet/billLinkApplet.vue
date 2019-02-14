<template>
<!-- <transition name="fade"> -->
  <div v-show="blink" >
    <md-sidenav class="md-right md-bill-i" ref="sbill" v-if="opera" @close="close" >  
        <div style="background-color: rgb(33, 150, 243);color: rgb(255, 255, 255);min-height: .6rem;padding: 0px;margin: 0px;text-align: center;line-height: .6rem;font-size: 0.18rem;">
          <div style="width:90%; display:inline">{{opera.pname}}</div>
          <div style="width:5%; display:inline;float: right;min-height: .6rem;line-height: .6rem"  @click="blink_close">
              <md-tooltip md-direction="left">关闭</md-tooltip>
              <md-icon>close</md-icon>       
          </div>
        </div> 
        <template v-if="isPC">
          <!-- <md-bip-bill-applet :dsm="ds_m" :dsext="ds_ext" :opera="opera" v-if="!blist" :mparams="mparams" @list="list"></md-bip-bill-applet> -->
          <md-bip-bill-applet v-if="ds_m && ds_m.currRecord && ds_m.currRecord[this.opera.pkfld]" :dsm="ds_m" :opera="opera" :mparams="mparams" :menuP="menuP"></md-bip-bill-applet>
        </template>
        <!-- <template v-else> 
        </template>--> 
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
    };
  },
  methods: {
    async open(sid, sbuid) {  
      this.loading++; 
      let bok = await this.checkOpear(sbuid); 
      console.log(bok)
      if (bok) { 
        this.getMenuP();
        if(this.sidv !== sid ){
          this.sidv = sid;
          console.log('获取数据',sid);
          await this.loadData();
        } 
          this.blink=true;
        this.$refs["sbill"].open(); 
      }  
      
      this.loading--;
    },
    async getParams(sbuid, menuId) {
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
      console.log(bb)
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
        console.log("远程调用getOpear");
        await this.getOpear(sbuid);
      }
      if (!this.opera.pmenuid) {
        this.$notify.warning({ content: "业务" + sbuid + "没有绑定菜单!" });
        return false;
      }
      let mm =this.getMenu(this.menus);
      console.log(mm)
      if (!mm) {
        this.$notify.info({
          content: "没有" + this.opera.pmenuid + "菜单权限!"
        });
        return false;
      } else {
        this.currMenu = mm; 
        if (!this.mparams) {
          console.log("远程调用mparams");
          let bok = await this.getParams(sbuid, mm.menuId);
          if (bok) {
            console.log("远程调用getCell");
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
      console.log(this.opera.purl);
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
      if(res.data.id==0){
          let row = res.data.data.pages.celData[0];
          row.sys_stated = BillState.HISTORY;
          console.log(res.data.data.pages.celData);
          this.ds_m.currRecord = row;
          this.ds_m.addRow(row);
          console.log(this.ds_m); 
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
      this.ds_m.clearData();
      this.ds_m.currRecord=null;
      this.sidv='';
    },
    //顶部按钮权限！
    getMenuP(){
      // console.log("顶部按钮权限！")
      this.menuP.INSERT=false;
      // console.log(menuPattr)
      // console.log(this.mparams.pattr & menuPattr.INSERT)
      if((this.mparams.pattr & menuPattr.INSERT)>0){
        this.menuP.INSERT=true;
      }
      this.menuP.DELETE=false;      
      if((this.mparams.pattr & menuPattr.DELETE)>0){
        this.menuP.DELETE=true;
      }
      this.menuP.SAVE=false;      
      if((this.mparams.pattr & menuPattr.SAVE)>0){
        this.menuP.SAVE=true;
      }  
      this.menuP.FILE=false;      
      if((this.mparams.pattr & menuPattr.FILE)>0){
        this.menuP.FILE=true;
      }  
      this.menuP.COUNT=false; 
      if((this.mparams.pattr & menuPattr.COUNT)>0){
        this.menuP.COUNT=true;
      }  
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
