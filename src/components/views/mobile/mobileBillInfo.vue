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
      <template v-if="dsm&&dsm.ds_sub.length==0">
        <md-content class="layout-fill" v-if="dsm&&dsm.ccells!=null">
          <md-layout>
            <md-bip-input v-for="(cell, index) in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout>
        </md-content>
      </template>
      <template v-if="dsm&&dsm.ds_sub.length>0">
        <md-content class="flex layout-column" v-if="dsm&&dsm.ccells!=null">
          <md-stepper md-vertical>
            <md-step id="step1" :md-label="dsm.ccells.desc" mdButtonContinue="下一步" mdButtonBack="上一步" mdButtonFinish="完成">
              <md-layout>
                <md-bip-input v-for="(cell, index) in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
              </md-layout>
            </md-step>
            <md-step id="step2" md-label="子项" mdButtonContinue="下一步" mdButtonBack="上一步" mdButtonFinish="完成">
              <div>
                <md-list >
                  <md-list-item v-for="(dj,djIndex) in dsm.ds_sub[0].cdata"  :key="djIndex" @click.stop="itemClick(dsm.ds_sub[0],djIndex)">
                    <!-- 删除 -->
                     <md-button class="md-icon-button md-list-action" @click.stop="deleteDj(dsm.ds_sub[0],djIndex)">
                      <md-icon class="md-accent">close</md-icon>
                    </md-button>
                    <!-- <md-icon>list</md-icon> -->
                    <h5>第 {{djIndex+1}} 行</h5>
                    <md-list-expand ref="expand">
                      <md-list>
                        <md-layout class="flex layout-column">
                            <md-layout>
                              <md-bip-input v-for="(item,itemIndex) in dsm.ds_sub[0].ccells.cels" :ref="item.id" :key="item.id" :cell="item" :modal="dj" :btj="false" class="bip-input" @change="childChange"></md-bip-input>
                            </md-layout>
                        </md-layout>
                      </md-list>
                    </md-list-expand>
                </md-list-item>
                </md-list>
                <md-button class=" md-raised md-primary" @click="addDj(dsm.ds_sub[0])">
                  添加行
                </md-button>
                <md-button class=" md-raised md-accent" @click="deleteAll(dsm.ds_sub[0])">
                  删除所有
                </md-button>
              </div>
            </md-step>
            <md-step id="step3" md-label="单据提交" mdButtonContinue="下一步" mdButtonBack="上一步" mdButtonFinish="完成">
               <h2 class="md-title">确认提交单据？</h2>
            </md-step>
          </md-stepper>
        </md-content>
      </template>
    </md-part-body>
  </md-part>
</template>

<script>
import CDataSet from "../classes/CDataSet";
import billS from "../classes/billState";
import common from "../../core/utils/common.js";
export default {
  data(){
    return {
      curr_dsm:null,
      subIndex:0
    }
  },
  props: { dsm: Object, dsext: Array, opera: Object },
  methods: {
    childChange(data){
      console.log(data,this.curr_dsm);
      this.curr_dsm.checkEdit(data);

    },
    //grid
    rowClick(subdsm){
      this.curr_dsm = subdsm;
      console.log(this.curr_dsm);
    },
    //listitem
    itemClick(subdsm,index){
      //当前点击行号
      this.curr_dsm = subdsm;
      subdsm.currRecord = subdsm.cdata[index];
      this.subIndex = index;
      console.log(subdsm,index)
    },
    deleteAll(subdsm){
      subdsm.clearData();
    },
    deleteDj(subdsm,index){
      this.curr_dsm = subdsm;
      this.onRemove(index)
      console.log(this.dsm.ds_sub[0].cdata.length)
      //无数据
      // if(subdsm.cdata.length==0){
      //   subdsm.currRecord = undefined
      // }else{
      //   //当前行为下一行
      //   subdsm.currRecord = subdsm.cdata[index+1]
      // }
    },
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
    addDj(subdsm) {
      
      this.curr_dsm = subdsm;
      // console.log(this.curr_dsm)
      var subId = subdsm.ccells.obj_id;
      // console.log(subId,'fdsfdsfdsfdsfdsf');
      var crd = subdsm.createRecord();
      // console.log(subdsm,subId,crd,'fdsfdsfds');
      if (!this.dsm.currRecord[subId]) {
        this.dsm.currRecord[subId] = [];
      }
      //currRecord
      this.dsm.currRecord[subId] = subdsm.cdata;
      this.subIndex = subdsm.cdata.length-1;

      this.$nextTick(() => {
        console.log(this.$refs.expand);
        var _index = this.$refs.expand.length-1
        subdsm.currRecord = subdsm.cdata[_index]
        for(var i = 0;i<_index;i++){
          this.$refs.expand[i].$parent.active = false
        }
        this.$refs.expand[_index].$parent.active = true
      });
      // this.$refs['bb'].$children[index-1].active = true;
      // console.log(this.$refs['bb']);
      // console.log(subdsm.cdata)
      // console.log(this.dsm)
    },

    onRemove(row) {
      this.curr_dsm.deleteRow(row);
      console.log(this.curr_dsm,'fdsfdsfds');
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
        subdsm.currRecord = subdsm.cdata[0];
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
      }
      if(this.dsm.ds_sub.length>0){
        this.dsm.ds_sub[0].clearData();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.md-layout{margin: 0;}
</style>


