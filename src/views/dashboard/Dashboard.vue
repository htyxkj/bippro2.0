<template>
  <!-- <md-layout> -->
    <!-- <md-image src="../../img/dashboard/01.png"></md-image> -->
    <md-layout md-gutter md-row>
     <img src="../../img/dashboard/01.png">
    </md-layout>
  <!-- </md-layout> -->
  
</template>
<script>
import _ from 'lodash';
import pieC from './chartJS/pieC.js';
import columnC from './chartJS/columnC.js';
import lineC from './chartJS/lineC.js'
import commUtil from '@/components/core/utils/common.js'

export default {
  data() {
    return {
      model: {
        news: [
          { sid: '1', title: '测试', content: '' },
        ]
      },
      pieChart: pieC.bar,
      columnChart: columnC.chart,
      lineChart: lineC.chart,
      taskLayCel: {},
      taskValues: [],
      xsValues: [],
      loading:0,
      datas:[],
      cols:[],
      hdcls:'biphead',

    }
  },
  created(){
    // this.doQuery();
    // this.getDatas({});
  },
  methods: {
    async doQuery() {
      this.loading++
      var option = {
        'pageSize': 20,
        'page': 1,
        'assistid': '{SYGG}',
      };
      this.getAssistODataByAPI(option, this.getCallBack, this.getCallError);
      this.fetchTaskData();
      await this.fetchXSData();
    },
    getCallBack(res) {
      // console.log(res);
      if (res.data.code == 1)
        this.model.news = res.data.values;
    },
    getCallError(res) {
      this.loading--
    },
    async fetchTaskData() {
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAM,
        'pcell': 'SYRW',
        'pdata': '{brd:0,}',
        'bebill': 1,
        'currentPage': 1,
        'pageSize': 20,
        'cellid': ''
      }
      var res = await this.getDataByAPINew(data1);
      if(res.data.id==0){
        this.taskLayCel = await this.makeCellCL(res.data.data.layCels);
        this.taskValues = res.data.data.pages.celData;
      }
    },
    async fetchXSData() {
      let year = commUtil.now('YYYY');
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAM,
        'pcell': 'SYBMSX',
        'pdata': '{yy:' + year + '}',
        'bebill': 1,
        'currentPage': 1,
        'pageSize': 9999,
        'cellid': ''
      }
      // var res = await this.getDataByAPINew(data1);
      this.getDataByAPINew(data1,this.getXSCallBack);
      // this.getXSCallBack(res);
    },
    // async getTaskCallBack(res) {
    //   if (res.data.id == 0) {
    //     this.taskLayCel = await this.makeCellCL(res.data.data.layCels);
    //     this.taskValues = res.data.data.pages.celData;
    //   }
    // },
    getXSCallBack(res) {
      this.loading--
      if (res.data.id == 0) {
        this.xsValues = res.data.data.pages.celData;
        var sers = [];
        _.forEach(this.xsValues, (item, key) => {
          var bb = _.findIndex(sers,(value)=>{
            return value.name == item.orgname;
          })
          if (bb>-1) {
            sers[bb].data[item.mm - 1] = parseFloat(item.fcy);
            // sers[bb+1].data[item.mm - 1] = item.qty;
          } else {
            var cc = { name: item.orgname, data: [0,0,0,0,0,0,0,0,0,0,0,0] };
            cc.data[item.mm - 1] = parseFloat(item.fcy);
            sers.push(cc);
            // var dd = { name: item.orgname+"-数量", data: [0,0,0,0,0,0,0,0,0,0,0,0] };
            // cc.data[item.mm - 1] = item.qty;
            // sers.push(dd);
          }
        });
        this.columnChart.series = sers;
        console.log(sers);
        this.$refs.xsChart.mergeOption(this.columnChart);
      }
    },
    dblclick(row) {
    },
    setRowColor(_index) {
      _index = _index % 2;
      if (_index !== 0) {
        return true;
      }
      return false;
    },
    getDatas({ pager, filter, sort }) {
      var datas = [
        { id: 'John', code: 'Lennon1', name: 'Guitar', date: '04/10/1940', type_enum: 'indect' },
        { id: 'John1', code: 'Lennon1', name: 'Guitar1', date: '04/10/1950', type_enum: 'indect' },
        { id: 'John2', code: 'Lennon1', name: 'Guitar2', date: '04/10/1960', type_enum: 'indect' },
      ];
      var cols = [{field:'id',label:'Id',width:30},{field:'code',label:'编码',width:30},{field:'name',label:'名称',width:200},{field:'date',label:'合同日期',width:100},{field:'type_enum',label:'类型',width:40}];
      this.cols = cols;
      this.datas = datas;
    },
    formatter(value, columnProperties){
      return `Hi, ${value}`;
    },
  }
}
</script>

<style lang="scss" scoped>
.md-card {
  margin: 0.15rem;
}

@media (max-width: 600px) {
  .md-card {
    margin: 0;
  }
}
// .md-grid-body .flex tr{
//   &.md-grid-table tr{
//     height: 60px;
//   }
// }
.md-grid-table{
  tr{
    height: 60px;
  } 
}
</style>
