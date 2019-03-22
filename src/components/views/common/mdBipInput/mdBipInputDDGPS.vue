<template>
    <md-input-container>  
      <div class="md-input-ref layout layout-row">
        <label>{{cell.labelString}}</label>
        <md-input :placeholder="cell.labelString" readonly v-model="modal[cell.id]"></md-input> 
        <md-button class="md-icon-button md-ref-filter" id="upfile" @click="openDDMap()">
          <md-icon>pin_drop</md-icon>
        </md-button>
      </div> 
    </md-input-container>
</template>

<script>
import dd from '../../../../../static/dingding/dingtalk.open.js';
import axios from "axios";
import comm from './modal.js';
export default {
  data() {
    return { 
    };
  },
  mixins:[comm],
  watch:{ 
  },
  methods: {
    //打开钉钉地图
    openDDMap(){  
      let _this = this;
      dd.biz.map.locate({ 
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

 
</style>



