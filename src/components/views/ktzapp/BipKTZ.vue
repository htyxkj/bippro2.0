<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button :disabled="canCreate" @click.native="create">{{$t('commBtn.B_ADD')}}</md-button>
        <md-button class="md-accent" :disabled="canDelete" @click.native="delData">{{$t('commBtn.B_DEL')}}</md-button>
        <md-button @click.native="save" :disabled="canSave">{{$t('commBtn.B_SAVE')}}</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <!-- <md-button>审核</md-button> -->
        <md-button @click.native="submit" :disabled="canSubmit">{{getSH}}</md-button>
      </md-part-toolbar-group>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>{{$t('commLabel.L_AddM')}}</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
        <template>
          <md-content class="flex layout-column" v-if="dsm&&dsm.ccells!=null">
            <md-layout>
              <md-bip-input v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
            </md-layout>
            <md-layout class="flex layout-column" v-if="dsm.ds_sub&&dsm.ds_sub.length==1">
                <md-bip-grid :datas="dsm.ds_sub[0].cdata" ref="grid" :row-focused="true" :auto-load="true" @onAdd="onLineAdd(dsm.ds_sub[0])" @onRemove="onRemove" :showAdd="canAddChild" :showRemove="canAddChild" @rowChange="rowChange">
                  <md-bip-grid-column v-for="item in dsm.ds_sub[0].ccells.cels" :key="item.id" :label="item.labelString" :field="item.id" editable :hidden="!item.isShow" :refId="item.editName || item.refValue" :script="item.script" :attr="item.attr" :ccPoint="item.ccPoint" :refValue="item.refValue" :dataType="getDataType(item)" :formatter="formatter">
                  </md-bip-grid-column>
                </md-bip-grid>
            </md-layout>
          </md-content>
        </template>
        <template v-if="chkinfo">
          <md-bip-work  ref="cc" :chkinfo="chkinfo" @dataCheckUp="dataCheckUp"></md-bip-work>
        </template>

        <md-dialog ref="dialog" class="md-work-dialog" :md-click-outside-to-close="false" :md-esc-to-close="false">
          <md-toolbar>
            <h1 class="md-title">{{dialogTitle}}</h1>
                   <md-input-container class="md-flex bip-flex md-header-search">
        </md-input-container>
            <md-button class="md-icon-button" @click.native="diacancel()">
              <md-icon>close</md-icon>
            </md-button>
          </md-toolbar>
          <md-dialog-content class="flex layout-column" v-if="dsmSE !== null">
            <md-layout>
            <md-layout md-flex-xsmall="100" md-flex-small="33" md-flex-medium="20" md-flex-large="20">
              <md-input-container>
                <label>{{$t('ktz.f1')}}</label>
                <md-input v-model="f1"></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex-xsmall="100" md-flex-small="33" md-flex-medium="20" md-flex-large="20">
              <md-input-container>
                <label>{{$t('ktz.f2')}}</label>
                <md-input v-model="f2"></md-input>
              </md-input-container>
            </md-layout>
             <md-layout md-flex-xsmall="100" md-flex-small="33" md-flex-medium="20" md-flex-large="20">
              <md-input-container>
                <label>{{$t('ktz.f3')}}</label>
                <md-input v-model="f3"></md-input>
              </md-input-container>
            </md-layout>
             <md-layout md-flex-xsmall="100" md-flex-small="33" md-flex-medium="20" md-flex-large="20">
              <md-input-container>
                <label>{{$t('ktz.f7')}}</label>
                <md-input v-model="f7"></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex-xsmall="100" md-flex-small="33" md-flex-medium="20" md-flex-large="20">
              <md-button class="md-raised md-primary" @click="makeQuery">
                 <md-icon>search</md-icon>{{$t('commBtn.B_FIND')}}</md-button>
            </md-layout>
            </md-layout>
            <br/>
            <md-bip-grid :datas="dsmSE.cdata" ref="querygrid" :row-focused="true" :auto-load="true" @onAdd="onLineAdd()" @onRemove="onRemove">
              <md-bip-grid-column v-for="item in dsmSE.ccells.cels" :key="item.id" :label="item.labelString" :field="item.id" editable :hidden="!item.isShow" :refId="item.editName || item.refValue" :script="item.script" :attr="item.attr" :ccPoint="item.ccPoint" :refValue="item.refValue" :dataType="getDataType(item)" :formatter="formatter">
              </md-bip-grid-column>
            </md-bip-grid>
          </md-dialog-content>
          <md-dialog-actions>
            <md-button class="md-accent md-raised" @click="diacancel">{{$t('commInfo.cancel')}}</md-button>
            <md-button class="md-primary md-raised" @click="getSelectData">{{$t('commInfo.ok')}}</md-button> 
          </md-dialog-actions>
        </md-dialog>
    </md-part-body>
  </md-part>
</template>
<script>
import CDataSet from "../classes/CDataSet";
import CeaPars from "../classes/CeaPars";
import billS from "../classes/billState";
import Operation from "../operation/operation";
import moment from "moment";
export default {
  data() {
    return {
      dsm: null,
      chkinfo: null,
      opera: null,
      pcell: "5003(5003A)",
      dialogTitle: this.$t('cwork.title'),
      datas: [],
      f1: null,
      f2: null,
      f3: moment().format("YYYY-MM"),
      f7: null,
      dsmSE: null
    }
  },
  methods: {
    create() {
      // this.getCells();
      let state = this.dsm.currRecord.sys_stated & 1;
      if (state > 0) return;
      this.dsm.clearData();
      this.dsm.ds_sub[0].clearData();
      this.dsm.createRecord();
    },
    delData() {
      let state = this.dsm.currRecord.sys_stated & 1;
      if (state > 0) return;
      this.dsm.currRecord.sys_stated = 4;
      this.save();
    },
    async save() {
      let state = this.dsm.currRecord.sys_stated;
      var str = JSON.stringify(this.dsm.currRecord);
      console.log(str);
      var options = { pcell: this.pcell, jsonstr: str };
      var res = await this.saveData(options);
      // console.log(res);
      if (state === 4) {
        this.$notify.success({
          content: this.$t('commInfo.deleteSucc'),
          placement: "mid-center"
        });
        this.create();
        return;
      }
      let data = res.data.data;
      let _self = this;
      _.forEach(data, function(val, key) {
        // console.log(val, key);
        _self.$set(_self.dsm.currRecord, key, val);
      });
      // this.dsm.currRecord.sys_stated = billS.DICT;
      this.dsm.makeState(billS.DICT);
      this.$notify.success({ content: this.$t('commInfo.saveSucc'), placement: "mid-center" });
      if (this.opera || this.opera !== null) {
        await this.makeCheckParams();
      }
    },
    list() {},
    submit() {
      let crd = this.dsm.currRecord;
      if (this.opera) {
        let state = crd[this.opera.statefld];
        state = state == ''?'0':state;
        let params = {
          sid: crd[this.opera.pkfld],
          sbuid: crd[this.opera.buidfld],
          statefr: state,
          stateto: state,
          tousr: ""
        };
        let ceaParams = new CeaPars(params);
        let billuser = crd[this.opera.smakefld];
        // console.log(billuser);
        console.log(ceaParams,billuser);
        this.$refs["cc"].open(ceaParams, billuser);
      }
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

    async dataCheckUp(state) {
      this.dsm.currRecord[this.opera.statefld] = state;
      this.dsm.currRecord.sys_stated = billS.POSTED;
      await this.makeCheckParams();
    },
    async getCells() {
      let data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_CELLPARAMS,
        pcell: this.pcell
      };
      let res = await this.getDataByAPINewSync(data1);
      let data = res.data;
      if (data.id === 0) {
        let cells = data.data.layCels;
        let cells0 = cells[0];
        cells0 = await this.makeCellCL(cells0);
        this.dsm = new CDataSet(cells0);
        this.dsm.setPcell(this.pcell);
        // console.log(this.dsm);
      }
      if (this.dsm) {
        this.dsm.createRecord();
        this.dsm.canEdit = true;
        if (this.dsm.haveChild()) this.dsm.ds_sub[0].clearData();
        this.chkinfo = null;
      }
      let data2 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: "buid",
        buid: "5003"
      };
      var bb = await this.getDataByAPINewSync(data2);
      console.log(bb);
      if (bb.data.id == 0) this.opera = new Operation(bb.data.data.opt);
    },
    dataChange(data) {},
    onLineAdd() {
      this.makeQuery();
      this.$refs["dialog"].open();
    },
    rowChange() {},
    onRemove() {},

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
    formatter(value, data, column) {
      if (column.dataType === "numeric") {
        let pit = column.ccPoint;
        // console.log(value,typeof(value));
        const v = Number.parseFloat(value);
        // if (v !== 0) value = common.formatDecimal(value, { precision: pit });
        // else {
        //   value = "";
        // }
        // data[column.field] = value;
        return value;
      }
      return value;
    },
    diacancel() {
      this.$refs["dialog"].close();
    },
    async successLoad(res) {
      let data = res.data;
      // console.log(data);
      if (data.id === 0) {
        let cells = data.data.layCels;
        // let cells0 = cells[0];
        // cells0 = await this.makeCellCL(cells0);
        // console.log(cells0);
        this.dsmSE = new CDataSet(cells);
        this.dsmSE.setPcell("5003-E");
        // console.log(this.dsmSE);
        this.dsmSE.cdata = data.data.pages.celData;
      }
      // this.$refs['querygrid'].refresh();
    },
    makeQuery() {
      let qdata = {
        sid: "0+",
        f1: this.f1,
        f2: this.f2,
        f3: this.f3,
        f7: this.f7
      };
      let data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_CELLPARAM,
        pcell: "5003-E",
        pdata: JSON.stringify(qdata),
        bebill: 1,
        currentPage: 1,
        pageSize: 20,
        cellid: ""
      };
      this.getDataByAPINew(data1, this.successLoad);
    },
    getSelectData() {
      let selectRows = this.$refs["querygrid"].selectedRows;
      let cc = [];
      _.forEach(selectRows, key => {
        _.forEach(key, v => {
          cc.push(v);
        });
      });
      for (let i = 0; i < cc.length; i++) {
        let cr0 = cc[i];
        let ccr0 = this.dsm.ds_sub[0].createRecord();
        ccr0.sys_stated = 3;
        ccr0 = _.forEach(cr0, (key, v) => {
          if (v === "sid") {
            ccr0["slkid"] = key;
          } else {
            if (v !== "sys_stated") ccr0[v] = key;
          }
        });
        // ccr0.sys_stated = 3;
        // this.$set(ccr0,'slkid',cr0.sid);
      }
      this.$set(this.dsm.currRecord, "5003A", this.dsm.ds_sub[0].cdata);
      this.$refs["dialog"].close();
      // this.dsm.currentPage['5003A'] = this.dsm.ds_sub[0].cdata;
    }
  },
  created() {},
  mounted() {
    if (!this.dsm) this.getCells();
  },
  computed: {
    canCreate() {
      return false;
    },
    canDelete() {
      return false;
    },
    canSave() {
      return false;
    },
    canSubmit() {
      return false;
    },
    getSH() {
      return this.$t('commBtn.B_SUB');
    },
    canAddChild() {
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.md-toolbar .md-header-search {
  max-width: 100%;
}
.md-dialog-content {
  padding: 0 0;
  min-height: 3rem;
}

// .md-dialog{
//   min-height: 800px;
// }
</style>

