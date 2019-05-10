<template>
  <md-part>
    <md-part-toolbar v-if="menuP">
      <md-part-toolbar-group>
        <md-button v-if="menuP.INSERT" :disabled="canCreate" @click.native="create">{{$t('commBtn.B_ADD')}}</md-button> <!--     -->
        <md-button v-if="menuP.DELETE" class="md-accent" :disabled="canDelete" @click.native="delData">{{$t('commBtn.B_DEL')}}</md-button>
        <md-button v-if="menuP.SAVE" @click.native="save" :disabled="canSave">{{$t('commBtn.B_SAVE')}}</md-button>
      <!-- </md-part-toolbar-group>
      <md-part-toolbar-group> -->
        <md-button v-if="menuP.LIST" @click.native="list">{{$t('commBtn.B_LIST')}}</md-button>
      <!-- </md-part-toolbar-group>
      <md-part-toolbar-group> -->
        <md-button v-if="menuP.COPY" @click="copy">{{$t('commBtn.B_COPY')}}</md-button>
        <!-- <md-button>审核 Auditing</md-button> -->
        <md-button @click.native="submit" :disabled="canSubmit">{{getSH}}</md-button>
      </md-part-toolbar-group>

      <md-part-toolbar-group v-if="flowlist.length>0">
        <md-menu>
          <md-button md-menu-trigger style="vertical-align: baseline">来源单据({{flowlist.length}})</md-button>
          <md-menu-content>
              <md-menu-item v-for="fls in flowlist" :key="fls.buidfr" @selected="cliclItem(fls)">{{fls.buidfrName}}--></md-menu-item>
          </md-menu-content>
        </md-menu>
      </md-part-toolbar-group> 
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>{{$t('commLabel.L_AddM')}}</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body> 
      <template v-if="dsm">
        <md-content class="flex layout-column" v-if="dsm&&dsm.ccells!=null">
          <!-- sass/components/mdInputContainer.scss .md-input-container { margin: .04rem .1rem .48rem 0;}-->
          <!-- style="height:auto;margin:0px;padding:0px"  -->
          <!-- <template v-if="inp.length > 0"> 
              <div v-for="(item,index) in inp" :key="index"> 
                <div v-for="(row,rowIn) in item" :key="rowIn" :style="getStyle(row[0].ccHorCell)" style="    margin: 0px;"> 
                  <md-bip-input :dsm="dsm" v-for="cell in row" :ref="cell.input.id" :key="cell.input.id" :cell="cell.input" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>                  
                </div> 
              </div> 
          </template>
          <template v-else> -->
          <!-- </template> -->
          <!-- </template> -->
          <md-layout v-if="isSelsth" > 
            <template v-if="mainTabs.length<=0">
              <md-layout class="flex"> 
                <md-bip-input :showsth="sth[cell.id]" :dsm="dsm" v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange" @changeShowSth="settingShowField"></md-bip-input>
              </md-layout>
            </template>
            <template v-else>
              <md-tabs class="md-transparent" style="min-height:max-content;">  
                <md-tab v-for="(item,index) in mainTabs" :md-label="item.name" :key="index"  style="padding:0px;">
                  <md-layout class="flex"> 
                    <md-bip-input :showsth="sth[cell.id]"  :dsm="dsm" v-for="(cell,index) in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange" v-if="item.start <= index && item.end >= index" @changeShowSth="settingShowField"></md-bip-input>
                  </md-layout>
                </md-tab>
              </md-tabs>
            </template> 
          </md-layout> 
          <md-tabs :md-dynamic-height=false class="flex" v-if="childrens&&childrens.length>=1&&istabs">
            <md-tab  style="padding:0px;display: -webkit-box; overflow:hidden;" v-for="(oneds,index) in childrens" :key="index" :id="oneds.id" :md-label="oneds.title">
              <md-layout class="flex" style="margin-top:2px;" >
                <md-bip-grid :dsm="dsm" :datas="oneds.data.cdata" ref="grid" :row-focused="true" :auto-load="true" @onAdd="onLineAdd(oneds.data)" @onRemove="onRemove" :showAdd="canAddChild" :showRemove="canAddChild"  @rowChange="rowChange" @click="rowClick(oneds.data)" :isEntry="isEntry(oneds.data)">
                  <md-bip-grid-column v-for="item in oneds.data.ccells.cels" :key="item.id" :label="item.labelString" :field="item.id" editable :hidden="!item.isShow" :refId="item.editName || item.refValue" :script="item.script" :attr="item.attr" :ccPoint="item.ccPoint" :refValue="item.refValue" :width="item.ccCharleng" :isReq="item.isReq" :editName="item.editName" :editType="item.editType" :assist="item.assist" :dataType="getDataType(item)" :objid="oneds.data.ccells.obj_id" :formatter="formatter"  :assType="item.assType">
                  </md-bip-grid-column>
                </md-bip-grid>
              </md-layout>
            </md-tab>
          </md-tabs> 
          <md-layout  v-else class="flex layout-column" v-for="(oneds,index) in dsm.ds_sub" :key="index" >
              <md-bip-grid :dsm="dsm" :datas="oneds.cdata" :ref="index" :row-focused="true" :auto-load="true" @onAdd="onLineAdd(oneds)" @onRemove="onRemove" :showAdd="canAddChild" :showRemove="canAddChild" @rowChange="rowChange" @click="rowClick(oneds)" :isEntry="isEntry(oneds)">
                <md-bip-grid-column v-for="item in oneds.ccells.cels" :key="item.id" :label="item.labelString" :field="item.id" editable :hidden="!item.isShow" :refId="item.editName || item.refValue" :script="item.script" :attr="item.attr" :ccPoint="item.ccPoint" :refValue="item.refValue" :width="item.ccCharleng" :isReq="item.isReq" :editName="item.editName" :editType="item.editType" :assist="item.assist" :dataType="getDataType(item)" :objid="oneds.ccells.obj_id" :formatter="formatter" :assType="item.assType">
                </md-bip-grid-column>
              </md-bip-grid>
          </md-layout> 
        </md-content>
      </template>
      <template v-if="chkinfo">
        <md-bip-work  ref="cc" :chkinfo="chkinfo" @dataCheckUp="dataCheckUp"></md-bip-work>
      </template>
      <md-work-copy-flow ref="cp" v-if="flowlist.length>0" @writeBack="writeBack"></md-work-copy-flow>
    </md-part-body>
  </md-part>
</template>

<script>
import CDataSet from "../classes/CDataSet";
import CeaPars from "../classes/CeaPars";
import billS from "../classes/billState";
import common from "../../core/utils/common.js";
export default {
  data() {
    return {
      curr_dsm: null,
      chkinfo: null,
      childrens:[],
      istabs:false,//是否是多子表
      flowlist:[], 
      inp:[],
      mainTabs:[],
      sth:{},
      isSelsth:false,  
    };
  },
  props: { dsm: Object, dsext: Array, opera: Object ,mparams:Object,menuP:Object},
  methods: {
    dataChange(res) { 
      this.dsm.checkEdit(res);
    },
    create() { 
      if (this.dsm) { 
        var crd = this.dsm.currRecord;
        if ((crd.sys_stated & billS.INSERT) > 0) {// ==1
          this.$dialog.open({
            title: "系统提示",
            showYes: true,
            showCancel: false,
            content: "请先保存，然后再新建单据"
          });
        } else {
          this.dsm.createRecord();
          this.dsm.canEdit = true;
          if(this.dsm.haveChild()){
            for(var i=0;i<this.dsm.ds_sub.length;i++){
              this.dsm.ds_sub[i].clearData();
            }
          }
          this.chkinfo = null;
        }
      }
    },
    list() {
      var crd = this.dsm.currRecord;
      if ((crd.sys_stated & billS.INSERT) > 0) {
        // var _self = this;
        // var bb = this.confirm('111');
        //var bb = this.$dialog.open({title:'系统提示',showYes:true,showCancel:true,content:'当前单据没有保存，是否保存？'});
        // console.log(bb);
      } else {
        this.$emit("list");
      }
      this.$emit("list");
    },
    async submit() {  
      var crd = this.dsm.currRecord; 
      if (this.opera) {
        var state = crd[this.opera.statefld];
        var params = {
          sid: crd[this.opera.pkfld],
          sbuid: crd[this.opera.buidfld],
          statefr: state,
          stateto: state,
          tousr: ""
        };
        var ceaParams = new CeaPars(params);
        var billuser = crd[this.opera.smakefld]; 
        this.$refs["cc"].open(ceaParams, billuser); 
      } 
    },
    async dataCheckUp(state) {
      this.dsm.currRecord[this.opera.statefld] = state;
      this.dsm.currRecord.sys_stated = billS.POSTED;
      await this.makeCheckParams();
    },
    async delData() {
      this.$dialog
        .confirm(this.$t('commInfo.confirmInf'), {
          okText: this.$t('commInfo.ok'),
          cancelText: this.$t('commInfo.cancel')
        })
        .then(() => {
          if ((this.dsm.currRecord.sys_stated & billS.INSERT) > 0) {
            return;
          }
          this.dsm.currRecord.sys_stated = 4;
          this.save();
        });
    },
    

    async save() { 
      if(this.dsm.ccells.subLayCells)
      for(var i = 0; i<this.dsm.ccells.subLayCells.length; i++){
        var aa = this.dsm.ccells.subLayCells[i];
        var bb = 0x10000;
        var cc = aa.attr&bb;
        if(cc>0){  
          this.dsm.currRecord[aa.obj_id]=[]; 
        }
      }
      let _oldPk = this.dsm.currRecord.oldpk;
      if(_oldPk){
        let pk = [];
        for(var i =0;i<this.dsm.ccells.pkindex.length;i++){
          let _i = this.dsm.ccells.pkindex[i];
          let cle = this.dsm.ccells.cels[_i];
          if(_oldPk[cle.id]){
            pk[i] =_oldPk[cle.id];
          }else{
            pk[i] = this.dsm.currRecord[cle.id];
          }
        } 
        this.dsm.currRecord.oldpk = pk;
      } 
      var str = JSON.stringify(this.dsm.currRecord);   
      if((this.dsm.currRecord&billS.DELETE)==0){
        var isnull = this.checkNotNull(this.dsm);
          if(!isnull)
            return;
      }
      var options = { pcell: this.dsm.pcell, jsonstr: str, opera:JSON.stringify(this.opera) };
      if(this.dsm.currRecord.sys_stated !=4){//保存前校验
        let check = await this.beforeSaveCheck(this.dsm);
        let issavet = 'false';
        if(check){
          if(check[0] == 'Dialog'){
            issavet =  await this.$dialog.confirm(check[1], {
              okText: this.$t('commInfo.ok'),
              cancelText: this.$t('commInfo.cancel')
            })
            .then(() => {
              return true;
            });
          }else if(check[0] == 'Notification'){
            this.$notify.danger({content:check[1]})
            issavet = check[2];
          }
        }else{
          issavet = 'true'
        }
        if(issavet == 'false'){
          return;
        } 
      }
      this.loading = 1;
      var res = await this.saveData(options);
      if (res.data.id == 0) {
        if (this.dsm.currRecord.sys_stated === 4) {
          this.$notify.success({ content: this.$t('commInfo.deleteSucc'), placement: "mid-center" });
          this.dsm.deleteRow(-1);
          this.dsm.createRecord();
          this.dsm.currRecord.sys_stated = 3;
          if (this.curr_dsm) {
            // console.log(this.curr_dsm);
            this.curr_dsm.clearData();
          }
        } else {
          var data = res.data.data;
          var _self = this;
          _.forEach(data, function(val, key) {
            // console.log(val, key);
            _self.$set(_self.dsm.currRecord, key, val);
          });
          // this.dsm.currRecord.sys_stated = billS.DICT;
          this.dsm.makeState(billS.DICT);
          this.$notify.success({ content: this.$t('commInfo.saveSucc'), placement: "mid-center" });

          if(this.opera && this.dsm.currRecord.sys_stated !=4){
            this.$dialog.confirm("是否提交此单据？", {
              okText: this.$t('commInfo.ok'),
              cancelText: this.$t('commInfo.cancel')
            })
            .then(() => { 
              this.submit(); 
            });
          }
        }
        if (this.opera || this.opera !== null) {
            await this.makeCheckParams();
        }

        return true;
      }else{
        console.log(res.data)
        this.$notify.danger({content:"保存失败："+res.data.message})
      }
      this.loading = 0;
      // }
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
      if (cds.haveChild()) {
        return this.checkChildNotNull(cds);
      }
      return true;
    },
    checkChildNotNull(cds) {
      var isok = true;
      _.forEach(cds.ds_sub, dssub => {
        if (dssub.cdata.length === 0 && !dssub.ccells.unNull) {
          isok = false;
          this.$notify.warning({
            content: "【" + dssub.ccells.desc + "】"+this.$t('commInfo.notNull')+"!",
            placement: "mid-center"
          });
          return;
        } else {
          _.forEach(dssub.cdata, (item,index) => {
            for (let i = 0; i < dssub.ccells.cels.length; i++) {
              var cell = dssub.ccells.cels[i];
              if (cell.unNull) {
                var vl = item[cell.id];
                if (!vl) {
                  this.$notify.warning({
                    content: this.$t('commInfo.No')+(index+1)+this.$t('commInfo.Line')+"【" + cell.labelString + "】"+this.$t('commInfo.notNull')+"!",
                    placement: "mid-center"
                  });
                  isok = false;
                  return;
                }
              }
              if(!isok)
                break ;
            }
            if(!isok)
              return ;
          });
        }
      });
      return isok;
    },
    async makeCheckParams() {
      if (this.opera === null) return;
      if(this.dsm.ccells.cels[this.dsm.ccells.pkindex[this.dsm.ccells.pkindex.length-1]+1].id != this.opera.buidfld) {
        return;
      }
      var crd = this.dsm.currRecord; 
      var params = {
        sid: crd[this.opera.pkfld],
        sbuid: crd[this.opera.buidfld],
        statefr: crd[this.opera.statefld],
        stateto: crd[this.opera.statefld],
        spuserId: ""
      };
      var ceaParams = new CeaPars(params);
      var res = await this.getCeaCheckInfo(ceaParams, 33);
      if (res.data.id == 0) {
        this.chkinfo = res.data.data.info;
      } else {
        this.chkinfo = null;
      }
      var state = crd[this.opera.statefld];
      if (state === "1" || state === "0") this.dsm.canEdit = true;
      // console.log(res, "fdfdsfds");
    },
    //判断字段类型
    getDataType(item) {  
      if (
        item.type == 91 ||
        item.type == 93 ||
        item.chkRule == "{DATE}" ||
        item.chkRule == "{DATETIME}"||
        item.chkRule == "{H_S}"
      ) {
        return "date";
      }
      if (item.assist || item.editName) {
        return "entity";
      }
      if (item.editType == 1) {
        return "enum";
      }
      if (item.type < 12) {
        return "numeric";
      }
      return "string";
    },
    onLineAdd(subdsm) { 
      this.curr_dsm = subdsm;
      var subId = subdsm.ccells.obj_id;
      if (!this.dsm.canEdit) return;
      var crd = subdsm.createRecord();
      // console.log(subdsm,subId,crd);
      if (!this.dsm.currRecord[subId]) {
        this.dsm.currRecord[subId] = [];
      }
      this.dsm.currRecord[subId] = subdsm.cdata;
    },
    onRemove(rows) {
      if (!this.dsm.canEdit) return;
      if(!this.curr_dsm)
        this.curr_dsm = this.dsm.ds_sub[0];
      _.forEach(rows.data, row => {
        this.curr_dsm.deleteRecord(row);
      });
      // console.log(rows);
    },
    rowClick(subdsm) {
      this.curr_dsm = subdsm;
      // console.log(this.curr_dsm);
    },
    rowChange(row) {
      // console.log("row Change", row);
      const state = this.dsm.currRecord.sys_stated;
      if (this.chkinfo) {
        if (this.chkinfo.state !== "0" && this.chkinfo.state !== "1") {
          return;
        }
      }
      this.dsm.currRecord.sys_stated = state | billS.EDITED;
    },
    formatter(value, data, column) {
      if (column.dataType === "numeric") {
        let pit = column.ccPoint;
        // console.log(value,typeof(value));
        const v = Number.parseFloat(value);
        if(v !== 0)
          value = common.formatDecimal(value, { precision: pit });
        else{
          value = '';
        }
        // data[column.field] = value;
        return value;
      }
      return value;
    },
    async getChildData(subdsm) {
      if (!subdsm) {
        return;
      }
      const objId = subdsm.ccells.obj_id;
      var pkcel = this.dsm.ccells.cels[this.dsm.ccells.pkid];
      var pkkey = pkcel.id;
      var count = {};
      count[pkkey] = this.dsm.currRecord[pkkey];
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
        cellid: objId
      };
      // console.log(data1, "findChild");
      var res = await this.getDataByAPINewSync(data1);
      // console.log(res);
      if(res.response)
        return;
        if (res.data.id === 0) {
          this.dsm.currRecord[objId] = res.data.data.pages.celData;
          subdsm.cdata = res.data.data.pages.celData;
        }
    },
    getWorlFlow(sbuid) {
      var data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: "workflow",
        buidto: sbuid
      };
      this.getDataByAPINew(data1, this.successBack);
    },
    successBack(res) {
      // console.log(res);
      let rtn = res.data;
      if (rtn.id == 0) {
        this.flowlist = rtn.data.flowlist;
      }
    },
    cliclItem(item) {
      this.$refs["cp"].openCopy(item);
    },
    writeBack(res){ 
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
    },
    //构成多子表标签数据
    constituteChildrens(playout){  
      if(playout){
        var indexT = playout.indexOf("T:");
        if(indexT>=0){
          this.istabs=true;
          var _aa = playout.indexOf(")");
          playout = playout.substring(indexT,_aa)
          _aa = playout.indexOf("(");
          playout = playout.substring(_aa+1,playout.length)
          var children = playout.split(";"); 
          for(var i=0;i<children.length;i++){
            var _chil =  children[i];
            var title = _chil.substring(_chil.indexOf("/")+2,_chil.length) 
            var beau 
            if(_chil.indexOf("#") !=-1){
              beau = _chil.substring(0,_chil.indexOf("#")) 
            }else {
              beau = _chil.substring(0,_chil.indexOf("/")) 
            } 
            for(var j=0;j<this.dsm.ds_sub.length;j++){
              var _ds_sub = this.dsm.ds_sub[j];
              if(_ds_sub.ccells.obj_id == beau){
                var id=title+''+i
                var _val = {id:id,title:title,data:_ds_sub}
                this.childrens.push(_val);
                break;
              }
            } 
          }  
        }  
      } 
      // console.log(this.childrens)
    },
    //计算宽度 
    calculationWidth() { 
      // console.log("计算宽度")
      if(this.dsm.ds_sub == null){
        return;
      }
      var width = document.body.clientWidth-83; 
      for(var j=0;j<this.dsm.ds_sub.length;j++){
        var _ds_sub = this.dsm.ds_sub[j];
        var sumLeng=0; 
        var positive=0;//正
        var negative=0;//负
        for(var i =0 ;i<_ds_sub.ccells.cels.length;i++){ 
          var cell = _ds_sub.ccells.cels[i];
          var aa = cell.ccCharleng+'';
          if(aa.indexOf("px")!=-1){
            return;
          }
          if(cell.isShow){ 
            if(cell.ccCharleng==0)
              cell.ccCharleng = 10
            if(cell.ccCharleng<0){
              negative+= Math.abs(cell.ccCharleng);
            }else{
              positive+= Math.abs(cell.ccCharleng);
            } 
          }
        }
        for(var i =0 ;i<_ds_sub.ccells.cels.length;i++){
          var cell = _ds_sub.ccells.cels[i];
          if(cell.isShow){
            var aa = cell.ccCharleng+''; 
            var fw=width-(positive*15)
            if(fw<=100){ 
              if(aa.indexOf("px")==-1)
                cell.ccCharleng = parseInt(Math.abs(cell.ccCharleng)* parseInt(15)) +''+'px'
            }else{
              if(aa.indexOf("px")==-1){
                if( cell.ccCharleng >0){
                  cell.ccCharleng = parseInt(Math.abs(cell.ccCharleng)* parseInt(15)) +''+'px'
                }else{
                  cell.ccCharleng = Math.abs(cell.ccCharleng)/negative*fw+''+'px';
                }
              }
            } 
          }
        }
      }      
    },  
    //判断表单是否是录入单据属性  输出 打勾 =false
    isEntry(data){ 
      var bb = 0x10000;
      var cc = data.ccells.attr&bb;
      if(cc>0){  
        return false;
      }else{
        return true;
      }
    },
    //复制拷贝当前单据
    copy(){
      // console.log("复制当前单据！")
      var currRecord = this.dsm.currRecord;
      if(currRecord.sys_stated ==3){
        this.$notify.warning({content: '请先保存当前数据！'});
        return;
      }
      currRecord.sys_stated=3; 
      let user = JSON.parse(window.sessionStorage.getItem('user'))
      for(var i=0;i<this.dsm.ccells.cels.length;i++){
        let cell = this.dsm.ccells.cels[i]
        if((cell.attr&0x8000)>0){
          let val_1 = cell.initValue;
          if(cell.initValue == '[$]'){
            val_1 = user.userCode;
          }else if(cell.initValue == '[#]'){
            val_1 = user.deptInfo.cmcCode;
          } 
          currRecord[cell.id] = val_1;
        } 
      }

      for(var i=0;i<this.dsm.ccells.pkindex.length;i++){
        var pkid = this.dsm.ccells.pkindex[i];
        var k = this.dsm.ccells.cels[pkid].id;
        currRecord[k]=this.dsm.ccells.cels[pkid].initValue;
      }
      this.dsm.cdata.push(currRecord)
      this.dsm.currRecord = currRecord; 
    },
    //计算多行
    getMulti_line(){
      let _dsm = this.dsm;
      var columnNum = 4;
      // let iput = [
      //   {width:2,title:"111111",row:1},{width:1,title:"22222",row:2},{width:1,title:"333333",row:1},{width:1,title:"444444",row:1},{width:1,title:"555555",row:1},{width:1,title:"666666",row:1},
      //   {width:1,title:"777777",row:2},{width:1,title:"888888",row:1},{width:1,title:"999999",row:1},{width:1,title:"101010",row:1},{width:1,title:"0000000",row:1},
      // ]; 
      //ccHorCell  宽度
      //ccVerCell  行数
      let iput = [];
      iput = _dsm.ccells.cels;

      let row=[];
      let j=0;
      let isRows = false;//上一个是否是多行
      for(var i=0;i<iput.length;i++){

        let one = iput[i]
        if(one.isShow == false){
          continue;
        }
        if(one.ccHorCell<=columnNum)
          one.ccHorCell = parseInt(one.ccHorCell*100/columnNum);
        j += one.ccHorCell;
        if(j==100){
          if(one.ccVerCell>1){
            var o = [{rows:true,input:one,ccHorCell:one.ccHorCell}];
            row.push(o);
            isRows = true;
          }else{
            if(isRows){
              var o = [{rows:false,input:one}];
              row.push(o);
            }else{
              if(row == [] || row.length ==0){
                var o = new Array(0)
                var b ={rows:false,input:one}; 
                o.push(b); 
                row.push(o);
              }else{
                var o = {rows:false,input:one};
                row[row.length-1].push(o);
              }
            }
            isRows = false;
          }
          for(var r=0;r<row.length;r++){
            if(row[r][0].rows ==false){
              let _r = row[r];
              let width=0;
              for(var _j=0;_j<_r.length;_j++){
                width += _r[_j].input.ccHorCell;
              }
              let _width=0;
              if(width!=100){
                while(width !=_width){
                  i++;
                  let _one =iput[i];
                  if(_one){
                    if(_one.ccHorCell<=columnNum)
                      _one.ccHorCell = parseInt(_one.ccHorCell*100/columnNum);
                    _width += _one.ccHorCell;
                    if(_width<=width){
                      let b = {rows:false,input:_one}; ;
                      row[r].push(b)
                    }else{
                      _width = width;
                      i--;
                    }
                  }else{
                    _width = width;
                  }
                }
              }else{
                _width = width;
              }
              for(var _j=0;_j<_r.length;_j++){
                row[r][_j].ccHorCell = _width;
              }
            }
          }
          // console.log(row)
          for(var l=0;l<row.length;l++){
            for(var p=0;p<row[l].length;p++){ 
              row[l][p].input.ccHorCell=parseInt( (row[l][p].input.ccHorCell/row[l][0].ccHorCell)*100)
            }
          }

          this.inp.push(row);
          row =[];
          j=0;
          isRows = false;//上一个是否是多行
        }else if(j<100){
  
          if(one.ccVerCell>1){
            var o = [{rows:true,input:one,ccHorCell:one.ccHorCell}];
            row.push(o);
            isRows = true;
          }else{
            if(isRows){
              var o = [{rows:false,input:one}];
              row.push(o);
            }else{ 
              if(row == [] || row.length ==0){
                var o = new Array(0)
                var b ={rows:false,input:one}; 
                o.push(b); 
                row.push(o);
              }else{
                var o = {rows:false,input:one};
                row[row.length-1].push(o);
              }
            }
            isRows = false; 
          }   

          if(i == iput.length -1 ){
            for(var r=0;r<row.length;r++){
              if(row[r][0].rows ==false){
                let _r = row[r];
                let width=0;
                for(var _j=0;_j<_r.length;_j++){
                  width += _r[_j].input.ccHorCell;
                }
                let _width=0;
                if(width!=100){
                  while(width !=_width){
                    i++;
                    let _one =iput[i];
                    if(_one){
                      if(_one.ccHorCell<=columnNum)
                        _one.ccHorCell = parseInt(_one.ccHorCell*100/columnNum);
                      _width += _one.ccHorCell;
                      if(_width<=width){
                        let b = {rows:false,input:_one}; ;
                        row[r].push(b)
                      }else{
                        _width = width;
                        i--;
                      }
                    }else{
                      _width = width;
                    }
                  }
                }else{
                  _width = width;
                }
                for(var _j=0;_j<_r.length;_j++){
                  row[r][_j].ccHorCell = _width;
                }
              }
            }
            // console.log(row)
            for(var l=0;l<row.length;l++){
              for(var p=0;p<row[l].length;p++){ 
                row[l][p].input.ccHorCell=parseInt( (row[l][p].input.ccHorCell/row[l][0].ccHorCell)*100)
              }
            }

            this.inp.push(row);
            row =[];
            j=0;
            isRows = false;//上一个是否是多行
          }
        }else if(j>100){
          if(one.ccHorCell<=columnNum)
            iput[i].ccHorCell = parseInt(one.ccHorCell/100*columnNum);
          i--;
          j=100; 
          for(var r=0;r<row.length;r++){
            if(row[r][0].rows ==false){
              let _r = row[r];
              let width=0;
              for(var _j=0;_j<_r.length;_j++){
                width += _r[_j].input.ccHorCell;
              }
              let _width=0;
              while(width !=_width){
                i++;
                let _one =iput[i];
                if(_one){
                  if(_one.ccHorCell<=columnNum)
                    _one.ccHorCell = parseInt( _one.ccHorCell*100/columnNum);
                  _width += _one.ccHorCell;
                  if(_width<=width){
                    let b = {rows:false,input:_one}; ;
                    row[r].push(b)
                  }else{
                    _width = width;
                    i--;
                  }
                }else{
                  _width = width;
                }
              }
              for(var _j=0;_j<_r.length;_j++){
                row[r][_j].ccHorCell = _width;
              }
            }
          }
          // console.log(row)
          for(var l=0;l<row.length;l++){
            for(var p=0;p<row[l].length;p++){ 
              row[l][p].input.ccHorCell=(row[l][p].input.ccHorCell/row[l][0].ccHorCell)*100
            }
          }

          this.inp.push(row);
          row =[];
          j=0;
          isRows = false;//上一个是否是多行
        }
      }
      console.log("循环完成")
      // console.log(this.inp);
    },
    getStyle(ccHorCell){
      return "float: left;width: "+ccHorCell+"%;"
    },
    //主表多页签
    creBookmark(playout){ 
      this.mainTabs = [];
      if(playout.indexOf("T:") !=-1){
        let one = playout.indexOf("(");
        let two = playout.lastIndexOf(")");
        playout = playout.substring(one+1,two);
        let tabs = playout.split(";");  
        for(var i =0;i<tabs.length;i++){
          let name = "";
          let start = 0;
          let end = 10000;
          let cellID = "";

          let tab = tabs[i].split("//");
          name = tab[1];
          let cell = tab[0];
          if(cell.indexOf("[") !=-1){
            let onezkh = cell.indexOf("[");
            let twozkh = cell.lastIndexOf("]");
            let khcont = cell.substring(onezkh+1,twozkh);
            cell = cell.substring(0,onezkh);
            let kh = khcont.split("~"); 
            if(kh[0].length>1){
              for(var j=0;j<this.dsm.ccells.cels.length;j++){
                if(kh[0] == this.dsm.ccells.cels[j].id){
                  start = j;
                }
              }
            }
            if(kh[1].length>1){
              for(var j=0;j<this.dsm.ccells.cels.length;j++){
                if(kh[1] == this.dsm.ccells.cels[j].id){
                  end = j;
                }
              }
            }
          } 
          if(cell.indexOf("#")!=-1){
            let aa = cell.split("#")[0];
            cellID = aa.substring(1,aa.length);
          }else{
            cellID = cell.substring(1,cell.length);
          }
          let t ={name:name,start:start,end:end,cellID:cellID}
          this.mainTabs.push(t);
        }
      }
    },
    //获取SWITCH开关 字段显示 隐藏信息
    async getSwitch() {
      this.sth={};
      var menuid = 'STH.' + this.dsm.ccells.obj_id;
      let me = window.sessionStorage.getItem(menuid);
      if (me == null) {
        var data1 = {
          dbid: global.DBID,
          usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
          apiId: global.APIID_DLG,
          menuid: menuid,
        };
        var res = await this.getDataByAPINewSync(data1);
        // console.log(res);
        //创建客户;100305;cbm 
        if (res.data.id != -1) {
          //A:sfxs;0:;1:dxlx,smzl,number,xzqy,dhqy,cjwh,dlname,zrdw,lxfs,xjnd,sftd,remark
          let d = res.data.data.btn;
          let sth00 = {};
          for(var i=0;i<d.length;d++){
            let v = d[i];
            let key = v.substring(0,1);
            v = v.substring(2).split(";");
            let showField = [];
            for(var j=1;j<v.length;j++){
              showField.push(v[j]);
            } 
            sth00 = { key:key,field:v[0],showField:showField}
          }
          this.sth[sth00.field] = sth00; 
          this.settingShowField(sth00.field);
          window.sessionStorage.setItem(menuid, JSON.stringify(this.sth));  
        }else{
          window.sessionStorage.setItem(menuid, 'noData');  
        }
        this.isSelsth=true;
      } else { 
        this.isSelsth=true;
        if(me == 'noData')
          return;
        this.sth = JSON.parse(me);
        for(var item in this.sth){
          this.settingShowField(item);
        } 
      } 
    },
    //设置显示隐藏字段
    settingShowField(key){
      let showsth = this.sth[key];
      let field = showsth.field;
      let value = this.dsm.currRecord[field];
      for(var i=0;i<showsth.showField.length;i++){
        let fv =  showsth.showField[i].split(":"); 
        let ff = fv[1];
        if(ff){
          let ff0 = ff.split(",");
          for(var dd = 0;dd<this.dsm.ccells.cels.length;dd++){
            if(this.isInArray(ff0,this.dsm.ccells.cels[dd].id)){ 
              if(fv[0] == value){
                this.dsm.ccells.cels[dd].isShow=true;
              }else{
                this.dsm.ccells.cels[dd].isShow=false;
              }
            }
          }
        }
      }
    },
    isInArray(arr,value){
      for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
          return true;
        }
      }
      return false;
    },
    doMyLayout(){
      this.mainTabs=[];
      this.childrens=[];
      let playout = this.mparams.playout;  
      let index = playout.indexOf(':') 
      if(index>0){ 
        let layType = playout.substring(0,index)
        if(layType === 'T'){
          this.creBookmark(playout)
        }else if( layType === 'B'){
          let str = playout.substring(index+1)
          str = str.substring(1,str.length-1)
          let cc = this.doLayout(str);
          if(cc.length>=1){
            this.creBookmark(cc[0])
          }
          if(cc.length>=2){
            this.constituteChildrens(cc[1])
          }
        }
      }
    }, 
  },
  computed: {
    canCreate() {
      if (this.dsm && this.dsm.currRecord != null) {
        if (
          (this.dsm.currRecord.sys_stated & billS.INSERT) > 0 ||
          (this.dsm.currRecord.sys_stated & billS.EDITED) > 0
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    canSave() { 
      if (this.dsm && this.dsm.currRecord != null) {
        if ((this.dsm.currRecord.sys_stated & billS.INSERT) > 0 ||(this.dsm.currRecord.sys_stated & billS.EDITED) > 0) {
          return false;
        }
        if ((this.dsm.currRecord.sys_stated & billS.POSTED) > 0) {
          return true;
        } 
        return true;
      } else {
        return true;
      }
    },
    canDelete() {
      if (this.opera) {
        var crd = this.dsm.currRecord;
        if (crd) {
          if ((crd.sys_stated & billS.INSERT) > 0) return true;
          const state = crd[this.opera.statefld];
          if (state == "0" || state == "1" || state == undefined) {
            return false;
          } else {
            return true;
          }
        }
      }
      if (this.dsm && this.dsm.currRecord != null) {
        if ((this.dsm.currRecord.sys_stated & billS.INSERT) > 0) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
    canSubmit() {  
      if (this.dsm && this.dsm.currRecord != null && this.chkinfo ) {  
        if (
          (this.dsm.currRecord.sys_stated & billS.INSERT) > 0 ||
          (this.dsm.currRecord.sys_stated & billS.EDITED) > 0
        ) {
          return true;
        }
        if (this.chkinfo) {
          // if(this.chkinfo.state=='6'){
          //   return true;
          // }else{
          //   return false;
          // }
        }
        return false;
      }
      return true;
    },
    getSH() {
      if (this.opera) {
        var crd = this.dsm.currRecord;
        if (crd) {
          var state = crd[this.opera.statefld];
          if (state === '0' || state === '1' || state === '5') {
            return this.$t('commBtn.B_SUB');
          } else {
            return this.$t('commBtn.B_CHK');
          }
        }
      }
      return this.$t('commBtn.B_SUB');
    },
    canAddChild(){ 
      if (this.opera) {
        var crd = this.dsm.currRecord;
        if (crd) {
          var state = crd[this.opera.statefld];
          state = state ===''?'0':state;
          if (state === '0' || state === '1' || state === undefined)  {
            return true;
          }
          return false;
        }
      }
      return true;
    }, 
  }, 
  async mounted() {   
    if (this.dsm) { 
      this.getSwitch();
      // this.getMulti_line();
      this.calculationWidth(); 
      this.doMyLayout(); 
      const state = this.dsm.currRecord.sys_stated &  billS.INSERT;
      if (this.dsm.ds_sub && state === 0) {
        for(var i =0;i<this.dsm.ds_sub.length;i++){
          this.getChildData(this.dsm.ds_sub[i]);
        }
        await this.makeCheckParams();
      } else if (this.dsm.ds_sub.length > 0) {
        for(var i =0;i<this.dsm.ds_sub.length;i++){
          this.dsm.ds_sub[i].clearData();
        }
      }
      if(this.opera)
      if(this.opera.buid){
        this.getWorlFlow(this.opera.buid);
      }
    }
  },
  watch: {
    chkinfo() {
      if (this.chkinfo) {
        if (this.chkinfo.state !== "0" && this.chkinfo.state !== "1") {
          this.dsm.canEdit = false; 
          if ((this.dsm.ccells.attr & billS.LSUPDATE) > 0 && this.chkinfo.state !== "6") {//临时改  
            console.log("临时改")
            this.dsm.canEdit = true;
          }
        }
      }
    },
    dsm(){ 
      if(this.dsm){
        this.dsm.createRecord();   
        this.calculationWidth();
        this.getSwitch();
      }
      this.doMyLayout();//主表多页签
      // this.getMulti_line();
    }
  }
};
</script>

<style scoped>  
.md-tab-header:focus {
 color: rgb(255, 0, 0);
}
.md-tab-header {
  color: rgba(255, 0, 0, 0.54);
}
.md-tabs-navigation {
  background-color: #ffffff;
  height: .36rem;
  min-height: .36rem;
} 
</style>


