<template> 
  <md-part>
    <md-part-body style="  background-color: #F2F3F5!important;"> 
      <div  class="maxdiv" >
        <md-layout md-column>
          <md-layout class="dtitle">
            <h4>客户统计</h4>
          </md-layout>
          <md-layout class="xlist">
            <md-layout class="oneCont" md-column md-flex="15"> 
              <md-layout class="xtitle" md-align="center">客户总数量</md-layout>
              <md-layout class="num" md-align="center">3个</md-layout>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="15">
              <md-layout class="xtitle" md-align="center">所有未联系客户</md-layout>
              <md-layout class="num" md-align="center">3个</md-layout>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="15">
              <md-layout class="xtitle" md-align="center">逾期待联系客户</md-layout>
              <md-layout class="num" md-align="center">3个</md-layout>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="15">
              <md-layout class="xtitle" md-align="center">今天待联系客户</md-layout>
              <md-layout class="num" md-align="center">3个</md-layout>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="20">
              <md-layout class="xtitle" md-align="center">今天已联系客户</md-layout>
              <md-layout class="num" md-align="center">3个</md-layout>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="20">
              <md-layout class="xtitle" md-align="center">今天新创建和分配客户</md-layout>
              <md-layout class="num" md-align="center">3个</md-layout>
            </md-layout> 
          </md-layout>
        </md-layout> 
        <md-layout md-column>
          <md-layout  class="dtitle">
            <h4>本月款项记录</h4>
          </md-layout>
          <md-layout class="xlist">
            <md-layout class="oneCont" md-column md-flex="25">
              <md-layout class="xtitle" md-align="center">成交合同数</md-layout>
              <md-layout class="num" md-align="center">3个</md-layout>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="25">
              <md-layout class="xtitle" md-align="center">成交合同金额</md-layout>
              <md-layout class="num" md-align="center">3个</md-layout>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="25">
              <md-layout class="xtitle" md-align="center">回款金额</md-layout>
              <md-layout class="num" md-align="center">3个</md-layout>
            </md-layout>
            <md-layout class="oneCont" md-column md-flex="25">
              <md-layout class="xtitle" md-align="center">开票金额</md-layout>
              <md-layout class="num" md-align="center">3个</md-layout>
            </md-layout> 
          </md-layout>
        </md-layout> 
      </div>
    </md-part-body>
  </md-part>
</template>
<script> 
import moment from "moment";
export default {
  data() {
    return {
       
    }
  },
  methods: {  
    async getCells() {
      let data1 = {  
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_AIDO, 
        page:1,
        assistid: null,
        cont:null, 
      };
      let res = await this.getDataByAPINewSync(data1);
      let data = res.data;
         
    },  
  },
  computed: { 
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

