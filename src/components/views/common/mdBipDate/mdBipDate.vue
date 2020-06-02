<template>
  <!-- <div class="md-date md-input-ref layout-row">
    <input
      class="md-input"
      :id="dateID"
      ref="input"
      type="text"
      v-model="modal[cell.id]"
      :disabled="disabled"
      :required="required"
      :placeholder="placeholder"
      @focus="onFocus"
      @blur="onBlur"
      v-on:input="updateValue($event.target.value,true)"
      autocomplete="off"
    >
    <div md-menu-trigger v-on:click="dateIconClick" style="min-width: 0.1rem;max-width: 0.4rem;">
      <slot>
        <md-button class="md-icon-button" :disabled="disabled" v-if="!disabled">
          <md-icon>date_range</md-icon>
        </md-button>
      </slot>
    </div>
  </div> -->


  <md-input-container> 
    <div class="md-input-ref layout layout-row">
      <label>{{cell.labelString}}</label> 
      <md-input :id="dateID" ref="input" type="text" v-model="modal[cell.id]" :disabled="disabled" :required="required" :placeholder="placeholder" autocomplete="off"></md-input>
      <md-button class="md-icon-button md-ref-filter" id="upfile" @click="dateIconClick()" :disabled="disabled" >
        <md-icon>date_range</md-icon>
      </md-button>
    </div> 
  </md-input-container>
</template>

<script>
import common from "./common";
import billS from "../../classes/billState.js"
import getClosestVueParent from "../../../core/utils/getClosestVueParent";
import moment from "moment";
import mobildDate from "./mobileDate/datePicker.js";
export default {
  mixins: [common, mobildDate],
  props: {
    cell: null,
    isReport: null,
    modal:null,
  },
  data() {
    return {
      dateID: this._dateID(),
      checkVal: "",
      dateFomt: "YYYY-MM-DD",
      range: false,
      cc:"",
    };
  },
  watch: {
    value(){
      if(this.checkVal == '' ){
        this.checkVal = this.formattedValue(this.modal[this.cell.id]);
      }
      if(this.value != this.checkVal){
        this.formtDate();
        let cc = (this.cell.attr & billS.SINGLEVAL);
        if (this.isReport && cc<=0) {
          this.range = "~";
          if (this.value.indexOf("~") == -1) {
            this.checkVal = this.formattedValue("");
          }
        } else {
          this.checkVal = this.formattedValue(this.value);
        }
        this.oldValue = this.checkVal;
        this.updateValue(this.checkVal,false)
      } 
    }
  },
  methods: {
    _dateID() {
      var reg = new RegExp("\\.", "g");
      // console.log(this.cell.id)
      return this.cell.id.replace(/_/g, "").replace(reg, "");
    },
    dateIconClick() {
      let minDate;
      let maxDate;
      if(this.cell.chkRule){
        let chkRule = this.cell.chkRule;
        let khh = chkRule.indexOf("]");
        let khq = chkRule.indexOf("[");
        let piaohao = chkRule.indexOf("~");

        let id = chkRule.substring(khq+1,khh);
        if(khq<piaohao){//[]~在某个日期后
          minDate = this.modal[id]
        }else{//~[]在某个日期前
          maxDate = this.modal[id]
        }
      }
      var isPc = this.ISPC();
      if (isPc || this.range == "~") {
        jeDate("#" + this.dateID, {
          trigger: false,
          format: this.dateFomt,
          range: this.range,
          // isClear:false,
          theme: { bgcolor: "#2196F3", color: "#ffffff", pnColor: "#00CCFF" },
          minDate: minDate, //设定最小日期为当前日期
          maxDate: maxDate, //设定最大日期为当前日期
          donefun: obj => {
            this.checkVal = obj.val;
            this.updateValue(obj.val,false);
          },
          clearfun: function(elem, val) {
            this.updateValue("",false);
            this.checkVal = null;
          }
        });
      } else {
        this.pickerDate(
          "#" + this.dateID,
          this.dateFomt,
          this.success,
          this.error,
          maxDate,
          minDate,
        );
      }
    },
    success(checkVal) {
      this.checkVal = this.formattedValue(checkVal);
      this.updateValue(this.checkVal,false);
    },
    error() {
      this.checkVal = "";
      this.updateValue("",false);
    },
    formtDate() {
      // 文档地址:http://www.jemui.com/uidoc/jedate.html
      // 注意：zz 的含义 就是补全00
      // 例如 YYYY-MM-DD hh 得到的是 2017-05-02 10
      // 如果 YYYY-MM-DD hh:zz 得到的是 2017-05-02 10:00
      // 日期格式 可以随意组合，下面随意列出几种格式：
      // 1、 YYYY-MM-DD hh:mm:ss   或者   MM-DD-YYYY hh:mm:ss   或者   MM/DD/YYYY hh:mm:ss
      // 2、 YYYY-MM-DD hh:mm   或者   MM-DD-YYYY hh:mm   或者   MM/DD/YYYY hh:mm
      // 3、 YYYY-MM-DD hh   或者   MM-DD-YYYY hh   或者   MM/DD/YYYY hh
      // 4、 YYYY-MM-DD   或者   MM-DD-YYYY   或者   MM/DD/YYYY
      // 5、 YYYY-MM
      // 6、 YYYY
      // 7、 hh:mm:ss
      // 8、 hh:mm
      // 9、 hh
      // 10、 YYYY-MM-DD hh:zz
      // 11、 hh:zz
      // 规则  DATE、DATETIME、HS、H_S、H_SM、H_S_M、YM、Y-M
      //       DATE:2018-07-01
      //       DATETIME:2018-07-01 10:00:21
      //       HS:0510
      //       H_S:05:10
      //       H_S_M:01:01:01
      //       YM:201708
      //       Y-M:2017-08
      if (this.cell.editName == "DATE") {
        this.dateFomt = "YYYY-MM-DD";
      } else if (this.cell.editName == "DATETIME") {
        this.dateFomt = "YYYY-MM-DD hh:mm:ss";
      } else if (this.cell.editName == "HS") {
        this.dateFomt = "hh:mm";
      } else if (this.cell.editName == "H_S") {
        this.dateFomt = "hh:mm";
      } else if (this.cell.editName == "H_SM") {
        this.dateFomt = "hh:mm:ss";
      } else if (this.cell.editName == "YM") {
        this.dateFomt = "YYYYMM";
      } else if (this.cell.editName == "Y-M") {
        this.dateFomt = "YYYY-MM";
      } else if (this.cell.editName == "Y_m") {
        this.dateFomt = "YYYY-MM-DD hh:mm";
      }
    },
    updateValue(value,isgs) {
      // console.log(value)
      if (value == undefined) {
        value = "";
      }
      if (this.disabled) {
        return;
      }
      var formattedValue = value
      if(isgs){
        formattedValue = this.formattedValue(value);
      }      
      // if ( formattedValue !== value || this.$refs.input.value != formattedValue ) {
      //   this.checkVal = formattedValue;
      // }
      this.setParentValue(formattedValue);
      this.$emit("input", formattedValue);
      this.$emit("change", formattedValue);  
    },
    formattedValue(value) {
      if (this.range == "~") {
        return value;
      }
      if (value) {
        var format = this.dateFomt.replace("hh", "HH");
        value = moment(value).format(format);
        // console.log(value)
        // console.log(value.getTime())
        value = value + "";
        return value == "Invalid date" ? "" : value;
      }else{
        return "";
      }
    }
  },
  mounted() { 
    this.formtDate();
    let cc = (this.cell.attr & billS.SINGLEVAL);
    if (this.isReport && cc<=0) {
      this.range = "~";
      if (this.value.indexOf("~") == -1) {
        this.checkVal = this.formattedValue("");
        this.updateValue("",false);
      }
    } else {
      this.checkVal = this.formattedValue(this.modal[this.cell.id]);
    }
    // this.updateValue(this.checkVal,false)
    this.oldValue = this.checkVal;
  }
};
</script>
<style lang="scss" scope>
.jedate .jedate-content .daystable td .nolunar {
  line-height: 31px;
  font-size: 14px;
  font-family: Arial, "\5b8b\4f53", "sans-serif";
}




.gearYM,
.gearDate,
.gearDatetime,
.gearTime {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9900;
  overflow: hidden;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
.date_ctrl {
  vertical-align: middle;
  background-color: #d5d8df;
  color: #000;
  margin: 0;
  height: auto;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 9901;
  overflow: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
.slideInUp {
  animation: slideInUp 0.3s ease;
  -webkit-animation: slideInUp 0.3s ease;
}
// @-webkit-keyframes slideInUp {
//   from {
//     -webkit-transform: translate3d(0, 100%, 0);
//     transform: translate3d(0, 100%, 0);
//   }
//   to {
//     -webkit-transform: translate3d(0, 0, 0);
//     transform: translate3d(0, 0, 0);
//   }
// }
.ym_roll,
.date_roll,
.datetime_roll,
.time_roll {
  display: -webkit-box;
  width: 100%;
  height: auto;
  overflow: hidden;
  font-weight: bold;
  background-color: transparent;
  // -webkit-mask: -webkit-gradient(
  //   linear,
  //   0% 50%,
  //   0% 100%,
  //   from(#debb47),
  //   to(rgba(36, 142, 36, 0))
  // );
  // -webkit-mask: -webkit-linear-gradient(top, #debb47 50%, rgba(36, 142, 36, 0));
}
.ym_roll > div,
.date_roll > div,
.datetime_roll > div,
.time_roll > div {
  font-size: 1.45em;
  height: 6em;
  float: left;
  background-color: transparent;
  position: relative;
  overflow: hidden;
  -webkit-box-flex: 4;
}
.ym_roll > div .gear,
.date_roll > div .gear,
.datetime_roll > div .gear,
.time_roll > div .gear {
  width: 100%;
  float: left;
  position: absolute;
  z-index: 9902;
  margin-top: -6em;
}
.date_roll_mask {
  // -webkit-mask: -webkit-gradient(
  //   linear,
  //   0% 40%,
  //   0% 0%,
  //   from(#debb47),
  //   to(rgba(36, 142, 36, 0))
  // );
  // -webkit-mask: -webkit-linear-gradient(
  //   bottom,
  //   #debb47 50%,
  //   rgba(36, 142, 36, 0)
  // );
  padding: 1em 0 3em 0;
}  
.date_grid {
  position: relative;
  top: 2em;
  width: 100%;
  height: 2em;
  margin: 0;
  box-sizing: border-box;
  z-index: 0;
  border-top: 1px solid #abaeb5;
  border-bottom: 1px solid #abaeb5;
}
.date_grid > div {
  color: #000;
  position: absolute;
  right: 0;
  top: 0;
  font-size: 0.8em;
  line-height: 2.5em;
} 
.ym_roll > div .date_grid > div,
.time_roll > div .date_grid > div {
  right: 5em;
}
.date_btn {
  color: #0575f2;
  font-size: 1.6em;
  font-weight: bold;
  line-height: 1em;
  text-align: center;
  padding: 0.8em 1em;
}
.date_btn_box:before,
.date_btn_box:after {
  content: "";
  position: absolute;
  height: 1px;
  width: 100%;
  display: block;
  background-color: #96979b;
  z-index: 15;
  -webkit-transform: scaleY(0.33);
  transform: scaleY(0.33);
}
.date_btn_box {
  display: -webkit-box;
  -webkit-box-pack: justify;
  -webkit-box-align: stretch;
  background-color: #f1f2f4;
  position: relative;
}
.date_btn_box:before {
  left: 0;
  top: 0;
  -webkit-transform-origin: 50% 20%;
  transform-origin: 50% 20%;
}
.date_btn_box:after {
  left: 0;
  bottom: 0;
  -webkit-transform-origin: 50% 70%;
  transform-origin: 50% 70%;
}  
.ym_roll > div .gear,
.time_roll > div .gear {
  width: 100%;
  // text-indent: -70%;
} 
.tooth {
  height: 2em;
  line-height: 2em;
  text-align: center;
}
//var cssHtm='.gearYM,.gearDate,.gearDatetime,.gearTime{font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:10px;background-color:rgba(0,0,0,0.2);display:block;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9900;overflow:hidden;-webkit-animation-fill-mode:both;animation-fill-mode:both}.date_ctrl{vertical-align:middle;background-color:#d5d8df;color:#000;margin:0;height:auto;width:100%;position:absolute;left:0;bottom:0;z-index:9901;overflow:hidden;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.slideInUp{animation:slideInUp .3s ease;-webkit-animation:slideInUp .3s ease;}@-webkit-keyframes slideInUp{from{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.ym_roll,.date_roll,.datetime_roll,.time_roll{display:-webkit-box;width:100%;height:auto;overflow:hidden;font-weight:bold;background-color:transparent;-webkit-mask:-webkit-gradient(linear,0% 50%,0% 100%,from(#debb47),to(rgba(36,142,36,0)));-webkit-mask:-webkit-linear-gradient(top,#debb47 50%,rgba(36,142,36,0))}.ym_roll>div,.date_roll>div,.datetime_roll>div,.time_roll>div{font-size:2.3em;height:6em;float:left;background-color:transparent;position:relative;overflow:hidden;-webkit-box-flex:4}.ym_roll>div .gear,.date_roll>div .gear,.datetime_roll>div .gear,.time_roll>div .gear{width:100%;float:left;position:absolute;z-index:9902;margin-top:-6em}.date_roll_mask{-webkit-mask:-webkit-gradient(linear,0% 40%,0% 0%,from(#debb47),to(rgba(36,142,36,0)));-webkit-mask:-webkit-linear-gradient(bottom,#debb47 50%,rgba(36,142,36,0));padding:0 0 3em 0}.date_roll>div:nth-child(2){-webkit-box-flex:2}.date_roll>div:nth-child(1),.datetime_roll>div:nth-child(1){-webkit-box-flex:4}.datetime_roll>div:first-child{-webkit-box-flex:6}.datetime_roll>div:last-child{-webkit-box-flex:6}.date_grid{position:relative;top:2em;width:100%;height:2em;margin:0;box-sizing:border-box;z-index:0;border-top:1px solid #abaeb5;border-bottom:1px solid #abaeb5}.date_grid>div{color:#000;position:absolute;right:0;top:0;font-size:.8em;line-height:2.5em}.date_roll>div:nth-child(3) .date_grid>div{left:42%}.datetime_roll>div .date_grid>div{right:0}.datetime_roll>div:first-child .date_grid>div{left:auto;right:0%}.datetime_roll>div:last-child .date_grid>div{left:50%}.time_roll>div:nth-child(1) .date_grid>div{right:1em}.ym_roll>div:nth-child(1) .date_grid>div{right:.1em}.ym_roll>div .date_grid>div,.time_roll>div .date_grid>div{right:5em}.date_btn{color:#0575f2;font-size:1.6em;font-weight:bold;line-height:1em;text-align:center;padding:.8em 1em}.date_btn_box:before,.date_btn_box:after{content:"";position:absolute;height:1px;width:100%;display:block;background-color:#96979b;z-index:15;-webkit-transform:scaleY(0.33);transform:scaleY(0.33)}.date_btn_box{display:-webkit-box;-webkit-box-pack:justify;-webkit-box-align:stretch;background-color:#f1f2f4;position:relative}.date_btn_box:before{left:0;top:0;-webkit-transform-origin:50% 20%;transform-origin:50% 20%}.date_btn_box:after{left:0;bottom:0;-webkit-transform-origin:50% 70%;transform-origin:50% 70%}.date_roll>div:nth-child(1) .gear{text-indent:20%}.date_roll>div:nth-child(2) .gear{text-indent:-20%}.date_roll>div:nth-child(3) .gear{text-indent:-55%}.datetime_roll>div .gear{width:100%;text-indent:-25%}.datetime_roll>div:first-child .gear{text-indent:-10%}.datetime_roll>div:last-child .gear{text-indent:-50%}.ym_roll>div .gear,.time_roll>div .gear{width:100%;text-indent:-70%}.ym_roll>div:nth-child(1) .gear,.time_roll>div:nth-child(1) .gear{width:100%;text-indent:10%}.tooth{height:2em;line-height:2em;text-align:center}';
</style>
