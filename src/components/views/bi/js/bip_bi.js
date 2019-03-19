 /* jshint esversion: 6 */ 
import CDataSet from '../../classes/CDataSet';
export default {
  mounted() {},
  data() {
    return {
      showCont: false,
      showContLabel: this.$t('commInfo.showCont'),
      ds_cont: null,
      ds_m: null,
      ds_ext: [],
      pageInfo: {
        size: 20,
        total: 0,
        page: 1
      },
      // pages: {},
      mdAutoSelect: true,
      mdSelection: false,
      groupfilds: [],
      groupdatafilds: [],
      chartList: [{
        id: 'pie',
        name: this.$t('chart.pie')
      }, {
        id: 'line',
        name: this.$t('chart.line')
      }, {
        id: 'column',
        name: this.$t('chart.column')
      }],
      checkShowC: 1,
      ctype: 'line',
      loading: 0,
      groupTJ: false,
      showChart: true,
      tjcell: {},
      tjpage: {},
      doSearCh: 0,
      showAllCont: false,
      tipLaber: this.$t('commInfo.moreCont'),
      mparamsArr: [],
      _mparams: null,
      dlgBtn: [], //弹出框按钮
      selectData: null, //表格选中行
      btnDisabled: false,
    }
  },
  methods: {
    async exportFile() {
      if (this.ds_m.cdata.length == 0)
        return;
      var header = [];
      var _data = {};
      for (let i = 0; i < this.ds_m.ccells.cels.length; i++) {
        const cell = this.ds_m.ccells.cels[i];
        header[i] = cell.id;
        _data[cell.id] = cell.labelString;
      }
      // var arr = [];
      console.log(header, _data);
      var cdata = this.ds_m.cdata;
      if (this.pageInfo.total > this.ds_m.cdata.length) {
        // console.log('big fff，服务端导出数据');
        let pdata = JSON.stringify(this.ds_cont.currRecord);
        let data1 = {
          dbid: global.DBID,
          usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
          apiId: global.APIID_EXPDATA,
          pcell: this.ds_m.pcell,
          pdata: pdata,
          bebill: 0,
          currentPage: 1,
          pageSize: this.pageInfo.total,
          cellid: this.ds_m.ccells.obj_id
        };
        var res = await this.downFile(data1);
        const content = res.data;
        this.exportFilesServ(content, this.mdTitle);
      } else {
        this.exportFiles(header, cdata, _data, '', this.mdTitle);
      }
    },
    async getCell() {
      var pcell = this._mparams.pcell;
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAMS,
        'pcell': pcell
      }
      var res = await this.getDataByAPINewSync(data1);

      var data = res.data;
      // console.log(data);
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
          this.ds_cont = new CDataSet(cells0);
          this.ds_cont.createRecord();
          var cells1 = await this.makeCellCL(cells[1]);
          this.ds_m = new CDataSet(cells1);
          this.ds_m.setPcell(pcell);
          for (var i = 2; i < celL - 2; i++) {
            var cellsi = await this.makeCellCL(cells[i + 1]);
            var ds = new CDataSet(cellsi);
            this.ds_ext[i] = ds;
          }
        }
        if (!this._mparams.bgroup) {
          this.fetchUIData(); //一进入页面不查询
        } else {
          this.groupfilds = [];
          this.groupdatafilds = [];
          this.doSearCh++;
          this.groupTJ = true;
        }
      } else {
        this.$notify.warning({
          content: data.message,
          placement: 'mid-center'
        });
      }
    },
    async fetchUIData() {
      this.loading++;
      var pdata = JSON.stringify(this.ds_cont.currRecord);
      var data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_FINDCELLDATA,
        pcell: this.ds_m.pcell,
        pdata: pdata,
        bebill: 0,
        currentPage: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        cellid: this.ds_m.ccells.obj_id
      };
      var res = await this.getDataByAPINewSync(data1);
      if (res.data.id == 0) {
        var pages = res.data.data.pages;
        this.ds_m.cdata = pages.celData;
        this.pageInfo.page = pages.currentPage;
        this.pageInfo.size = pages.pageSize;
        this.pageInfo.total = pages.totalItem;
      }
      this.loading--;
    },
    initInf() {
      this.pageInfo.size = 20;
      this.pageInfo.page = 1;
      this.pageInfo.total = 0;


      this.groupTJ = false;

      if (global.BI_SHOWCONDITION) {
        this.showCont = true; //隐藏，显示条件
        this.showAllCont = true; //隐藏，显示条件 剩余
      } else {
        this.showCont = false; //隐藏，显示条件
        this.showAllCont = false; //隐藏，显示条件 剩余
      }
    },
    initCell() {
      this.initInf();
      this.mparamsArr = this.mparams;
      // this.mparamsArr.push(this.mparams);

      if (Array.isArray(this.mparamsArr)) {
        this._mparams = this.mparamsArr[0]
      } else {
        this._mparams = this.mparams
      }
      if (this._mparams.pcell) {
        this.ds_m = null;
        this.ds_cont = null;
        this.ds_ext = [];
        this.getCell();
      }
    },
    onTablePagination(pager) {
      if (parseInt(pager.size) != parseInt(this.pageInfo.size)) {
        pager.page = 1;
      }
      this.pageInfo.page = pager.page;
      this.pageInfo.size = pager.size;
      this.fetchUIData(); //一进入页面不查询
    },
    showSearchInfo() {
      this.showCont = !this.showCont;
      console.log(this.$t('commInfo.hiddenCont'));
      this.showContLabel = this.showCont ? this.$t('commInfo.hiddenCont') : this.$t('commInfo.showCont');
      if (!this.showCont) {
        this.showAllCont = false;
      }
    },
    dblclick(row) {},
    async openrefs(row, index, columnIndex) {
      if (columnIndex >= 0) {
        let cell = this.ds_m.ccells.cels[columnIndex];
        let slkid = row[cell.id];
        if ((cell.attr & 0x80000) > 0) {
          let slkbuidCell = this.ds_m.ccells.cels[columnIndex + 1];
          let slkbuid = row[slkbuidCell.id];
          if (slkid && slkbuid) {
            console.log('调用我了');
            this.$refs["sbill"].open(slkid, slkbuid);
          }
        } else {
          console.log("dblclick")
          this.dblclick(row, index);
        }
      }
    },
    clear() {
      if (this.ds_cont) {
        // var crd = this.ds_cont.currRecord;
        _.forEach(this.ds_cont.ccells.cels, item => {
          this.$set(this.ds_cont.currRecord, item.id, '');
        });
        // console.log(crd);
        // this.ds_cont.currRecord = crd;
      }
    },
    list() {
      if (this.groupTJ) {
        this.groupTJ = false;
        this.fetchUIData();
      }
    },
    searchCount(ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref) {
      this.$refs[ref].close();
    },
    okDialog(ref) {
      if (this.groupdatafilds.length > 0 && this.groupfilds.length > 0) {
        this.$refs[ref].close();
        this.groupTJ = true;
        this.showCont = true;
        if (this.doSearCh === Number.MAX_SAFE_INTEGER) {
          this.doSearCh = 0;
        } else {
          this.doSearCh++;
        }
      }
    },
    search() {
      if (this.groupTJ) {
        this.doSearCh++;
        this.showCont = true;
      } else {
        // this.pageInfo.page = 1;
        this.fetchUIData();
      }
    },
    showMore() {
      this.showAllCont = !this.showAllCont;
    },
    // async get
    fileCell(row) {
      let rwcell = {
        c_par: {
          obj_id: row.sbuid,
          cels: [{
            id: "fj_root"
          }]
        },
        id: "fj_name",
        isShow: true,
        labelString: "附件名称",
      };
      return rwcell;
    },
    fileModal(row) {
      let rwmodal = {
        fj_name: row.fj_name,
        fj_root: row.fj_root,
        sbm: row.sbm,
        sbuid: row.sbuid,
      };
      return rwmodal;
    },
    //获取弹出框按钮
    async getDlg() {
      this.dlgBtn = [];
      var menuid = 'DLG.' + this.mparams.pbuid;
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
          var data = res.data.data.btn;
          for (var i = 0; i < data.length; i++) {
            var btnOne = data[i];
            var b = btnOne.split(";");
            var btn = {
              name: b[0],
              cellID: b[1],
              key: b[2]
            };
            btn.menuid = menuid;
            btn.type = btn.name.substring(0, 1)
            btn.name = btn.name.substring(2, btn.name.length);
            this.dlgBtn.push(btn);
          }
          window.sessionStorage.setItem(menuid, JSON.stringify(this.dlgBtn));
        }
      } else {
        this.dlgBtn = JSON.parse(me);
      }
    },
    //点击弹出框按钮
    dlgBtnClick(btn) { 
      if (this.selectData) {
        this.btnDisabled = true;
        let _this = this;
        this.$biDialog.open({
          btnInfo: btn,
          selectData: this.selectData,
          cdsm: this.ds_m,
          getOpt(state) {
            _this.btnDisabled = false;
            if (state == 1) {
              _this.initCell()
            }
          }
        })
      }
    },
    onTableSelect(item) {
      this.selectData = Object.values(item)[0];
      this.ds_m.currRecord = this.selectData;
    },
  },
  async mounted(){
    this.initCell();
    this.getDlg();
  }, 
  watch:{
    showCont(){
      this.showContLabel = this.showCont?this.$t('commInfo.hiddenCont'):this.$t('commInfo.showCont')
    },
    mparams(){
      this.initCell();
      this.getDlg();
    },
    showAllCont(){
      if(this.showAllCont){
        this.tipLaber = this.$t('commInfo.hiddenOtherCont');
      }else{
         this.tipLaber = this.$t('commInfo.moreCont');
      }
    }
  },
}
