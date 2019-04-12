<template>
    <md-layout md-flex ="100" md-column >
        <!-- <canvas class="canvas" :id="id"></canvas> --> 
        <!-- <md-layout  md-align="center" style="width:100%;margin: 0px;">
            <span style="    font-size: 10px;border-bottom: 1px solid;padding: 0px 10px;">倒计时</span>
        </md-layout> -->
        <!-- <md-layout  md-align="center" style="width:100%;margin: 0px;"> -->
            <!-- <span>{{content}}</span>   -->
        <!-- </md-layout> -->
        <!-- {{con}}&nbsp;&nbsp;&nbsp;{{hour}}<span>时</span>{{min}}<span>分</span>{{sec}}<span>秒</span> -->
        <md-layout md-flex ="100"  md-align="center":class="timeClass">
            {{content}}</span> 
        </md-layout>
        <md-layout md-align="start" class="timeoutimg">
            <template v-if="timeout">
                <img src="../../../img/timeDown/timeout.png">
            </template>   
        </md-layout> 
    </md-layout>
</template>
<script>
import down from './js/process.js'

  export default {
    mixins:[down],
    data(){
      return {
        content: '',
        hour:'',
        min :'',
        sec:'',
        timeClass:"timeClassA", 
        con:'',
        timeout:false,
        nowT:0,
      }
    },
    props:{
        endTime:{
            type: String,
            default :''
        },
        endText:{
            type : String,
            default:'已结束'
        },
        callback : {
            type : Function,
            default :''
        },
        id:{
            type:String,
            default:''
        }
    },
    mounted () {
        // let nowTime = new Date();
        // let endTime1 = new Date(this.endTime);
        // let t = endTime1.getTime() - nowTime.getTime();
        // let setting={   size: 130,            // 绘制圆形的最大尺寸，宽=高
        //                 borderWidth: 4,       // 边框宽度
        //                 borderColor:"#fff",   // 边框颜色
        //                 outerColor:"#fff",    // 最外层底圆颜色
        //                 scheduleColor:"#fff", // 进度条动画颜色
        //                 fontColor: "#fff",    // 字体颜色
        //                 ringColor: "#ffc720", // 进度条环形颜色
        //                 innerColor: "#4e84e5",// 最内圆底色
        //                 fontSize: 50,         //字体大小  
        //                 time: t/1000,         //时间 秒  
        //                 endTime:this.endTime, //结束时间
        //         }
        // this.init(setting);
        this.getsysTime();
        
    },
    methods: {
        countdowm(timestamp){ 
            if(!timestamp)
                return;
            let self = this;
            let timer = setInterval(function(){
                let timelong = 0;
                if(self.nowT !=0){
                    timelong = self.nowT;
                    self.nowT += 1000;
                }else{
                    let nowTime = new Date();
                    timelong = nowTime.getTime();
                }
                var arr = timestamp.split(/[- : \/]/);
                if(!arr[3])
                    arr[3] = "00"
                if(!arr[4])
                    arr[4] = "00"
                if(!arr[5])
                    arr[5] = "00"
                let endTime = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
                let t = endTime.getTime() -  timelong;
                if(t<0){
                    self.con = "已超时:";
                    self.timeout=true;
                    self.timeClass ='timeClassB';
                }else{
                    self.con = "倒计时:";
                    self.timeout=false;
                    self.timeClass ='timeClassA';
                }
                // alert(t);
                t = Math.abs(t);
                // if(t>0){
                    // let day = Math.floor(t/86400000);
                    // let hour=Math.floor((t/3600000)%24); 
                    let hour=Math.floor(t/3600000);
                    let min=Math.floor((t/60000)%60);
                    let sec=Math.floor((t/1000)%60); 
                    self.hour = hour < 10 ? "0" + hour : hour;
                    self.min = min < 10 ? "0" + min : min;
                    self.sec = sec < 10 ? "0" + sec : sec;
                    // let format = '';
                    // if(day > 0){
                    //     format = `${hour}时  :  ${min}分  :  ${sec}秒`;//${day}天 
                    // } 
                    // if(day <= 0 && hour > 0 ){
                    //     format = `${hour}  :  ${min}  :  ${sec}`; 
                    // }
                    // if(day <= 0 && hour <= 0){
                    //     format =`${min}  :  ${sec}`;
                    // }
                    // self.content = con+format;
                    self.content = `${self.con}`+' '+ `${self.hour}`+"时 "+`${self.min}`+"分 "+`${self.sec}`+"秒"
                // }else{
                //  clearInterval(timer);
                //  self.content = self.endText;
                //  self._callback();
                // }
                },1000);
            },
            _callback(){
            if(this.callback && this.callback instanceof Function){
            this.callback(...this);
            }
        },
        async getsysTime(){ 
            var data1 = {
                dbid: global.DBID,
                usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
                apiId: global.APIID_TIME, 
            };
            let res = await this.getDataByAPINewSync(data1)
            if(res.data.id == 0)
                this.nowT = res.data.data.data.time;
            this.countdowm(this.endTime);
        }
    }
}
</script>
<style lang="scss" scoped>
    .timeClassA{
        font-size: 18px;margin-bottom: 10px;color:green;
    }
    .timeClassB{
        font-size: 18px;margin-bottom: 10px;color:red;
    }
    .timeoutimg{
        position: absolute;
        left: 60%;
        top: .6rem; 
        width: 100px;
        height: 100px;
    }
</style>
