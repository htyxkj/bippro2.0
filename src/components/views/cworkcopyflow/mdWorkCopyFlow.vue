<template>
	<md-dialog ref="cpdialog">
		<h4 style="margin-left:40%">{{title}}</h4>
		<!-- <md-dialog-title>来源--{{title}}</md-dialog-title> -->
		<md-dialog-content>
			<md-content v-if="dscont&&dscont.ccells!=null">
				<md-layout>
					<md-bip-input v-for="cell in dscont.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dscont.currRecord"
					 :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
				</md-layout>
			</md-content>
			<md-content class="flex layout-column">
				<md-layout class="flex">
					<md-table-card>
						<md-table @select="onTableSelect" class="flex">
							<md-table-header>
								<md-table-row v-if="dsm">
									<md-table-head v-for="(item) in dsm.ccells.cels" :key="item.id" v-if="item.isShow" :md-numeric="item.type===3">{{item.labelString}}</md-table-head>
								</md-table-row>
							</md-table-header>
							<md-table-body v-if="dsm">
								<md-table-row v-if="dsm.cdata.length==0">
									<md-layout>
										<md-content>
											<md-button class="md-fab md-fab-center-center">
												<md-icon>verified_user</md-icon>
											</md-button>
											<span class="md-fab-center-center">{{$t('commInfo.noDatas')}}</span>
										</md-content>
									</md-layout>
								</md-table-row>
								<md-table-row v-else :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in dsm.cdata" :key="rowIndex"
								 :md-item="row" :md-auto-select="mdAutoSelect" :md-selection="mdSelection">
									<md-table-cell v-for="(column, columnIndex) in dsm.ccells.cels" :key="columnIndex" v-if="column.isShow"
									 :md-numeric="column.type<12" :class="numRed(row[column.id],column) ? 'md-num-red':''">
                    <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type === 3" :modal="row" :row="row"></md-bip-ref>
									</md-table-cell>
								</md-table-row>  
							</md-table-body>
						</md-table>
						<md-table-tool>
							<md-layout class="flex"></md-layout>
							<md-table-pagination :md-size="pageInfo.size" :md-total="pageInfo.total" :md-page="pageInfo.page" :md-label="$t('commInfo.Per')"
							 md-separator="/" :md-page-options="[5,10,15,20, 30, 50]" @pagination="onTablePagination">
							</md-table-pagination>
						</md-table-tool>
						<md-table-card>
							<md-table class="flex">
								<md-table-header>
									<md-table-row v-if="dssub">
										<md-table-head v-for="(item) in dssub.ccells.cels" :key="item.id" v-if="item.isShow" :md-numeric="item.type===3">{{item.labelString}}</md-table-head>
									</md-table-row>
								</md-table-header>
								<md-table-body v-if="dssub">
									<md-table-row v-if="dssub.cdata.length==0">
										<md-layout>
											<md-content>
												<md-button class="md-fab md-fab-center-center">
													<md-icon>verified_user</md-icon>
												</md-button>
												<span class="md-fab-center-center">{{$t('commInfo.noDatas')}}</span>
											</md-content>
										</md-layout>
									</md-table-row>
									<md-table-row v-else :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in dssub.cdata"
									 :key="rowIndex" :md-item="row" :md-auto-select="mdAutoSelect" :md-selection="mdSelection">
										<md-table-cell v-for="(column, columnIndex) in dssub.ccells.cels" :key="columnIndex" v-if="column.isShow"
										 :md-numeric="column.type<12" :class="numRed(row[column.id],column) ? 'md-num-red':''">
											<md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type === 3" :modal="row"></md-bip-ref>
										</md-table-cell>
									</md-table-row>
								</md-table-body>
							</md-table>
						</md-table-card>
					</md-table-card>
				</md-layout>
			</md-content>
		</md-dialog-content>
		<md-dialog-actions>
			<md-button class="md-raised md-primary" @click="selectOK">确定</md-button>
			<md-button class="md-raised md-primary" @click="refresh">刷新</md-button>
			<md-button class="md-raised md-accent" @click="close">取消</md-button>
		</md-dialog-actions>
	</md-dialog>
</template>
<script>
import CDataSet from "../classes/CDataSet";
export default {
  data() {
    return {
      title: "",
      dscont: null,
      dsm: null,
      dssub: null,
      cpsparam: null,
      pageInfo: {
        size: 5,
        page: 1,
        total: 0
      },
      selectData: null,
      mdAutoSelect: true,
      mdSelection: false,
      cpinf:[]
    };
  },
  methods: {
    openCopy(param) {
      this.cpsparam = param;
      this.title = param.buidfrName;
      this.dsm = null;
      this.dssub = null;
      this.dscont = null;
      this.dscont = new CDataSet(param.cells[0]);
      this.dsm = new CDataSet(param.cells[1]);
      this.dsm.cdata = [];
      this.dsm.pcell = param.pcell;
      this.dssub = new CDataSet(param.cells[1].subLayCells[0]);
      this.dssub.cdata = [];
      this.featchData();
      this.initCPInf();
      this.$refs["cpdialog"].open();
    },
    refresh() {
      this.pageInfo.page = 1;
      this.featchData();
    },
    async featchData() {
      console.log(this.dscont.currRecord)
      var pdata = JSON.stringify(this.dscont.currRecord);
      pdata = JSON.parse(pdata);
      pdata[this.cpsparam.flag]=0
      pdata = JSON.stringify(pdata);
      var data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_FINDCELLDATA,
        pcell: this.cpsparam.pcell,
        pdata: pdata,
        bebill: 0,
        currentPage: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        cellid: ""
      };

      let res = await this.getDataByAPINewSync(data1);

      // console.log(res);
      if (res.data.id == 0) {
        // console.log(11)
        this.pageInfo.total = res.data.data.pages.totalItem;
        if (this.dsm.cdata.length > 0) {
          this.dsm.clearData();
          this.dssub.clearData();
        }
        _.forEach(res.data.data.pages.celData, row => {
          // row.sys_stated = BillState.HISTORY;
          this.dsm.addRow(row);
          // console.log(row)
        });
      }
    },
    onTablePagination(pager) {
      this.pageInfo.page = pager.page;
      this.pageInfo.size = pager.size;
      this.featchData();
    },
    onTableSelect(item) {
      // console.log(item);
      this.selectData = Object.values(item)[0];
      // console.log(this.selectData)
      this.dsm.currRecord = this.selectData;
      if (this.selectData) this.getChildData(Object.values(item)[0]);
    },
    close() {
      this.$refs["cpdialog"].close();
    },
    dataChange(pars) {
      // console.log(pars);
    },
    async getChildData(row) {
      if (!row) return;
      let key = this.dsm.ccells.pkid;
      let id = this.dsm.ccells.cels[key].id;
      var count = {};
      count[id] = row[id];
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
        cellid: this.dssub.ccells.obj_id
      }; 
      var res = await this.getDataByAPINewSync(data1);
      if (res.data.id == 0) {
        if (this.dssub.cdata.length > 0) {
          this.dssub.clearData();
        }
        _.forEach(res.data.data.pages.celData, row => {
          // row.sys_stated = BillState.HISTORY;
          this.dssub.addRow(row);
          // console.log(row)
        });
      }
    },
    setRowColor(_index) {
      _index = _index % 2;
      if (_index !== 0) {
        return true;
      }
      return false;
    },
    numRed(vals, cell) {
      if (cell.type === 3 && vals < 0) return true;
      return false;
    },
    selectOK() {
      if (this.selectData) {
        let robj = this.dsm.currRecord;
        let cldata = this.dssub.cdata;
        this.cpinf[0].cdata = robj;
        if(this.dssub.cdata.length>0)
          this.cpinf[1].cdata = cldata;
        // console.log(this.cpinf)
        this.$emit('writeBack',this.cpinf);
        this.close();
      } else {
        this.$notify.warning({
          content: "没有选择任何数据!",
          placement: "mid-center"
        });
      }
    },
    initCPInf(){
      let scopys = this.cpsparam.scopys;
      let cpinf1 = [];
      _.forEach(scopys,function(item){
        let keys = [];
        let inf = {};
        if(item.smap){
          let nn = item.smap.split(',');
          _.forEach(nn,function(key){
            let mm = key.split('/');
            let key1 = {keyf:mm[0],keyt:mm[1]};
            keys.push(key1);
          });
        }
        inf['kft'] = keys;
        cpinf1.push(inf);
      });
      this.cpinf = cpinf1;
    }, 
  }
};
</script>
