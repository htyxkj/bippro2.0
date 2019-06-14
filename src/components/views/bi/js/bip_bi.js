 /* jshint esversion: 6 */ 
import CDataSet from '../../classes/CDataSet';
import billS from '../../classes/billState';
export default {
  mounted() {},
  data() {
    return {
      bills1 : billS, 
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
      menuP:null,
      lineToColumn:"行转列",
      biLay:'table',
      timedown:null,//单据倒计时显示
      sbuidBtn:[],//业务号弹出框按钮
      fixedColumn:0,//固定列数
      Multi_level_title:{},//多级表头
    }
  },
  methods: {
    hideChar(){//隐藏统计表 返回到报表列表状态   
      this.groupTJ = !this.groupTJ; 
    },
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
      // console.log(header, _data);
      var cdata = this.ds_m.cdata;
      // if (this.pageInfo.total > this.ds_m.cdata.length) {
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
      // } else {
      //   this.exportFiles(header, cdata, _data, '', this.mdTitle);
      // }
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
        //解析分组 字段，固定列，多级表头
        if(this.ds_m.ccells.sfix){ 
          let sfix = this.ds_m.ccells.sfix;
          let num = 0;
          if(sfix.indexOf("/") >=0){
            num = sfix.substring(0,sfix.indexOf("/") )
          }else{
            if(sfix.indexOf("&") >=0){ 
              num = 0;
            }else{
              num = sfix;
            }
          }
          this.fixedColumn = parseInt(num);
          if(this.fixedColumn>0)
          for(var i=0;i<this.fixedColumn;i++){
            let cc = this.ds_m.ccells.cels[i];
            if(!cc.isShow)
              this.fixedColumn++;
          }
          if(sfix.indexOf("&") >=0){
            let groupTitleStr = sfix.substring(sfix.indexOf("&")+1,sfix.length).split(";");
            //gwjxkhplan.checkperson,0,2,1,考评人及分值1;gwjxkhplan.checkperson1,0,2,1,考评人及分值2;gwjxkhplan.checkperson2,0,2,1,考评人及分值3;gwjxkhplan.checkperson3,0,2,1,考评人及分值4;gwjxkhplan.checkperson4,0,2,1,考评人及分值5
            if(groupTitleStr)
            for(var i=0;i<groupTitleStr.length;i++){
              let oneGTitle = groupTitleStr[i].split(",");
              this.Multi_level_title[oneGTitle[0]] = oneGTitle[2];
              this.Multi_level_title[oneGTitle[0]+'_TITLE'] = oneGTitle[4];
            } 
          }
        } 
      } else {
        this.$notify.warning({
          content: data.message,
          placement: 'mid-center'
        });
      }
    },
    async fetchUIData(orderBY) {
      this.loading++;
      var pdata = JSON.stringify(this.ds_cont.currRecord);
      pdata = JSON.parse(pdata)
      for(var i =0;i<this.ds_cont.ccells.cels.length;i++){
        let cel = this.ds_cont.ccells.cels[i];
        if((cel.attr & this.bills1.Unconditional)>0){
          delete pdata[cel.id]; 
        }
      }
    //   let noTJ = true;
    //   for(var i=0,l=pdata.length;i<l;i++){
    // 　　for(var key in json[i]){
    //       if(json[i][key] != ''){
    //         noTJ=false;
    //       }
    // 　　}
    //   }
      // if(noTJ){
      //   this.$dialog.confirm("请指定查询条件！", {
      //     okText: this.$t('commInfo.ok'),
      //     cancelText: this.$t('commInfo.cancel')
      //   })
      //   .then(() => {  
      //   });
      //   this.loading--;
      //   return;
      // }

      pdata = JSON.stringify(pdata);
      var data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_FINDCELLDATA,
        pcell: this.ds_m.pcell,
        pdata: pdata,
        bebill: 0,
        currentPage: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        cellid: this.ds_m.ccells.obj_id,
        orderBy :orderBY, 
      };
      if((this.mparams.pattr & 0x10000) >0){ //外部SQL
        data1.type = "sql";
      }
      var res = await this.getDataByAPINewSync(data1);
      if (res.data.id == 0) {
        var pages = res.data.data.pages;
        if(pages){
          this.ds_m.cdata = pages.celData;
          this.pageInfo.page = pages.currentPage;
          this.pageInfo.size = pages.pageSize;
          this.pageInfo.total = pages.totalItem;
        }
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
      // console.log(this.$t('commInfo.hiddenCont'));
      this.showContLabel = this.showCont ? this.$t('commInfo.hiddenCont') : this.$t('commInfo.showCont');
      if (!this.showCont) {
        this.showAllCont = false;
      }
      setTimeout(() => {
        if(document.getElementById("partCondition"))
        this.tableHeight = document.getElementById("partBody").clientHeight-53 - document.getElementById("partCondition").clientHeight;    
        else
        this.tableHeight = document.getElementById("partBody").clientHeight-50 ;
      }, 400); 
    },
    dblclick(row,index) {},
    async openrefs(row, index, columnIndex) { 
      if (columnIndex >= 0) {
        let cell = this.ds_m.ccells.cels[columnIndex];
        let slkid = row[cell.id];
        if ((cell.attr & 0x80000) > 0) {
          let slkbuidCell = this.ds_m.ccells.cels[columnIndex + 1];
          let slkbuid = row[slkbuidCell.id];
          if (slkid && slkbuid) { 
            this.$refs["sbill"].open(slkid, slkbuid);
          }
        } else { 
          // console.log(row,index)
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
      setTimeout(() => {
        if(document.getElementById("partCondition"))
        this.tableHeight = document.getElementById("partBody").clientHeight-53 - document.getElementById("partCondition").clientHeight;    
        else
        this.tableHeight = document.getElementById("partBody").clientHeight-50 ;   
      }, 400);      
    },
    // async get
    // fileFJCell(row) {
    //   let rwcell = {
    //     c_par: {
    //       obj_id: row.sbuid,
    //       cels: [{
    //         id: "fj_root"
    //       }]
    //     },
    //     id: "fj_name",
    //     isShow: true,
    //     labelString: "附件名称",
    //   };
    //   return rwcell;
    // },
    fileFJCell(sbuid,id) {  
      let rwcell = {
        c_par: {
          obj_id: sbuid,
          cels: [{
            id: "fj_root"
          }]
        },
        id: id,
        isShow: true,
        labelString: "附件名称",
      };
      return rwcell;
    },
    fileMPCell(row) {
      let rwcell = {
        c_par: {
          obj_id: row.sbuid,
          cels: [{
            id: "map_root"
          }]
        },
        id: "map_name",
        isShow: true,
        labelString: "位置名称",
      };
      return rwcell;
    },
    fileFJModal(row,id) {
      let rwmodal = {
        fj_root: row.fj_root,
        sbm: row.sbm,
        sbuid: row.sbuid,
      };
      rwmodal[id] = row[id]; 
      return rwmodal;
    },
    fileMPModal(row) {
      let rwmodal = {
        map_name: row.map_name,
        map_root: row.map_root,
        sbm: row.sbm,
        sbuid: row.sbuid,
      };
      return rwmodal;
    },
    //获取弹出框按钮
    async getDlg() { 
      this.sbuidBtn=[];
      this.dlgBtn = [];
      let data = await this.getConstant('DLG.' + this.mparams.pbuid);
      if(data){ 
        let len =  data.length;
        for (var i = 0; i <len ; i++) {
          var btnOne = data[i];
          var type = btnOne.substring(0,1);
          var btn = {};
          btn.name = btnOne.substring(btnOne.indexOf(":")+1,btnOne.indexOf(","));
          btn.menuid = 'DLG.' + this.mparams.pbuid; 
          btn.type = type;
          var b = btnOne.split(";"); 
          if(type == "A"){
            btn.cellID = b[1];
            btn.key = b[2];
          }else if(type == "B"){
            btn.cellID = b[1];
            btn.key = b[2];
          }else if(type == "C"){
            btn.cellID = b[1];
            btn.key = b[2];
            if(b[3])
            btn.selKey=b[3];
          }
          if(type =="D"){
            btn.columnIndex= parseInt(b[1]);
            this.sbuidBtn.push(btn);
          }else{
            this.dlgBtn.push(btn);
          }
        }
      }  
    },
    //条件值发生变化
    dataChange(res) { 
      console.log(this.ds_cont) 
      let cell = this.getTJCell(res.cellId)
      cell.refValues = res;
      this.checkGS(cell);
    },   
    getTJCell(id){
      if(this.ds_cont)
      return _.find(this.ds_cont.ccells.cels,item=>{
        return id === item.id
      });
    },
    //进行公式计算  只做了多列计算
    checkGS(cell) {
      console.log("checkGS")
      if(cell){
        const attr = cell.attr;
        if ((attr & 0x100000) > 0) {
          // console.log('多列计算')
          this.checkMulCols(cell);
        }
      }
      // this.scriptProc.data = this.ds_cont.currRecord;
      // _.forEach(this.ccells.cels, col => {
      //   let scstr = col.script;
      //   if (scstr && scstr.indexOf('=:') === 0) {
      //     scstr = scstr.replace('=:', '');
      //     // 公式计算
      //     var vl = this.scriptProc.execute(scstr,null,col);
      //     // console.log(vl,this.currRecord,col.id,scstr);
      //     this.ds_cont.currRecord[col.id] = vl;
      //   }
      // })
      // console.log(this.row);
    },
    // 多列计算
    checkMulCols(cell) {
      var script = cell.script;
      if (script) {
        script = script.split('&');
        var cols = script[0].split(',');
        var _indexs = script[1].split(',');
        var refValues = cell.refValues;
        var id = this.ds_cont.currRecord[cell.id];
        var refInfo;
        if (refValues) {
          if(_.isArray(refValues.value)){
          }else{
            refInfo = refValues.value;
          }
        }
        if (refInfo) {
          _.forEach(cols, (col, n) => {
            var vv = refInfo[refValues.cols[_indexs[n]]];
            // console.log(vv,col);
            if (vv) {
              var cl = this.getTJCell(col);
              if (cl.type<12 && cl.type>1) {
                vv = new Number(vv).toFixed(cl.ccPoint);
              }
              this.ds_cont.currRecord[col] = vv;
            }
          });
        }
      }
    },
    //点击弹出框按钮
    dlgBtnClick(btn) {  
      if (this.selectData) {
          this.btnDisabled = true;
          this.$refs["biDialog"].openREF(btn,  this.selectData,this.ds_m,this.getOpt); 
      }
    },
    getOpt(state) {
      this.btnDisabled = false;
      if (state == 1) {
        this.initCell()
      }
    },
    //旧table选中行
    onTableSelect(item) {
      this.selectData = item.row;
      this.ds_m.currRecord = this.selectData; 
    },
    //行列转换 
    lineToColumnRun(){  
      if(this.biLay == 'table'){
        this.lineToColumn = "列转行";
        this.biLay = 'card';
      }else if(this.biLay =='card'){
        this.lineToColumn = "行转列";
        this.biLay = 'table';
      } 
    },
    getRowStyle(row,ccells){
      let style = "";
      let sctrls = ccells.sctrls;//"`5state/1:red"
      if(sctrls){
        let type = sctrls.substring(0,2);
        let zd = sctrls.substring(2,sctrls.indexOf("/")) 
        if(type =='`5'){ 
            let vl =  sctrls.split("/")[1].split(":");
            if(row[zd] == vl[0]){
              style +=(" background-color:"+vl[1]+";");
            } 
        }
      }
      return style
    },

    //////////////////////////////////////////////////////////////////
    //新table选中行
    TableSelect(item) {
      this.selectData = Object.values(item)[0];
      this.ds_m.currRecord = this.selectData;
    },
    getHeaderCellClass(item){
      if(this.ds_m.ccells.cels[item.columnIndex].type<12){
        return "md-numeric"
      }      
    },
    isSortable(item){//是否排序
      if((item.attr & this.bills1.ORDERBY)>0){
        return true;
      }
    }, 
    isFixed(item, index) {
      //固定列
      if (this.ds_m.ccells.sfix) {
        if (index < this.fixedColumn) {
          return "left";
        }
      }
    }, 
    getRowStyleNew(column){//新table行样式
      let sctrls =this.ds_m.ccells.sctrls;
      let row = column.row;
      if(sctrls){
        let type = sctrls.substring(0,2);
        let zd = sctrls.substring(2,sctrls.indexOf("/")) 
        if(type =='`5'){ 
            let vl =  sctrls.split("/")[1].split(":");
            if(row[zd] == vl[0]){
              // var doc = document.getElementsByClassName('sctrl');
              // for(var i =0;i<doc.length;i++){
              //   doc[i].setAttribute("style","background-color: "+vl[1]+";");
              // }
              let cc = document.querySelector('tr[data-rowkey="'+ column.rowIndex+'"]')
              // cc.css("background-color",vl[1]);
              cc.setAttribute("style","background-color:  "+vl[1]+";");
              // return 'sctrl'
            } 
        }
      }
      if(column.rowIndex%2==0){
        return 'doubleRow';
      } 
    },
    getTitleNewStyle(column){//新Table表头样式
      //ds_m.ccells.cels
      let columnIndex = column.columnIndex
      let cels = this.ds_m.ccells.cels[columnIndex];
      if(cels.type<12){
        return "titleGreen"
      }      
    },
    onSortNew(data){ //新table表头排序
      
      if(data.column.sortable){
        let order = data.column.order;
        if(data.column.cc ==1){
          this.$refs['newBiTable'].clearSort();
        }
        if(!data.column.cc && data.column.cc!=0 ){
          data.column.cc=1;
        }
        if(data.column.cc && data.column.cc ==1){
          if(order){
            if(order =='desc'){
              data.column.order='asc';
            }else{
              data.column.order='desc';
            }
          }else{
            data.column.order='desc';
          }
          let od = data.column.property+"  "+data.column.order
          this.fetchUIData(od);
        }
        data.column.cc=1;
      }
    },
    sort_change(column,prop,order){ 
      column.column.cc=0;
      let od = column.prop +" "+column.order  
      this.fetchUIData(od);
    }
    //////////////////////////////////////////////////////////////////
  },
  async mounted(){
    await this.initCell();
    await this.getDlg();
  }, 
  watch:{
    showCont(){
      this.showContLabel = this.showCont?this.$t('commInfo.hiddenCont'):this.$t('commInfo.showCont')
    },
    mparams(){
      this.initCell();
      this.getDlg();
      this.getLayout();
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
