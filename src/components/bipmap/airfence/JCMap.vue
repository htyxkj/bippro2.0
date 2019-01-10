<template>
    <md-layout md-gutter md-column class="mapbody">
        <md-layout md-gutter md-row>
            <md-layout md-flex-small="100" md-flex="100">
                <md-card class="mapcard">
                    <div class="mapdiv"> 
                        <div id="container"></div>
                        </div>
                </md-card>
                <md-loading :loading="loading"></md-loading>
            </md-layout> 
        </md-layout>
    </md-layout>
</template>

<script>
import qs from 'qs'
import axios from 'axios'
import mapoptions from './mapoptions.js'
import LuShu from '../js/baiduMap.js'
import common from './common.js'
const LINE_COLOR = common.LINE_COLOR
const LINE_WEIGHT = common.LINE_WEIGHT
const LINE_OPACITY = common.LINE_OPACITY
const AREA_COLOR = common.AREA_COLOR
const AREA_WEIGHT = common.AREA_WEIGHT
const AREA_OPACITY =common.AREA_OPACITY
const AREA_FILLCOLOR = common.AREA_FILLCOLOR
const AREA_FILLOPACITY = common.AREA_FILLOPACITY
export default {
    
    mixins:[mapoptions,LuShu],
   
    data() {
        return {
            map: {},
            points: [],
            yellowpoint: [],
            redpoint: [],
            i: 0,
            //定时器
            plane: null,
            clientHeight: '',
            loading: 0,
            planeno: '',
            taskno: '',
            mybtnpc:'mybtnpc',
            mybtn:'mybtn',
            snkey:'',
            taskErr:'',//参数信息
            yeallowlin:[],
            redlin:[],
            taskname:"",
        }
    }, 
    mounted() { 
        this.baiduMap()
        this.setHeight()
        window.onresize = () => {
            this.clientHeight = document.body.clientHeight
        }
        this.snkey= JSON.parse(window.sessionStorage.getItem('snkey'))
        this.map.centerAndZoom(new BMap.Point(103.388611,53.563611), 5);
        var b = require('js-base64').Base64;
        let user = b.decode(this.$route.query.user);
        let taskno = b.decode(this.$route.query.task);
        let start = b.decode(this.$route.query.stTime);
        let end = b.decode(this.$route.query.endTime); 
        this.getTim(user,taskno,start,end);
    }, 
    methods: {  
        getTim(planeno, taskno, start, end) {
            this.i=0;
            this.loading = 1
            this.points=[];
            //清楚飞机覆盖物 
            this.map.removeOverlay(this.plane);
            //获取轨迹 用户标识，任务标识，开始时间，结束时间
            this.creatLin(planeno, taskno, start, end);
            //获取异常信息参考值
            this.getError(taskno);
           //作业区，避让点
           this.getAreaPoint(taskno);
        },
        setHeight() {
            this.clientHeight = document.body.clientHeight
            document.getElementById('container').style.height = (this.clientHeight - 90) + 'px'
        }, 
        //划线
        creatLin(planeno, taskno, start, end){
            let params = {snkey:this.snkey,method:215,taskNo:taskno,userNumber:planeno,startTime:start,endTime:end}
            axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
            .then(res=>{
                console.log(res.data)
                for(var i in res.data){
                    var data = res.data[i];
                    var _point = { pt:new BMap.Point(data.lng,data.lat), planeId: data.planeId, taskName: data.taskName, flow: data.flow, height: data.height, speed: data.speed,ssflow:data.ssflow,time:data.speedTime }
                    if(_point.ssflow>0){
                        this.yellowpoint.push(_point);
                        if(this.redpoint.length>0){
                            this.redlin.push(this.redpoint);
                            this.redpoint=[];
                        }
                    }
                    if(_point.ssflow<=0){
                        this.redpoint.push(_point);
                        if(this.yellowpoint.length>0){
                            this.yeallowlin.push(this.yellowpoint);
                            this.yellowpoint=[];
                        }
                    }
                    this.points.push(_point) 
                }
                if(this.yellowpoint.length>0){
                    this.yeallowlin.push(this.yellowpoint);
                    this.yellowpoint=[];
                }
                if(this.redpoint.length>0){
                    this.redlin.push(this.redpoint);
                    this.redpoint=[];
                }
                this.LuShu(this.map,this.points,'#CACACA',true)
                for(var i in this.yeallowlin){ 
                    this.DrawAirStripsSprayingSpan(this.taskErr.widcloth,this.yeallowlin[i]);
                    this.LuShu(this.map,this.yeallowlin[i],'#FCFF2B',false)
                }
                for(var i in this.redlin){
                    this.LuShu(this.map,this.redlin[i],'red',false)
                }
                this.loading=0;
                this.map.addEventListener("zoomend", this.getCenterAndZoom);
                //添加 飞机图标 已经数据信息
                var d = this.points[this.points.length-1]
                var icon = new BMap.Icon(require('@/img/map/airfence/cplane.png'), new BMap.Size(30, 30), { imageOffset: new BMap.Size(1, 1) }) 
                
                if(`${d.taskName}`!=""){
                    this.taskName = `任务名称:${d.taskName}\n`;
                }
                var title = this.taskName+`用户标识:${d.planeId}\n`+`当前时间:`+d.time;
                var marker = new BMap.Marker(d.pt, {icon:icon, title: title })
                this.map.addOverlay(marker)

                var d0 = this.points[0]
                var title0 = this.taskName+`用户标识:${d0.planeId}\n`+`当前时间:`+d0.time;
                var marker0 = new BMap.Marker(d0.pt, {icon:icon, title: title0 })
                this.map.addOverlay(marker0)
            })
            .catch(err=>{
                console.log(err)
            })
        },

        //获取预警信息
        getError(taskno){
            console.log(taskno)
            let params = {snkey:this.snkey,method:208,taskNo:taskno}
            axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
            .then(res=>{
                console.log(res.data)
                this.taskErr = res.data;
                this.setDISTANCE(this.taskErr.widcloth);//设置幅宽
                console.log("设置幅宽",this.taskErr.widcloth)
            })
            .catch(err=>{
                console.log(err)
            })
        },

        //多边形覆盖区域 以及避让点
        getAreaPoint(taskno){
            let params = {snkey:this.snkey,method:205,taskNo:taskno}
            axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
            .then(res=>{
                this.drawArea(res.data)
            })
            .catch(err=>{
                console.log(err)
            })
        },
        //多边形覆盖区域 以及避让点
        drawArea(data){ 
            var icon = new BMap.Icon(require('@/img/map/airfence/birang.png'), new BMap.Size(15, 15), { imageOffset: new BMap.Size(1, 1) })
            for(var i=0;i<data.length;i++){
                let area = []
                //作业区域
                var listQY = data[i].listQY;
                for(var j =0;j<listQY.length;j++){
                    var _zb=listQY[j];
                    area.push(new BMap.Point(parseFloat(_zb[0]),parseFloat(_zb[1])))
                }
                var polygon = new BMap.Polygon(area, { strokeColor: AREA_COLOR, strokeWeight: AREA_WEIGHT, strokeOpacity: AREA_OPACITY,fillColor:AREA_FILLCOLOR,fillOpacity:AREA_FILLOPACITY })
                this.map.addOverlay(polygon)
 
                let br = []
                //避让点
                var listBR = data[i].listBR;
                for(var j =0;j<listBR.length;j++){
                    var _zb=listBR[j];
                    br.push(new BMap.Point(parseFloat(_zb[0]),parseFloat(_zb[1])))
                }
                var brpolygon = new BMap.Polygon(br, { strokeColor: "#EB312C", strokeWeight: AREA_WEIGHT, strokeOpacity: 0.5,fillColor:"#EB312C",fillOpacity:AREA_FILLOPACITY })
                this.map.addOverlay(brpolygon)  
            }
        },
    },
    watch: {
        'clientHeight': function() {
            this.setHeight()
        },
    }
}
</script>

<style lang="scss" scoped>
.cardList{
    display: block;
    background-color: #f4f4f4 !important;
    ul{
        padding: 0;
    }
    ul li{
        list-style-type: none;
        margin-top:.1rem;
        height: .5rem;
        padding-left:.1rem;
        padding-top:.1rem;
        background-color: #fff;
        &:nth-child(1){
          margin-top: 0;
        }
    }
    .list-icon{
        color: #f23378;
    }
}
.mapbody{
    background-color:#f4f4f4;
}
.md-layout{
    margin: 0;
}
.md-card {
    margin: 0.15rem;
    margin-left:0;
}
.mapcard{
    margin-left: .15rem;
}
@media (max-width: 600px) {
    .md-card {
        margin: 0;
    }
}

#container {
    height: 100%;
    width: 100%;
}

.md-button {
    margin-left: .12rem;
    margin-right: 0;
}

.md-checkbox {
    margin: 0.06rem 0.04rem;
    min-height: .3rem;
    padding-top: 0.06rem;
}

.mapdiv {
    position: relative;
    height: 100%;
    z-index:0;
}

.mybtnpc {
    position: absolute;
    top: .1rem;
    left: .52rem;
    z-index: 1;
}
.mybtn{
    position: absolute;
    top: .1rem;
    left: .1rem;
    z-index: 1;
}

.row2 {
    position: absolute;
    left: 16px;
    top: 40px;
}

.myspan {
    color: #2196f3;
    margin-left: .05rem;
}

.md-theme-default.md-button:not([disabled]).md-primary.md-raised,
.md-theme-default.md-button:not([disabled]).md-primary.md-fab {
    background-color: #FBFBFB;
    color: #3D6DCC;
    border: 1px solid #929191;
}
.mycard{
    margin-bottom: 0;
    overflow: hidden;
    display: flex;
    .listTitle{
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        background-color: #f23378;
        height: 100%;
        color:#fff;
        font-size: 18px;
        padding-top:.1rem;
        padding-left:.15rem;
        font-weight: 540;
        letter-spacing: 1px;
    }
}

</style>

