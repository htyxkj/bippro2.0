<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button :disabled="canCreate" @click.native="create">{{$t('commBtn.B_ADD')}}</md-button>
        <md-button class="md-accent" :disabled="canDelete" @click.native="delData">{{$t('commBtn.B_DEL')}}</md-button>
        <md-button @click.native="save" :disabled="canSave">{{$t('commBtn.B_SAVE')}}</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="list">{{$t('commBtn.B_LIST')}}</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button>{{$t('commBtn.B_COPY')}}</md-button>
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
      <template v-if="dsm&&!dsm.haveChild">
        <md-content class="layout-fill" v-if="dsm&&dsm.ccells!=null">
          <md-layout>
            <md-bip-input :dsm="dsm" v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout>
        </md-content>
      </template>
      <template v-else>
        <md-content class="flex layout-column" v-if="dsm&&dsm.ccells!=null">
          <md-layout>
            <md-bip-input :dsm="dsm" v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
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
          <md-layout class="flex layout-column" v-for="(oneds,index) in dsm.ds_sub" :key="index"  v-if="dsm.ds_sub&&dsm.ds_sub.length>=1&&!istabs">
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
    };
  },
  props: { dsm: Object, dsext: Array, opera: Object ,mparams:Object},
  methods: {
    dataChange(res) {
      // console.log(res);
      // console.log(res, "dataChange");
      this.dsm.checkEdit(res);
    },
    create() {
      
      if (this.dsm) { 
        var crd = this.dsm.currRecord;
        if ((crd.sys_stated & billS.INSERT) > 0) {
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
        // console.log(billuser);
        this.$refs["cc"].open(ceaParams, billuser);
      }
      // var res = await this.getDataByAPINew(checkParasm);
      // console.log(res);
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
      console.log("asdfasdfasdfsadfasdf");
      if(this.dsm.ccells.subLayCells)
      for(var i = 0; i<this.dsm.ccells.subLayCells.length; i++){
        var aa = this.dsm.ccells.subLayCells[i];
        var bb = 0x10000;
        var cc = aa.attr&bb;
        if(cc>0){  
          this.dsm.currRecord[aa.obj_id]=[]; 
        }
      } 
      var str = JSON.stringify(this.dsm.currRecord);  
      if((this.dsm.currRecord&billS.DELETE)==0){
        var isnull = this.checkNotNull(this.dsm);
          if(!isnull)
            return;
      }
      this.loading = 1;
      var options = { pcell: this.dsm.pcell, jsonstr: str };
      var res = await this.saveData(options);
      if (res.data.id == 0) {
        // console.log(this.dsm.currRecord);
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
        }
        if (this.opera || this.opera !== null) {
          await this.makeCheckParams();
        }
        return true;
      }
      this.loading = 0;
      // }
    },
    checkNotNull(cds) {
      for (let i = 0; i < cds.ccells.cels.length; i++) {
        var item = cds.ccells.cels[i];
        // console.log(item);
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
      var crd = this.dsm.currRecord;
      // console.log(this.opera);
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
        this.chkinfo = {};
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
      console.log(res);
      if (res.data.id === 0) {
        this.dsm.currRecord[objId] = res.data.data.pages.celData;
        subdsm.cdata = res.data.data.pages.celData;
        // console.log(subdsm);
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
      console.log(res);
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
      console.log("Set 子表")
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
    constituteChildrens(){ 
      if(this.mparams.playout){
        var playout = this.mparams.playout;
        var indexT = playout.indexOf("T:");
        if(indexT>0){
          this.istabs=true;
          var _aa = playout.indexOf(")");
          playout = playout.substring(indexT,_aa)
          _aa = playout.indexOf("(");
          playout = playout.substring(_aa+1,playout.length)
          var children = playout.split(";"); 
          for(var i=0;i<children.length;i++){
            var _chil =  children[i];
            var title = _chil.substring(_chil.indexOf("/")+2,_chil.length) 
            var beau = _chil.substring(0,_chil.indexOf("#")) 
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
    } 
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
        if (
          (this.dsm.currRecord.sys_stated & billS.INSERT) > 0 ||
          (this.dsm.currRecord.sys_stated & billS.EDITED) > 0
        ) {
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
          if (state == "0" || state == "1") {
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
      if (this.dsm && this.dsm.currRecord != null) {  
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
          if (state === '0' || state === '1') {
            return true;
          }
          return false;
        }
      }
      return true;
    }, 
  },
  async mounted() { 
    // console.log("asfd")
    if (this.dsm) {   
      this.calculationWidth();
      this.constituteChildrens();
      const state = this.dsm.currRecord.sys_stated & billS.INSERT;
      if (this.dsm.ds_sub && state === 0) {
        for(var i =0;i<this.dsm.ds_sub.length;i++){
          this.getChildData(this.dsm.ds_sub[i]);
          await this.makeCheckParams();
        }
      } else if (this.dsm.ds_sub.length > 0) {
        for(var i =0;i<this.dsm.ds_sub.length;i++){
          this.dsm.ds_sub[i].clearData();
        }  
      }   
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
        }
      }
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


