<template> 
<md-layout style="width:100%;margin:0px" md-flex="100">
  <md-input-container v-if="gpsType=='getGPS'">
    <div class="md-input-ref layout layout-row" >
      <label>{{cell.labelString}}</label>
      <md-input readonly v-model="modal[cell.id]" :required="cell.isReq" :disabled="disabled"></md-input> 
      <md-button class="md-icon-button md-ref-filter" @click="openMAP()" :disabled="disabled">
        <md-icon>pin_drop</md-icon>
      </md-button>
    </div>  
  </md-input-container>  

  <div class="layout layout-row margin0"  style="width:100%" md-flex="100" v-else-if="gpsType=='showGPS'"> 
    <md-layout md-flex="85" class="margin0" >
      {{modal[cell.id]}}　
    </md-layout>
    <md-layout md-flex="15" class="margin0" style="max-height:24px">
      <div @click="openMAP()">
        <md-icon class="md-icon-button" style="margin:0px;height:24px" >pin_drop</md-icon> 
      </div> 
    </md-layout>
  </div>
</md-layout>
</template>

<script>
import dd from '../../../../../static/dingding/dingtalk.open.js';
import axios from "axios";
import comm from './modal.js';
export default {
  data() {
    return { 
      longitude:null,
      latitude:null,
      title:'',
      corpId:"",
      agentId:"",
      ddCfg:null,
    };
  },
  mixins:[comm],
  props: {gpsType:{default:'getGPS'}},
  watch:{ 
  },
  methods: {
    openMAP(){ 
      if(this.gpsType == 'getGPS'){
        this.openDDMap();
      }else if(this.gpsType == 'showGPS'){
        this.showAddress();
        // this.openDDMap();
      }
    },
    //打开钉钉地图
    openDDMap(){  
      let _this = this;
      if(this.modal.map_root&&this.modal.map_root!=''){
        let  gps = this.modal.map_root.split(";");
        if(gps.length==2){
          this.longitude = gps[0];
          this.latitude = gps[1];
        }
      } 
      if(this.latitude !=null && this.longitude !=null){
          dd.biz.map.locate({ 
            latitude: _this.latitude, // 纬度，非必须
            longitude: _this.longitude, // 经度，非必须
            onSuccess: function (result) {   
              let address = result.province+result.city+result.adName+result.snippet
              let lgt = result.longitude+";"+result.latitude
              _this.gpsOk(address,lgt);
              /* result 结构 */
              // {
              //     province: 'xxx', // POI所在省会，可能为空
              //     provinceCode: 'xxx', // POI所在省会编码，可能为空
              //     city: 'xxx', // POI所在城市，可能为空
              //     cityCode: 'xxx', // POI所在城市，可能为空
              //     adName: 'xxx', // POI所在区名称，可能为空
              //     adCode: 'xxx', // POI所在区编码，可能为空
              //     distance: 'xxx', // POI与设备位置的距离
              //     postCode: 'xxx', // POI的邮编，可能为空
              //     snippet: 'xxx', // POI的街道地址，可能为空
              //     title: 'xxx', // POI的名称
              //     latitude: 39.903578, // POI的纬度
              //     longitude: 116.473565, // POI的经度
              // }
            },
            onFail: function (err) {
              alert(JSON.stringify(err)); 
            }
          });
      }else{
          dd.biz.map.locate({  
            onSuccess: function (result) {   
              let address = result.province+result.city+result.adName+result.snippet
              let lgt = result.longitude+";"+result.latitude
              _this.gpsOk(address,lgt); 
            },
            onFail: function (err) {
              alert(JSON.stringify(err)); 
            }
          });

      }
    }, 
    //展示位置
    showAddress(){
      let _this = this;
      if(this.modal.map_root){
        let  gps = this.modal.map_root.split(";");
        this.longitude = gps[0];
        this.latitude = gps[1];
      }
      this.title = this.modal.map_name;
      dd.biz.map.view({
        latitude: _this.latitude, // 纬度
        longitude:_this.longitude, // 经度
        title: _this.title // 地址/POI名称
      });

    },
    ddgeolocation(){
      dd.device.geolocation.get({
          withReGeocode : false,
          useCache:true, //默认是true，如果需要频繁获取地理位置，请设置false
          onSuccess : function(result) {
              /* 高德坐标 result 结构
              {
                longitude : Number,
                latitude : Number, 
              }
              */
          },
          onFail : function(err) {}
      });
    },
    gpsOk(address,gps){
      this.$set(this.modal,this.cell.id,address);
      this.$set(this.modal,'map_root',gps);
      this.dataCC(address,gps);
    },
    dataCC(value,gps) { 
      var refBackData = {
        cellId: this.cell.id,
        value: value,
        oldValue:this.oldValue,
        multiple: false
      };
      if (value !== this.oldValue) {
        this.$emit("change", refBackData);
        var refBackDatagps = {
          cellId: 'map_root',
          value: gps,
          oldValue:'',
          multiple: false
        };
        this.$emit("change", refBackDatagps);
      } 
    },
    async getDDJSTicket(){ 
      let ddConfig = JSON.parse(window.sessionStorage.getItem('ddConfig'));  
      if(!ddConfig)
          return;
      let url =encodeURIComponent(window.location.href); 
      
      this.corpId = ddConfig["corpId"];
      this.agentId = ddConfig["agentId"]; 
      let bipAppid = ddConfig["bipAppid"]; 
      var data = {
          apiId: global.APIID_DDJSAPI_TICKET,
          dbid: global.DBID, 
          url:url, 
          agentId:this.agentId, 
          corpId:this.corpId,
          bipAppid:bipAppid,
      }  
      var res = await this.getDataByAPINew(data); 
      if(res.data.id != undefined){ 
          if(res.data.id == 0){
          this.ddCfg = JSON.parse(res.data.message); 
          let _this= this;  
          dd.ready(function() { 
              dd.runtime.permission.requestAuthCode({
                  corpId: _this.corpId,
                  onSuccess: function(info) {
                      dd.config({
                          agentId: _this.agentId, // 必填，微应用ID
                          corpId: _this.corpId,//必填，企业ID
                          timeStamp:_this.ddCfg.timeStamp, // 必填，生成签名的时间戳
                          nonceStr: _this.ddCfg.nonceStr, // 必填，生成签名的随机串
                          signature: _this.ddCfg.DDJSTICKET, // 必填，签名
                          type:0,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
                          jsApiList : [
                              'biz.map.locate',
                              'biz.map.view',
                              'device.geolocation.get',
                              'device.geolocation.start',
                              'device.geolocation.stop',
                              'biz.map.search',
                          ] // 必填，需要使用的jsapi列表，注意：不要带dd。
                      }); 
                  },
                  onFail : function(err) {
                      alert('dd error: ' +JSON.stringify(error));
                  }
              });
          }); 
          dd.error(function(error){ 
              alert('dd error: ' +JSON.stringify(error));
          });
          } 
      } 
    }
  },
  async created(){  
    await this.getDDJSTicket();
  },
  mounted(){ 
    if(this.cell){
      if(this.cell.c_par){
        var ii = _.findIndex(this.cell.c_par.cels,item=>{
          return item.id === 'fj_root';
        }) 
        if(ii>=0){
          this.bfjRoot = true;
        }else{
          this.bfjRoot = false;
        }
      }
    }
  }
};
</script>

<style scoped> 
.margin0{
  margin: 0px;
  word-break: break-all;
} 
</style>



