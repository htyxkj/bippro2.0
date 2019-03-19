<template> 
  <md-part>
    <md-part-body style="  background-color: #F2F3F5!important;"> 
      <div  class="maxdiv" >
        <md-layout md-column>
          <md-layout class="dtitle">
            <h4>客户统计</h4>
          </md-layout>
          <md-layout class="xlist">
            <md-layout class="oneCont" md-column md-flex="20"> 
              <div @click="jump('100310','100310','客户总数量')">
                <md-layout class="xtitle" md-align="center">客户总数量</md-layout>
                <md-layout class="num" md-align="center">{{sumkzcdic}}个</md-layout>
              </div>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="20">
              <div @click="jump('800303','800303','所有未联系客户')">
                <md-layout class="xtitle" md-align="center">所有未联系客户</md-layout>
                <md-layout class="num" md-align="center">{{sumwkcdic}}个</md-layout>
              </div>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="20">
              <div @click="jump('800305','800305','逾期待联系客户')">
                <md-layout class="xtitle" md-align="center">逾期待联系客户</md-layout>
                <md-layout class="num" md-align="center">{{sumdydcdic}}个</md-layout>
              </div>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="20">
              <div @click="jump('800307','800307','今天待联系客户')">
                <md-layout class="xtitle" md-align="center">今天待联系客户</md-layout>
                <md-layout class="num" md-align="center">{{sumjdcdic}}个</md-layout>
              </div>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="20">
              <div @click="jump('800309','800309','今天已联系客户')">
                <md-layout class="xtitle" md-align="center">今天已联系客户</md-layout>
                <md-layout class="num" md-align="center">{{sumjycdic}}个</md-layout>
              </div>
            </md-layout>
           
          </md-layout>
        </md-layout> 
        <md-layout md-column>
          <md-layout  class="dtitle">
            <h4>本月款项记录</h4>
          </md-layout>
          <md-layout class="xlist">
            <md-layout class="oneCont" md-column md-flex="25">
              <div @click="jump('400315','400315','成交合同数')">
                <md-layout class="xtitle" md-align="center">成交合同数</md-layout>
                <md-layout class="num" md-align="center">{{sumhtqty}}个</md-layout>
              </div>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="25">
              <div @click="jump('400315','400315','成交合同金额')">
                <md-layout class="xtitle" md-align="center">成交合同金额</md-layout>
                <md-layout class="num" md-align="center">{{sumhtfcy}}元</md-layout>
              </div>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="25">
              <div @click="jump('500510','500510','回款金额')">
                <md-layout class="xtitle" md-align="center">回款金额</md-layout>
                <md-layout class="num" md-align="center">{{sumhkfcy}}元</md-layout>
              </div>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="25">
              <div @click="jump('501010','501010','开票金额')">
                <md-layout class="xtitle" md-align="center">开票金额</md-layout>
                <md-layout class="num" md-align="center">{{sumhkfcy}}元</md-layout>
              </div>
            </md-layout> 
          </md-layout>
        </md-layout> 
      </div>

      <div class="listbox">
      
         <md-layout class="dtitle">
            <h4>预警信息</h4>
          </md-layout>
           <md-tabs md-left class="md-header">
              <md-tab  md-label="本月到期合同">
                  <md-table>
                      <md-table-row>
                        <md-table-head v-for="(item,index) in taskLayCel.cels" :key="index">{{item.labelString}}</md-table-head>
                      </md-table-row>

                      <md-table-row  v-for="(row, rowIndex) in taskValues" :key="rowIndex"  >
                        <md-table-cell v-for="(column, columnIndex) in taskLayCel.cels" :key="columnIndex">
                          <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :modal="row"></md-bip-ref>
                        </md-table-cell>
                      </md-table-row> 
                    </md-table>
              </md-tab>
             <md-tab  md-label="本月预签订列表">
                  <md-table>
                      <md-table-row>
                        <md-table-head v-for="(item,index) in taskLayCel2.cels" :key="index">{{item.labelString}}</md-table-head>
                      </md-table-row>
                      <md-table-row  v-for="(row, rowIndex) in taskValues2" :key="rowIndex"  >
                        <md-table-cell v-for="(column, columnIndex) in taskLayCel2.cels" :key="columnIndex">
                          <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :modal="row"></md-bip-ref>
                        </md-table-cell>
                      </md-table-row>
                    </md-table>
              </md-tab>
          </md-tabs>
      </div>
    </md-part-body>
  </md-part>
</template>
<script> 
import moment from "moment";
export default {
  data() {
    return {
       sumhtqty:'',
       sumhtfcy:'',
       sumhkfcy:'',
       sumkpfcy:'',
       sumkzcdic:'',
       sumwkcdic:'',
       sumdydcdic:'',
       sumjdcdic:'',
       sumjycdic:'',
       taskLayCel: {},
       taskValues: [],
       taskLayCel2: {},
       taskValues2: [],
    }
  },
  methods: {  
    async getCells() {
      let data1 = {  
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_AIDO, 
        page:1,
        assistid: "INDEXCONT",

        // cont:null, 
      };
      let res = await this.getDataByAPINewSync(data1);
      let data = res.data;
      this.sumhtqty=data.values[0].qty;
      this.sumhtfcy=data.values[1].qty;
      this.sumhkfcy=data.values[2].qty;
      this.sumkpfcy=data.values[3].qty;


      let data2 = {  
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_AIDO, 
        page:1,
        assistid: "INDEXCONT1",
        // cont:null, 
      };
      let res2 = await this.getDataByAPINewSync(data2);
      let data3 = res2.data;
      this.sumkzcdic=data3.values[0].qty;
      this.sumwkcdic=data3.values[1].qty;
      this.sumdydcdic=data3.values[2].qty;
      this.sumjdcdic=data3.values[3].qty;
      this.sumjycdic=data3.values[4].qty;
      console.log(data3)
    }, 
      // 点击跳转
    async jump(pbuid,pmenuid,title){
      this.$router.push(`/layoutui?pbuid=${pbuid}&pmenuid=${pmenuid}&title=${title}&othersys=1`)
    },
          // 本月到期合同
    async fetchTaskData() {
      var data_1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAM,
        'pcell': '400000',
        'pdata': '{brd:0,}',
        'bebill': 1,
        'currentPage': 1,
        'pageSize': 20,
        'cellid': ''
      }
      var res_1 = await this.getDataByAPINew(data_1);
      this.taskLayCel = await this.makeCellCL(res_1.data.data.layCels);
      this.taskValues = res_1.data.data.pages.celData;
    },
    async listForMoth() {
      var data_2 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAM,
        'pcell': '500000',
        'pdata': '{brd:0,}',
        'bebill': 1,
        'currentPage': 1,
        'pageSize': 20,
        'cellid': ''
      }
      var res_2 = await this.getDataByAPINew(data_2);
      this.taskLayCel2 = await this.makeCellCL(res_2.data.data.layCels);
      this.taskValues2 = res_2.data.data.pages.celData;
    },
  },
  computed: { 
  },
  mounted(){
    this.getCells();
    this.fetchTaskData();
    this.listForMoth()
  }
};
</script>

<style lang="scss" scoped>
.maxdiv{
  margin-top: 0px;
  margin-bottom: 0px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #F2F3F5!important;
}
.num{
  font-size: 28px;
  color: #f96868!important;
}
.xtitle{
  color: #455a64!important;
}
.dtitle{
  margin-bottom: 0px;
}
.xlist{
  background-color: #ffffff;
}
.oneCont{
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>