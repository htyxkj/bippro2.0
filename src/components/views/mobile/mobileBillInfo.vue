<template>
  <md-part>
    <md-part-toolbar  v-if="menuP">
      <md-part-toolbar-group>
        <md-button v-if="menuP.INSERT" :disabled="canCreate" @click.native="create">{{$t('commBtn.B_ADD')}}</md-button>
        <md-button v-if="menuP.DELETE" class="md-accent" :disabled="canDelete" @click.native="delData">{{$t('commBtn.B_DEL')}}</md-button>
        <md-button v-if="menuP.SAVE"@click.native="save" :disabled="canSave">{{$t('commBtn.B_SAVE')}}</md-button>

        <md-button v-if="menuP.LIST" @click.native="list">{{$t('commBtn.B_LIST')}}</md-button>

        <md-button v-if="menuP.COPY">{{$t('commBtn.B_COPY')}}</md-button>
        <!-- <md-button>审核</md-button> -->
        <template v-if="(mparams.pattr & 0x100) >0">
          <md-button @click.native="submit" :disabled="canSubmit">{{getSH}}</md-button>
          <md-button @click.native="submitProcess" :disabled="canSubmit">{{$t('commBtn.B_SubmitProcess')}}</md-button>
        </template>
      </md-part-toolbar-group>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>{{$t('commLabel.L_AddM')}}</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <template v-if="dsm&&dsm.ds_sub.length==0">
        <md-content class="layout-fill" v-if="dsm&&dsm.ccells!=null && isSelsth">
          <!-- <md-layout>
            <md-bip-input  :dsm="dsm" v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout> -->
          <template v-if="mainTabs.length<=0">
            <md-layout> 
              <md-bip-input :showsth="sth"  :dsm="dsm" v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange" @changeShowSth="settingShowField"></md-bip-input>
            </md-layout>
          </template>
          <template v-else>
            <md-tabs class="md-transparent"  md-fixed>  
              <md-tab v-for="(item,index) in mainTabs" :md-label="item.name" :key="index">
                <md-layout> 
                  <md-bip-input :showsth="sth"  :dsm="dsm" v-for="(cell,index) in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange" v-if="item.start <= index && item.end >= index" @changeShowSth="settingShowField"></md-bip-input>
                </md-layout>
              </md-tab>
            </md-tabs>
          </template>
        </md-content>
      </template>
      <template v-if="dsm&&dsm.ds_sub.length>0">
        <md-content class="flex layout-column" v-if="dsm&&dsm.ccells!=null">
          <md-stepper md-vertical  @completed="finish">
            <md-step id="step1" :md-label="dsm.ccells.desc" :mdButtonContinue="$t('commBtn.child.next')" :mdButtonBack="$t('commBtn.child.back')" :mdButtonFinish="$t('commBtn.child.finish')" :mdEditable="true">
              <md-layout>
                <!-- <md-bip-input v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input> -->
                <md-bip-input :dsm="dsm" v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
              </md-layout>
            </md-step>
            <md-step id="step2" :md-label="$t('commBtn.child.title')" :mdButtonContinue="$t('commBtn.child.next')" :mdButtonBack="$t('commBtn.child.back')" :mdButtonFinish="$t('commBtn.child.finish')" :mdEditable="true">
              <div>
                <ul class="childHjList" v-if="dsm.ds_sub[0].cdata && dsm.ds_sub[0].cdata.length">
                  <template  v-for="(cell,index) in dsm.ccells.cels">
                    <li :key="index" v-if="(cell.attr&0x200)>0 && (cell.attr&0x2000)>0">
                      {{cell.labelString}} : {{dsm.currRecord[cell.id]}}
                    </li>
                  </template>
                </ul>
                <md-list>
                  <md-list-item v-for="(dj,djIndex) in dsm.ds_sub[0].cdata" :key="djIndex" @click.stop="itemClick(dsm.ds_sub[0],djIndex)">
                    <!-- 删除 -->
                     <md-button class="md-icon-button md-list-action" @click="deleteDj(dsm.ds_sub[0],djIndex)" :disabled="!canEditChild">
                      <md-icon class="md-accent">close</md-icon>
                      <md-tooltip md-direction="top">{{$t('commBtn.child.delLine')}}</md-tooltip>
                    </md-button>
                    <!-- <md-icon>list</md-icon> -->
                    <h5>{{$t('commInfo.No')}} {{djIndex+1}} {{$t('commInfo.Line')}}</h5>
                    <md-list-expand ref="expand">
                      <md-list>
                        <md-layout class="flex layout-column">
                            <md-layout>
                              <md-bip-input :dsm="dsm" v-for="item in dsm.ds_sub[0].ccells.cels" :ref="item.id" :key="item.id" :cell="item" :modal="dj" :btj="false" class="bip-input" @change="childChange"></md-bip-input>
                            </md-layout>
                        </md-layout>
                      </md-list>
                    </md-list-expand>
                </md-list-item>
                </md-list>
                <md-button class=" md-raised md-primary" @click="addDj(dsm.ds_sub[0])" :disabled="!canEditChild">
                  {{$t('commBtn.child.addLine')}}
                </md-button>
                <md-button class=" md-raised md-accent" @click="deleteAll(dsm.ds_sub[0])" :disabled="!canEditChild">
                  {{$t('commBtn.child.delAll')}}
                </md-button>
              </div>
              </md-step>
            <!-- <md-step id="step3" md-label="单据提交" mdButtonContinue="下一步" mdButtonBack="返回" mdButtonFinish="完成" :mdEditable="true">
               <h2 class="md-title">确认提交单据？</h2>
            </md-step> -->
          </md-stepper>
        </md-content>
      </template>
      <template v-if="chkinfo">
        <md-bip-work  ref="cc" :chkinfo="chkinfo" @dataCheckUp="dataCheckUp"></md-bip-work>
        <md-bip-work-process  ref="SubmitProcess" :chkinfo="chkinfo" @dataCheckUp="dataCheckUp"></md-bip-work-process>
      </template>
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
      mainTabs:[],
      sth:{},
      isSelsth:false,
    };
  },
  props: { dsm: Object, dsext: Array, opera: Object, mparams:Object,menuP:Object},
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
          if(this.dsm.haveChild())
            this.dsm.ds_sub[0].clearData();
          this.chkinfo = null;
        }
      }
    },
    list() {
      var crd = this.dsm.currRecord;
      if ((crd.sys_stated & billS.INSERT) > 0) {
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
        let cont = await this.submitCont();
        ceaParams.content = cont;
        this.$refs["cc"].open(ceaParams, billuser);
      }
      // var res = await this.getDataByAPINew(checkParasm);
      // console.log(res);
    },
    //推送微信钉钉审批消息  拼接审批内容
    async submitCont(){
      let cont = "";
      let pbds = this.mparams.pbds;
      if(pbds.indexOf("CONT=") >-1){
        pbds = pbds.substring(pbds.indexOf("CONT="),pbds.length);
        pbds = pbds.split("&")[0];
        pbds = pbds.substring(pbds.indexOf("\"")+1,pbds.lastIndexOf("\"")).split(",");
        for(var i=0;i<pbds.length;i++){
          let cellID = pbds[i];
          let cell = this.dsm.getCell(cellID);
          let dataV = this.dsm.currRecord[cell.id];
          try{
            if(cell.refValue){
              let ref = window.sessionStorage.getItem(cell.refValue+"."+dataV);
              if(ref != null){
                ref = JSON.parse(ref);
                dataV = ref.value[ref.allCols[1]]
              }else{
                let ref = window.sessionStorage.getItem(cell.refValue);
                ref = JSON.parse(ref);
                if(ref != null && ref.values){
                  let values = ref.values;
                  if(values)
                  for(var j = 0;j<values.length;j++){
                    if(values[j][ref.allCols[0]] == dataV){
                      dataV = values[j][ref.allCols[1]];
                    }
                  }
                }else{
                  let count = dataV;
                  let script = "";
                  let assType = cell.assType;
                  let assid = cell.refValue.replace("{&","{")
                  var  posParams = {
                    'dbid': global.DBID,
                    'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
                    'apiId': global.APIID_AIDO,
                    'assistid': assid,
                    'cont':count,
                    'script':script,
                    'assType':assType,
                  }
                  let refServ = await this.getDataByAPINewSync(posParams);
                  if(refServ.data.code ==1){
                    let values = refServ.data.values;
                    for(var j = 0;j<values.length;j++){
                      if(values[j][refServ.data.allCols[0]] == dataV){
                        dataV = values[j][refServ.data.allCols[1]];
                        let sessData= {allCols:refServ.data.allCols,value:{}};
                        sessData.value[refServ.data.allCols[0]] = values[j][refServ.data.allCols[0]];
                        sessData.value[refServ.data.allCols[1]] = values[j][refServ.data.allCols[1]];
                        window.sessionStorage.setItem(cell.refValue,JSON.stringify(sessData));
                      }
                    }
                  }
                }
              }
            }
          }catch(e){
            dataV = this.dsm.currRecord[cell.id];
          }
          cont+=cell.labelString+":"+dataV +"|||";
        }
      }
      console.log(cont)
      return cont;
    },
    submitProcess(){
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
        this.$refs["SubmitProcess"].open(ceaParams, billuser); 
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
            // alert("新建");
            return;
          }
          this.dsm.currRecord.sys_stated = 4;
          this.save();
        });
    },
    async save() { 
      var str = JSON.stringify(this.dsm.currRecord);
      if(this.dsm.currRecord.sys_stated !=4){
        if((this.dsm.currRecord&billS.DELETE)==0){
          var isnull = this.checkNotNull(this.dsm);
            if(!isnull)
              return;
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
      if(this.dsm.currRecord.sys_stated !=4){
        let check = await this.beforeSaveCheck(this.dsm);

        let issavet = 'false';
        if(check){
          if(check[0] == 'Dialog'){
            issavet =  await this.$dialog.confirm(check[1], {
              okText: this.$t('commInfo.ok'),
              cancelText: this.$t('commInfo.cancel')
            })
            .then(() => {
              return 'true';
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
      // var options = { pcell: this.dsm.pcell, jsonstr: str };
      var options = { pcell: this.dsm.pcell, jsonstr: str, opera:JSON.stringify(this.opera) };
      var res = await this.saveData(options);
      if (res.data.id == 0) {
        if (this.dsm.currRecord.sys_stated === 4) {
          this.$notify.success({ content: this.$t('commInfo.deleteSucc'), placement: "mid-center" });
          this.dsm.deleteRow(-1);
          this.dsm.createRecord();
          this.dsm.currRecord.sys_stated = 3;
          if (this.curr_dsm) {
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
        // console.log(item);
        if(this.isInArray(field,item.id)){
        }else{        
          if (item.unNull) {
            var vl = cds.currRecord[item.id];
            // console.log(vl,this.dsm.currRecord);
            if (!vl) {
              this.$notify.warning({
                content: "【" + item.labelString + "】"+this.$t('commInfo.notNull')+"！",
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
                    content: this.$t('commInfo.No')+(index+1)+this.$t('commInfo.Line')+"【" + cell.labelString + "】"+this.$t('commInfo.notNull')+"！",
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
    onRemove(row) {
      if (!this.dsm.canEdit) return;
        this.curr_dsm.deleteRecord(row);
      // console.log(rows);
    },
        //step2 添加子单据
    addDj(subdsm) {
      // console.log(subdsm)
      this.curr_dsm = subdsm;
      var subId = subdsm.ccells.obj_id;
      var crd = subdsm.createRecord();
      if (!this.dsm.currRecord[subId]) {
        this.dsm.currRecord[subId] = [];
      }
      //currRecord
      // console.log(subdsm.cdata);
      this.dsm.currRecord[subId] = subdsm.cdata;
      this.$nextTick(() => {
        // console.log(this.$refs.expand)
        var _index = this.$refs.expand.length-1
        subdsm.currRecord = subdsm.cdata[_index]
        for(var i = 0;i<_index;i++){
          this.$refs.expand[i].$parent.active = false
        }
        this.$refs.expand[_index].$parent.active = true
      });
      const state = this.dsm.currRecord.sys_stated ;
      this.dsm.currRecord.sys_stated = state | billS.EDITED;
      
    },
        //删除所有子单据
    deleteAll(subdsm){
      subdsm.clearData();
      this.dsm.currRecord.sys_stated = this.dsm.currRecord.sys_stated|billS.REPLACESUB;
    },
        //删除某行单据
    deleteDj(subdsm,index){
      this.itemClick(subdsm,index);
      this.curr_dsm = subdsm;
      this.onRemove(index);
      var _len = this.curr_dsm.cdata.length;
      if(_len>0){
        this.$refs.expand[_len-1].$parent.active = true
      }
      // console.log(this.curr_dsm);
    },
    finish(){
      if((this.dsm.currRecord.sys_stated&billS.EDITED)>0){
        this.save();
      }
    },
    //子表数据发生变化 将合计值合计到主表上
    smSub(){
      if(this.dsm.ds_sub && this.dsm.ds_sub.length>0){
        for(var i =0 ;i<this.dsm.ds_sub.length;i++){
          let child = this.dsm.ds_sub[i];
          let hjK = [];
          for(var j=0;j<child.ccells.cels.length;j++){
            let cel = child.ccells.cels[j];
            if((cel.attr & 0x2000 )>0){
              hjK.push(cel.id);
            }
          }
          for(var z=0;z<hjK.length;z++){
            let key = hjK[z];
            let hjz = new Number(0);
            if(child.cdata.length>0){
              for(var j=0;j<child.cdata.length;j++){
                let data = child.cdata[j];
                let v0 = new Number(data[key]);
                if (isNaN(v0)) {
                  v0 = 0;
                }
                hjz = hjz + v0;
              }
              this.dsm.currRecord[key] = hjz;
            }
          }
        }
      }
      console.log(this.dsm)
    },
    childChange(res){
      this.curr_dsm.checkEdit(res);
      if(this.curr_dsm.canEdit){
        this.smSub()
      }
      this.dsm.currRecord.sys_stated = this.dsm.currRecord.sys_stated | billS.EDITED;
    },
    //listitem 点击step2 单据
    itemClick(subdsm,index){
      //当前点击行号
      this.curr_dsm = subdsm;
      subdsm.currRecord = subdsm.cdata[index];
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
        pageSize: 20,
        cellid: objId
      };
      var res = await this.getDataByAPINewSync(data1);
      if (res.data.id === 0) {
       var data = res.data.data.pages.celData;
        var ccdata = _.take(data,data.length);
        for(let i=0;i<ccdata.length;i++){
          var crd = ccdata[i];
          crd.sys_stated = billS.DICT;
          ccdata[i] = crd;
        }
        this.dsm.currRecord[objId] = ccdata;
        subdsm.cdata = ccdata;
        this.curr_dsm = subdsm;
      }
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
            cellID = cell.substring(1,aa.length);
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
        let str = playout.substring(index+1)
        str = str.substring(1,str.length-1)
        let cc = this.doLayout(str);
        if(cc.length>=1){
          this.creBookmark(cc[0])
        }
        // if(cc.length>=2){
        //   this.constituteChildrens(cc[1])
        // }
      }
    }

  },
  computed: {
    canEditChild(){
      if (this.opera) {
        var crd = this.dsm.currRecord;
        if (crd) {
          var state = crd[this.opera.statefld];
          if (state === '0' || state === '1') {
            return true;
          }
          return false;
        }
      }
      return true;
    },
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
          if (state === '0' || state === '1') {
            return true;
          }
          return true;
        }
      }
      return false;
    },

  }, 
  async mounted() {
    console.log("mounted")
    if (this.dsm) {
      this.getSwitch();
      this.doMyLayout();
      this.dsm.runSui();
      const state = this.dsm.currRecord.sys_stated & billS.INSERT;
      if(state === 0)
      await this.makeCheckParams();
      if (this.dsm.ds_sub && state === 0 && this.dsm.ds_sub.length>0) {
        if(this.dsm.ds_sub[0].cdata.length ==0 )
        this.getChildData(this.dsm.ds_sub[0]);
      } else if (this.dsm.ds_sub.length > 0) {
        if(!this.dsm.currRecord.noClear)
        this.dsm.ds_sub[0].clearData();
      }
    }
  },
  watch: {
    chkinfo() {
      if (this.chkinfo) {
        if (this.chkinfo.state !== "0" && this.chkinfo.state !== "1") {
          this.dsm.canEdit = false;
        }
        if ((this.dsm.ccells.attr & billS.LSUPDATE) > 0 && this.chkinfo.state !== "6") {//临时改  
          console.log("临时改")
          this.dsm.canEdit = true;
        }
      }
    },
    dsm(){
      if(this.dsm){
        this.dsm.createRecord(); 
        this.getSwitch();
      }
      this.doMyLayout();
    }
  }
};
</script>

<style lang="scss" scoped>
.md-layout{margin: 0;}
.childHjList{
  margin: 0px;
  padding: 0px;
  li{list-style-type:none;}  
}
</style>


