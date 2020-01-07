<template>
  <div v-if="laycell" class="bip-lay">
    <template v-if="laycell&&!laycell.btable">
      <md-layout> 
        <md-bip-input :showsth="sth" :dsm="dsm" v-for="cell in cells" :ref="cell.id" :key="cell.id" :cell="cell" :modal="cds.currRecord" :btj="false" class="bip-input" @change="dataChange" @changeShowSth="settingShowField"></md-bip-input>
      </md-layout>
    </template>
    <template v-else> 
      <md-layout style="height:100%"> 
        <md-bip-grid style="min-height: 2rem;" :dsm="dsm" :datas="cds.cdata" ref="grid" :row-focused="true" :auto-load="true" @onAdd="onLineAdd(cds)" @onRemove="onRemove" :showAdd="canAddChild" :showRemove="canAddChild"  @rowChange="rowChange" @click="rowClick(cds)" :isEntry="isEntry(cds)">
          <md-bip-grid-column v-for="(item) in cells" :key="item.id" :label="item.labelString" :field="item.id" editable :hidden="!item.isShow" :refId="item.editName || item.refValue" :script="item.script" :attr="item.attr" :ccPoint="item.ccPoint" :refValue="item.refValue" :width="item.ccCharleng" :isReq="item.isReq" :editName="item.editName" :editType="item.editType" :assist="item.assist" :dataType="getDataType(item)" :objid="cds.ccells.obj_id" :formatter="formatter"  :assType="item.assType">
          </md-bip-grid-column>
        </md-bip-grid> 
      </md-layout>
    </template>
  </div>
</template>
<script>

import common from "../../../core/utils/common.js";
import billS from "../../classes/billState";
export default {
  data() {
    return {
      widths: [],
      cds: null,
      cells: null, 
    };
  },
  props: { laycell: Object, dsm: Object,sth:Object},
  methods: {
    // initisShow() {
    //   let layCell = [];
    //   if (this.laycell) {
    //     this.cells.forEach(cel => {
    //       if (cel.isShow) {
    //         layCell.push(cel); 
    //       }
    //     });
    //   }
    //   this.cells = layCell; 
    // },
    calculationWidth() {  
      var width = document.body.clientWidth-83;   
      var sumLeng=0; 
      var positive=0;//正
      var negative=0;//负
      for(var i =0 ;i<this.cells.length;i++){ 
        var cell = this.cells[i];
        var aa = cell.ccCharleng+'';
        if(aa.indexOf("px")!=-1){
          return;
        }
        if(cell.isShow){ 
          if(cell.ccCharleng==0)
            cell.ccCharleng = 14
          if(cell.ccCharleng<0){
            negative+= Math.abs(cell.ccCharleng);
          }else{
            positive+= Math.abs(cell.ccCharleng);
          } 
        }
      }
      for(var i =0 ;i<this.cells.length;i++){
        var cell = this.cells[i];
        if(cell.isShow){
          var aa = cell.ccCharleng+''; 
          var fw=width-(positive*14)
          if(fw<=100){ 
            if(aa.indexOf("px")==-1)
              cell.ccCharleng = parseInt(Math.abs(cell.ccCharleng)* parseInt(14)) +''+'px'
          }else{
            if(aa.indexOf("px")==-1){
              if( cell.ccCharleng >0){
                cell.ccCharleng = parseInt(Math.abs(cell.ccCharleng)* parseInt(14)) +''+'px'
              }else{
                cell.ccCharleng = Math.abs(cell.ccCharleng)/negative*fw+''+'px';
              }
            }
          } 
        }
      } 
    },  
    dataChange(res) { 
      this.dsm.checkEdit(res);
    },   
    //判断字段类型
    getDataType(item) {
      if (
        item.type == 91 ||
        item.type == 93 ||
        item.chkRule == "{DATE}" ||
        item.chkRule == "{DATETIME}" ||
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
      if (!this.curr_dsm) this.curr_dsm = this.dsm.ds_sub[0];
      _.forEach(rows.data, row => {
        this.curr_dsm.deleteRecord(row);
      });
      // console.log(rows);
    },
    rowClick(subdsm) {
      this.curr_dsm = subdsm; 
    },
    rowChange(row) {
      console.log("row Change", row);
      const state = this.dsm.currRecord.sys_stated;
      if (this.chkinfo) {
        if (this.chkinfo.currState.stateId !== "0" && this.chkinfo.currState.stateId !== "1") {
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
        if (v !== 0) value = common.formatDecimal(value, { precision: pit });
        else {
          value = "";
        }
        // data[column.field] = value;
        return value;
      }
      return value;
    }, 
    successBack(res) {
      // console.log(res);
      let rtn = res.data;
      if (rtn.id == 0) {
        this.flowlist = rtn.data.flowlist;
      }
    }, 
    //判断表单是否是录入单据属性  输出 打勾 =false
    isEntry(data) {
      var bb = 0x10000;
      var cc = data.ccells.attr & bb;
      if (cc > 0) {
        return false;
      } else {
        return true;
      }
    }, 
    //计算多行
    getMulti_line() {
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

      let row = [];
      let j = 0;
      let isRows = false; //上一个是否是多行
      for (var i = 0; i < iput.length; i++) {
        let one = iput[i];
        if (one.isShow == false) {
          continue;
        }
        if (one.ccHorCell <= columnNum)
          one.ccHorCell = parseInt((one.ccHorCell * 100) / columnNum);
        j += one.ccHorCell;
        if (j == 100) {
          if (one.ccVerCell > 1) {
            var o = [{ rows: true, input: one, ccHorCell: one.ccHorCell }];
            row.push(o);
            isRows = true;
          } else {
            if (isRows) {
              var o = [{ rows: false, input: one }];
              row.push(o);
            } else {
              if (row == [] || row.length == 0) {
                var o = new Array(0);
                var b = { rows: false, input: one };
                o.push(b);
                row.push(o);
              } else {
                var o = { rows: false, input: one };
                row[row.length - 1].push(o);
              }
            }
            isRows = false;
          }
          for (var r = 0; r < row.length; r++) {
            if (row[r][0].rows == false) {
              let _r = row[r];
              let width = 0;
              for (var _j = 0; _j < _r.length; _j++) {
                width += _r[_j].input.ccHorCell;
              }
              let _width = 0;
              if (width != 100) {
                while (width != _width) {
                  i++;
                  let _one = iput[i];
                  if (_one) {
                    if (_one.ccHorCell <= columnNum)
                      _one.ccHorCell = parseInt(
                        (_one.ccHorCell * 100) / columnNum
                      );
                    _width += _one.ccHorCell;
                    if (_width <= width) {
                      let b = { rows: false, input: _one };
                      row[r].push(b);
                    } else {
                      _width = width;
                      i--;
                    }
                  } else {
                    _width = width;
                  }
                }
              } else {
                _width = width;
              }
              for (var _j = 0; _j < _r.length; _j++) {
                row[r][_j].ccHorCell = _width;
              }
            }
          }
          // console.log(row)
          for (var l = 0; l < row.length; l++) {
            for (var p = 0; p < row[l].length; p++) {
              row[l][p].input.ccHorCell = parseInt(
                (row[l][p].input.ccHorCell / row[l][0].ccHorCell) * 100
              );
            }
          }

          this.inp.push(row);
          row = [];
          j = 0;
          isRows = false; //上一个是否是多行
        } else if (j < 100) {
          if (one.ccVerCell > 1) {
            var o = [{ rows: true, input: one, ccHorCell: one.ccHorCell }];
            row.push(o);
            isRows = true;
          } else {
            if (isRows) {
              var o = [{ rows: false, input: one }];
              row.push(o);
            } else {
              if (row == [] || row.length == 0) {
                var o = new Array(0);
                var b = { rows: false, input: one };
                o.push(b);
                row.push(o);
              } else {
                var o = { rows: false, input: one };
                row[row.length - 1].push(o);
              }
            }
            isRows = false;
          }

          if (i == iput.length - 1) {
            for (var r = 0; r < row.length; r++) {
              if (row[r][0].rows == false) {
                let _r = row[r];
                let width = 0;
                for (var _j = 0; _j < _r.length; _j++) {
                  width += _r[_j].input.ccHorCell;
                }
                let _width = 0;
                if (width != 100) {
                  while (width != _width) {
                    i++;
                    let _one = iput[i];
                    if (_one) {
                      if (_one.ccHorCell <= columnNum)
                        _one.ccHorCell = parseInt(
                          (_one.ccHorCell * 100) / columnNum
                        );
                      _width += _one.ccHorCell;
                      if (_width <= width) {
                        let b = { rows: false, input: _one };
                        row[r].push(b);
                      } else {
                        _width = width;
                        i--;
                      }
                    } else {
                      _width = width;
                    }
                  }
                } else {
                  _width = width;
                }
                for (var _j = 0; _j < _r.length; _j++) {
                  row[r][_j].ccHorCell = _width;
                }
              }
            }
            // console.log(row)
            for (var l = 0; l < row.length; l++) {
              for (var p = 0; p < row[l].length; p++) {
                row[l][p].input.ccHorCell = parseInt(
                  (row[l][p].input.ccHorCell / row[l][0].ccHorCell) * 100
                );
              }
            }

            this.inp.push(row);
            row = [];
            j = 0;
            isRows = false; //上一个是否是多行
          }
        } else if (j > 100) {
          if (one.ccHorCell <= columnNum)
            iput[i].ccHorCell = parseInt((one.ccHorCell / 100) * columnNum);
          i--;
          j = 100;
          for (var r = 0; r < row.length; r++) {
            if (row[r][0].rows == false) {
              let _r = row[r];
              let width = 0;
              for (var _j = 0; _j < _r.length; _j++) {
                width += _r[_j].input.ccHorCell;
              }
              let _width = 0;
              while (width != _width) {
                i++;
                let _one = iput[i];
                if (_one) {
                  if (_one.ccHorCell <= columnNum)
                    _one.ccHorCell = parseInt(
                      (_one.ccHorCell * 100) / columnNum
                    );
                  _width += _one.ccHorCell;
                  if (_width <= width) {
                    let b = { rows: false, input: _one };
                    row[r].push(b);
                  } else {
                    _width = width;
                    i--;
                  }
                } else {
                  _width = width;
                }
              }
              for (var _j = 0; _j < _r.length; _j++) {
                row[r][_j].ccHorCell = _width;
              }
            }
          }
          // console.log(row)
          for (var l = 0; l < row.length; l++) {
            for (var p = 0; p < row[l].length; p++) {
              row[l][p].input.ccHorCell =
                (row[l][p].input.ccHorCell / row[l][0].ccHorCell) * 100;
            }
          }

          this.inp.push(row);
          row = [];
          j = 0;
          isRows = false; //上一个是否是多行
        }
      }
      console.log("循环完成");
      // console.log(this.inp);
    },  
    //设置显示隐藏字段
    settingShowField(key){
      console.log(key)
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
  },
  computed: { 
    canAddChild() {
      if (this.opera) {
        var crd = this.dsm.currRecord;
        if (crd) {
          var state = crd[this.opera.statefld];
          state = state === "" ? "0" : state;
          if (state === "0" || state === "1" || state === undefined) {
            return true;
          }
          return false;
        }
      }
      return true;
    }
  },
  created() {
    if (this.laycell) { 
      this.cells = this.laycell.cells.cels.slice(this.laycell.start===-1?0:this.laycell.start,this.laycell.endP===-1?this.laycell.cells.cels.length:(this.laycell.endP+1))
      // this.initisShow();
      this.calculationWidth();
      if (this.dsm){
        this.cds = this.dsm.getDataSet(this.laycell.obj_id);
      }
    }
  },
  async mounted() {},
  watch: {}
};
</script>
<style scoped>
.bip-lay{
  width: 100%;
  max-width: 100%;
  height: 100%;
}
</style>