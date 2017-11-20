<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button :disabled="canCreate" @click.native="create">新建</md-button>
        <md-button class="md-accent" :disabled="canDelete" @click.native="delData">删除</md-button>
        <md-button @click.native="save" :disabled="canSave">保存</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="list">列表</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button>复制</md-button>
        <!-- <md-button>审核</md-button> -->
        <md-button>提交</md-button>
      </md-part-toolbar-group>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>新增/修改</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <template v-if="dsm&&!dsm.haveChild">
        <md-content class="layout-fill" v-if="dsm&&dsm.ccells!=null">
          <md-layout>
            <md-bip-input v-for="(cell, index) in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout>
        </md-content>
      </template>
      <template v-else>
        <md-content class="flex layout-column" v-if="dsm&&dsm.ccells!=null">
          <md-layout>
            <md-bip-input v-for="(cell, index) in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout>
          <md-layout class="flex layout-column" v-if="dsm.ds_sub&&dsm.ds_sub.length==1">
              <md-bip-grid :datas="dsm.ds_sub[0].cdata" ref="grid" :row-focused="false" :auto-load="true" @onAdd="onLineAdd(dsm.ds_sub[0])" @onRemove="onRemove" :showAdd="true" :showRemove="true" @rowChange="rowChange" @click="rowClick(dsm.ds_sub[0])">
                <md-bip-grid-column v-for="(item,itemIndex) in dsm.ds_sub[0].ccells.cels" :key="item.id" :label="item.labelString" :field="item.id" editable :hidden="!item.isShow" :refId="item.editName||item.refValue" :script="item.script" :attr="item.attr" :ccPoint="item.ccPoint" :dataType="getDataType(item)" :formatter="formatter">
                </md-bip-grid-column>
              </md-bip-grid>
          </md-layout>
        </md-content>
      </template>

    </md-part-body>
  </md-part>
</template>

<script>
import CDataSet from "../classes/CDataSet";
import billS from "../bill/billState";
import common from "../../core/utils/common.js";
export default {
  data(){
    return {
      curr_dsm:Object
    }
  },
  props: { dsm: Object, dsext: Array, opera: Object },
  methods: {
    dataChange(res) {
      // console.log(res);
      console.log(res, "dataChange");
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
    async delData() {
      this.$dialog
        .confirm("确定删除吗？", {
          okText: "确定",
          cancelText: "取消"
        })
        .then(() => {
          this.dsm.currRecord.sys_stated = 4;
          this.save();
        });
    },
    async save() {
      var str = JSON.stringify(this.dsm.currRecord);
      // var isnull = this.checkNotNull();
      // if(!isnull){
      this.loading = 1;
      var options = { pcell: this.dsm.pcell, jsonstr: str };
      var res = await this.saveData(options);
      if (res.data.id == 0) {
        console.log(this.dsm.currRecord);
        if (this.dsm.currRecord.sys_stated === 4) {
          this.$notify.success({ content: "删除成功！", placement: "mid-center" });
          this.dsm.deleteRow(-1);
          this.dsm.createRecord();
          this.dsm.currRecord.sys_stated = 3;
        } else {
          var data = res.data.data;
          var _self = this;
          _.forEach(data, function(val, key) {
            // console.log(val, key);
            _self.$set(_self.dsm.currRecord, key, val);
          });
          this.dsm.currRecord.sys_stated = billS.POSTED;
          this.$notify.success({ content: "保存成功！", placement: "mid-center" });
        }
        return true;
      }
      this.loading = 0;
      // }
    },
    getDataType(item) {
      if (
        item.type == 91 ||
        item.type == 93 ||
        item.chkRule == "{DATE}" ||
        item.chkRule == "{DATETIME}"
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
      var crd = subdsm.createRecord();
      // console.log(subdsm,subId,crd);
      if (!this.dsm.currRecord[subId]) {
        this.dsm.currRecord[subId] = [];
      }
      this.dsm.currRecord[subId] = subdsm.cdata;
    },
    onRemove(rows) {
      console.log(this.curr_dsm);
      _.forEach(rows.data,(row)=>{
        this.curr_dsm.deleteRecord(row);
      });
      // console.log(rows);
    },
    rowClick(subdsm){
      this.curr_dsm = subdsm;
      console.log(this.curr_dsm);
    },
    rowChange() {},
    formatter(value, data, column) {
      if (column.dataType === "numeric") {
        let pit = column.ccPoint;
        value = common.formatDecimal(value, { precision: pit });
        // data[column.field] = value;
        return value;
      }
      return value;
    },
    async getChildData(subdsm) {
      const objId = subdsm.ccells.obj_id;
      var pkcel = this.dsm.ccells.cels[this.dsm.ccells.pkid];
      var pkkey = pkcel.id;
      var count = {};
      count[pkkey] = this.dsm.currRecord[pkkey];
      count = JSON.stringify(count);
      var data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.localStorage.getItem("user")).userCode,
        apiId: global.APIID_FINDCELLDATA,
        pcell: this.dsm.pcell,
        pdata: count,
        bebill: 1,
        currentPage: 1,
        pageSize: 20,
        cellid: objId
      };
      console.log(data1,'findChild');
      var res = await this.getDataByAPINewSync(data1);
      if(res.data.id === 0){
        this.dsm.currRecord[objId] = res.data.data.pages.celData;
        subdsm.cdata = res.data.data.pages.celData;
        console.log(subdsm);
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
      if (this.dsm && this.dsm.currRecord != null) {
        if ((this.dsm.currRecord.sys_stated & billS.INSERT) > 0) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    }
  },
  mounted() {
    if(this.dsm){
      const state = this.dsm.currRecord.sys_stated & billS.INSERT;
      if (this.dsm.ds_sub&&state === 0) {
        this.getChildData(this.dsm.ds_sub[0]);
      }else if(this.dsm.ds_sub){
        this.dsm.ds_sub[0].clearData();
      }
    }
  }
};
</script>

<style lang="scss">

</style>


