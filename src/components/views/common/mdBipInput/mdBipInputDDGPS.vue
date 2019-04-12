<template> 
<md-layout style="width:100%">
  <md-input-container v-if="gpsType=='getGPS'">
    <div class="md-input-ref layout layout-row" >
      <label>{{cell.labelString}}</label>
      <md-input :placeholder="cell.labelString" readonly v-model="modal[cell.id]" :required="cell.isReq"></md-input> 
      <md-button class="md-icon-button md-ref-filter" @click="openMAP()">
        <md-icon>pin_drop</md-icon>
      </md-button>
    </div>  
  </md-input-container> 
  <div class="md-input-ref layout layout-row"  v-else-if="gpsType=='showGPS'"> 
    <md-layout md-flex="85" class="margin0" style="min-height:24px">
      {{modal[cell.id]}}
    </md-layout>
    <md-layout md-flex="15" class="margin0" style="min-height:24px">
      <md-button class="md-icon-button md-ref-filter margin0" @click="openMAP()"  style="margin:0px">
        <md-icon  style="margin:0px;height:24px">pin_drop</md-icon>
      </md-button>
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
    }
  },
  created(){  
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
/* .md-layout{margin:0;} */
.md-button.md-icon-button{height: 0;}
.md-dialog-content:first-child{padding-top: 0;}
.md-input-container input{font-weight: 700;}
.classA{min-height:5rem;max-width:6rem;max-height: 5rem;min-width:6rem;}

/* .actionC{position: absolute;bottom:.1rem;right: .1rem} */
.contentC{margin-bottom: .7rem;padding-bottom: 0;}
.myimg{position: relative;width:10% !important;height: 10% !important;}
.imgClassA{overflow-y: auto;max-height: 3rem;overflow-x:hidden; }
@media screen and (min-width:300px) and (max-width:321px){
    .classB{min-height:1rem;max-height: 5rem;}
    .imgClassB{
        overflow-y: auto;max-height: 2.3rem;overflow-x: hidden;
    }
}
@media screen and (min-width:321px) and (max-width:361px){
    .classB{min-height:1rem;max-height: 5rem;}
    .imgClassB{
        overflow-y: auto;max-height: 2.8rem;overflow-x: hidden;
    }
}
@media screen and (min-width:362px) and (max-width:380px){
    .classB{min-height:1rem;max-height: 5rem;}
    .imgClassB{
        overflow-y: auto;max-height: 3.3rem;overflow-x: hidden;
    }
}
@media screen and (min-width:381px) and (max-width:412px){
    .classB{min-height:1rem;max-height: 6rem;}
    .imgClassB{
        overflow-y: auto;max-height: 3.8rem;overflow-x: hidden;
    }
}
@media screen and (min-width:413px){
    .classB{min-height:1rem;max-height: 6rem;}
    .imgClassB{
        overflow-y: auto;max-height: 4rem;overflow-x: hidden;
    }
}
.iClass{max-height: 1rem !important;min-height: 1rem !important;max-width: 1.1rem !important;}
.itemClass{max-height: .6rem;position: relative;width: 100%;}
.iconClass{padding-bottom: .2rem;color:#22bf22; }
/* .cancelClass{margin:0;padding: 0;min-width: .24rem;min-height: .24rem;} */
.mybtn{min-width: .4rem;min-height: .3rem;font-size: .12rem;line-height: .3rem;padding: 0; margin: 0px}
.md-gutter-8 .md-column > .md-layout{padding-bottom: 0;}
.cancelClass{position: absolute;bottom: .15rem;margin-left: .18rem;}
.checkClass{position: absolute;bottom: .15rem;margin-left: .18rem;color:#22bf22;}
.colClass{max-height: .6rem;line-height: .5rem;}
.margin0{margin: 0px;}
 
</style>



