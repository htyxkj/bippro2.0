<template>
    <md-layout md-gutter md-column class="mapbody">
        <md-layout md-gutter md-row>
            <md-layout md-flex-small="100" :md-flex="map_flex">
                <md-card class="mapcard">
                    <div class="mapdiv">
                        <div :class="ISPC()?mybtnpc:mybtn">
                            <md-layout md-row>
                                <md-layout> 
                                    <md-button class="md-primary md-raised md-icon-button" @click="reply" :disabled="replydis">
                                        <md-icon>reply</md-icon>
                                        <md-tooltip md-direction="right">返回</md-tooltip>
                                    </md-button>
                                    <md-button class="md-primary md-raised md-icon-button" @click="refresh">
                                        <md-icon>refresh</md-icon>
                                        <md-tooltip md-direction="right">刷新</md-tooltip>
                                    </md-button>
                                </md-layout>
                            </md-layout>
                            <md-layout md-row class="row2">
                                <md-switch v-model="switchm" id="switchm" name="switchm" class="md-primary">
                                    <span class="myspan">画面跟随</span>
                                </md-switch>
                            </md-layout>
                        </div>
                        <div id="container"></div>
                    </div>
                </md-card>
                <md-loading :loading="loading"></md-loading>
            </md-layout>
            <md-layout md-flex-small="100" md-flex="25" md-column v-if="right_list" >
                <!-- 仪表盘 -->
                 <md-layout md-flex="25">
                    <md-card class="mycard"> 
                        <echarts-gauge :gaugeseries="gaugeseries" ></echarts-gauge> 
                    </md-card>
                </md-layout>
                <!-- 流量 -->
                <md-layout md-flex="25">
                    <md-card class="mycard">
                        <echarts-flow-line :lineseries="plane_ssflow"></echarts-flow-line>
                    </md-card>
                </md-layout>
                <!-- 高度 -->
                <md-layout md-flex="25">
                    <md-card class="mycard">
                        <echarts-height-line :lineseries="plane_height"></echarts-height-line>
                    </md-card>
                </md-layout> 
                <md-layout md-flex="25">
                    <md-card class="cardList">
                        <ul>
                            <li>{{speedErr}}</li> 
                            <li>{{ssflowErr}}</li>
                            <li>{{hegihtErr}}</li>   
                        </ul>
                    </md-card>
                </md-layout>
            </md-layout>
        </md-layout>
    </md-layout>
</template>

<script>
import qs from 'qs'
import axios from 'axios'
import LuShu from '../js/baiduMap.js' 
import mapoptions from './mapoptions.js'
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
    mounted() { 
        //设置速度，喷雾压力 
        let usrCode = JSON.parse(window.sessionStorage.getItem('user')).userCode
        if(usrCode == 'admin'){
        this.cmcCode =2;
        }else{
        this.cmcCode = usrCode.substring(0,6)
        }
        this.snkey = JSON.parse(window.sessionStorage.getItem('snkey'))
        //清覆盖物，初始化数据
        this.clear()
        this.baiduMap()
        this.map.centerAndZoom(new BMap.Point(103.388611,53.563611), 5); 
        this.setHeight()
        window.onresize = () => {  
            this.setHeight()
        }
        this.loading=1;
        this.getAllPoints()

    }, 
    destroyed(){
        this.isShowHX=false;
    },
    data() {
        return {
            map: {},
            points: [],
            markers: [],
            i: 0,
            //定时器
            timer: null,
            timer1: null,
            plane: null,
            clientHeight: '',
            switchm: true,
            loading: 0,
            planeno: '',
            taskno: '',
            gaugeseries:[],//仪表盘
            plane_height:[],//海拔折线图
            plane_ssflow:[],//高度折线图
            replysta:true,
            replydis:true,
            mybtnpc:'mybtnpc',
            mybtn:'mybtn',
            cmcCode : '',
            snkey:'',
            taskErr:null, //任务预警值\
            
            speedErr:'',
            ssflowErr:'',
            hegihtErr:'', 
            time:'',
            isShowHX:true, 

            taskName:"",//任务名称
            taskNo:"",//任务名称
            poinLin1:[],//红色线点集合
            polylineRED:null,//红色线
            whitearrPois:[],//白色喷洒线集合
            polyline_range:null,//白色喷洒线  

            yellowPois:[],//黄色喷洒线集合
            polylineYellow:null,//黄色线

            map_flex:100,//地图宽度
            right_list:false,//右侧列表
        }
    },
    methods: {
        //清除数据
        clear() {
            this.plane = null
            this.points = []
            this.gaugeseries = []
            this.plane_ssflow = []
            this.plane_height = []
            this.replydis = true
            this.replysta = true
            this.i = 0
            if (this.timer) {
                clearTimeout(this.timer)
            } 
            if (this.timer1) {
                clearTimeout(this.timer1)
            } 
            this.gaugeseries = [] 
            this.gaugeseries.push(0)
            this.gaugeseries.push(0)  

            this.whitearrPois=[];
            this.polyline_range=null;
            this.poinLin1=[];//红色线点集合
            this.polylineRED=null

            this.polylineYellow=null;
            this.yellowPois=[];      
        },
        //刷新
        refresh(){
            this.reply();
        }, 
        //返回
        reply(){
            this.map_flex=100;
            this.right_list=false
            this.isShowHX=false;
            this.clear() 
            this.map.clearOverlays()
            
            this.baiduMap()
            this.loading=1;
            this.getAllPoints() 
        },
        //设置地图高度
        setHeight() {
            this.clientHeight = document.body.clientHeight
            document.getElementById('container').style.height = (this.clientHeight - 90) + 'px'
        }, 
        //设置地图缩放比例
        setZoom(bPoints) {
            var view = this.map.getViewport(eval(bPoints));
            var mapZoom = view.zoom;
            var centerPoint = view.center;
            this.map.centerAndZoom(centerPoint, mapZoom);
        }, 
        //点击飞机 获取单个飞机详细信息
        websocketInit(planeno, taskno,taskName) {
            this.speedErr=''
            this.ssflowErr=''
            this.hegihtErr=''
            this.map_flex=75;
            this.right_list=true 
            this.time='';
            console.log(planeno)
            this.points=[];
            this.isShowHX=true;
            if(taskno!=""){
                this.quyuBR(taskno)
                this.getError(taskno)
            } 
            this.taskno=taskno;
            this.taskName=taskName;
            //清除地图上的数据
            this.map.clearOverlays()
            this.map.addEventListener("zoomend", this.getCenterAndZoom);
            this.getPointList(planeno); 
        },
        //获取实时数据
        getPointList(planeno){ 
            let params = {snkey:this.snkey,method:219,userNumber:planeno,startTime:this.time}
            axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
            .then(res=>{
                if(res.data.length>0){ 
                    for(var i=0;i<res.data.length;i++){
                        if(this.isShowHX==false){
                            return;
                        }
                        let e = res.data[i]; 
                        var _point = {pt:new BMap.Point(e.lng, e.lat),lng: e.lng, lat:e.lat, planeId: e.planeId, flow: e.flow, height: e.height, speed: e.speed,ssflow:e.ssflow,speedtime:e.speedTime}
                        this.points.push(_point);
                        var date = new Date(e.speedTime);
                        this.time = date.getTime()/1000;
                    }
                }else{
                    if(this.isShowHX==false){
                        return;
                    }
                    // this.time = '';
                }
                console.log(res.data.length)
                this.timer1 = setTimeout(() => {
                    this.getPointList(planeno)
                }, 4000); 
            })
            .catch(err=>{
                console.log(err)
            })
        },
        //加载飞机轨迹
        drawPointLine(asidType) {  
            let sTime = new Date().getTime();
            if(this.isShowHX==false){
                return
            }
            this.loading = 0;
            if(this.points.length==0||this.points.length==this.i+1){
                setTimeout(this.drawPointLine, 1000)
                return;
            }
            
            if(this.i==0){
                this.loadPlane(asidType)
            }
             if (this.i == 0) {
                //第一次进入设置放大级别16 
                this.map.setZoom(16)
            }
            if(this.points[this.i].ssflow<=0){
                this.points[this.i].ssflow=0;
            }
            // this.poinLin1.push(this.points[this.i].pt) 
            // if(this.i==0){
            //     this.polylineRED = new BMap.Polyline(this.poinLin1, { strokeColor: 'red', strokeWeight: LINE_WEIGHT, strokeOpacity: LINE_OPACITY })
            // }else{
            //     this.polylineRED.setPath(this.poinLin1);
            // }
            // this.map.addOverlay(this.polylineRED);
            //设置弄药喷洒带
            if(this.points[this.i].ssflow>0){
                if(this.polyline_range==null){
                    this.polyline_range = new BMap.Polyline(this.whitearrPois, {strokeColor: '#339933',strokeWeight:1, strokeOpacity:0.3,enableClicking:false})//, strokeOpacity:0.5
                }
                if(this.polylineYellow ==null){
                    this.polylineYellow = new BMap.Polyline(this.yellowPois, {strokeColor: '#FCFF2B',strokeWeight: LINE_WEIGHT, strokeOpacity: LINE_OPACITY})//, strokeOpacity:0.5
                }
                this.whitearrPois.push(this.points[this.i].pt);
                this.polyline_range.setPath(this.whitearrPois);

                this.yellowPois.push(this.points[this.i].pt); 
                this.polylineYellow.setPath(this.yellowPois);
                

                
                var widcloth=45;
                if(this.taskErr != null && this.taskErr.widcloth!=null)
                    widcloth =this.taskErr.widcloth;
                this.HFDrawAirStripsSprayingSpan(widcloth,this.polyline_range,false);
                this.map.addOverlay(this.polylineYellow);
                this.polylineRED=null;
                this.poinLin1=[];
            }
            if(this.points[this.i].ssflow<=0){

                this.poinLin1.push(this.points[this.i].pt) 
                if(this.polylineRED==null)
                    this.polylineRED = new BMap.Polyline(this.poinLin1, { strokeColor: 'red', strokeWeight: LINE_WEIGHT, strokeOpacity: LINE_OPACITY })
                this.polylineRED.setPath(this.poinLin1);
                this.map.addOverlay(this.polylineRED);

                var widcloth=45;
                if(this.taskErr != null && this.taskErr.widcloth!=null)
                    widcloth =this.taskErr.widcloth;
                this.HFDrawAirStripsSprayingSpan(widcloth,this.polyline_range,true);
                this.polyline_range=null;
                this.polylineYellow=null;
                this.whitearrPois=[];
                this.yellowPois=[];          
            }
            // 选中画面跟随 定位中心点
            if(this.switchm){
                this.map.panTo(this.points[this.i].pt,true);
            }
            if(this.i==0){
                this.map.setZoom(16)
            } 
            //设置飞机转向
            var rota = this.setRotation(this.points[this.i], this.points[this.i + 1])
            if(rota == 0 ){
                rota = 360
            }
            this.plane.setRotation(rota)
            //设置图标位置
            //任务标识:${this.points[this.i].taskName}\n
            var title = `账户标识:${this.points[this.i].planeId}\n高度:${this.points[this.i].height}(m)\n速度:${this.points[this.i].speed}(km/h)\n流量:${this.points[this.i].ssflow}(m³/h)\n时间:${this.points[this.i].speedtime}`
            this.plane.setTitle(title) 
            this.plane.setPosition(this.points[this.i].pt)  
            //设置高度折线图
            this.plane_height = []
            this.plane_height.unshift({id:this.i,val:this.points[this.i].height,time:this.points[this.i].speedtime})
            //设置流量折线图
            this.plane_ssflow = []
            this.plane_ssflow.unshift({id:this.i,val:this.points[this.i].ssflow,time:this.points[this.i].speedtime})
            //设置速度，喷雾压力
            this.gaugeseries = [] 
            this.gaugeseries.push(this.points[this.i].speed)
            this.gaugeseries.push(0)  
            this.isError (this.i)
            this.i++ 
            let eTime = new Date().getTime();
            let t=1000;
            if(eTime-sTime<1000){ 
                t=t-(eTime-sTime);
            }else{
                t=0;
            } 
            this.timer = setTimeout(() => {
                this.drawPointLine('');
            }, t);
        },
        //获取 作业区 避让点 标识  信息  
        quyuBR(taskno){ 
            let params = {snkey:this.snkey,method:206,taskNo:taskno}
            axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
            .then(res=>{
                this.drawArea(res.data)
            })
            .catch(err=>{
                console.log(err)
            })
        },
        //画 作业区 避让点 标识    
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
        //第一次实时加载飞机位置
        loadPlane(asidType) {
            if(asidType==""||asidType==null)
                asidType="plane.png"
            var icon = new BMap.Icon(require('@/img/map/airfence/'+asidType), new BMap.Size(40, 40), { imageOffset: new BMap.Size(1, 1) })
            this.plane = new BMap.Marker(this.points[0], { icon: icon })
            this.map.addOverlay(this.plane)
        },
        //获取所有飞机
        getAllPoints(){ 
            let params = {snkey:this.snkey,method:207,cmcCode:this.cmcCode}
            axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
            .then(res=>{
                if(res.status == 200){
                    setTimeout(() => {
                        this.loading = 0 
                        console.log(res.data)
                        if(res.data.id){
                            if(res.data.id==-1){
                                this.$notify.danger({content:res.data.message})
                                return;
                            }
                        }
                        this.getPlaneIcon(res.data)      
                    }, 1000);                    
                }
            })
            .catch(err=>{
                console.log(err)
                this.loading=0;
            })
        },
        //设置飞机图标，（在显示实时在飞的所有飞机的时候）
        getPlaneIcon(datas) {
            if(datas.length<=0)
                return 
            datas.forEach((d,i)=>{
                if(d.asidType==null||d.asidType==""){
                    d.asidType="plane.png";
                }
                var icon = new BMap.Icon(require('@/img/map/airfence/'+d.asidType), new BMap.Size(48, 48), { imageOffset: new BMap.Size(1, 1) }) 
                // var title = `飞机:${d.planeId}\n任务:${d.taskName}`
                var taskno = '',taskName='',bgtime='',edtime='';
                if(`${d.taskno}`!=""){
                    taskno = `任务标识:${d.taskno}\n`;
                }
                if(`${d.taskName}`!=""){
                    taskName = `任务名称:${d.taskName}\n`;
                }
                if(`${d.bgtime}`!=""){
                    bgtime = `任务开始时间:${d.bgtime}\n`;
                }
                if(`${d.edtime}`!=""){
                    edtime = `任务结束时间:${d.edtime}\n`;
                }
                var title = taskno+taskName+`用户标识:${d.planeId}\n`+bgtime+edtime+`当前时间:${d.speedTime}`
                var point = { lng: d.lng, lat: d.lat }
                var marker = new BMap.Marker(new BMap.Point(point.lng,point.lat), {icon:icon, title: title })
                this.map.addOverlay(marker)
                marker.addEventListener('click',()=>{ 
                    this.loading = 1
                    this.clear()
                    this.replysta = false
                    this.websocket = null 
                    this.websocketInit(d.planeId,d.taskno,d.taskName)
                    this.replydis = false
                    console.log("加载飞机轨迹  延迟1秒")
                    setTimeout(() => {
                        this.drawPointLine(d.asidType);
                    },2000)
                })
            })
        },
        //获取预警信息
        getError(taskno){
            let params = {snkey:this.snkey,method:208,taskNo:taskno}
            axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
            .then(res=>{
                this.taskErr =res.data;
            })
            .catch(err=>{
                console.log(err)
            })
        },
        //判断飞机飞行时数据是是否异常
        isError(i){ 
            if(this.taskErr == null){
                return;
            }
            if(this.taskErr == ""){
                return;
            }
            let _points = this.points[i];
            //widcloth,maxflow,minflow,maxspeed,minspped,naxaltitude,minaltitude,maxpressure,minpressure
            var maxflow = parseInt(this.taskErr.maxflow);//瞬时流量上限
			var minflow = parseInt(this.taskErr.minflow);//瞬时流量下限
			var maxspeed = parseInt(this.taskErr.maxspeed);//速度上限
			var minspped = parseInt(this.taskErr.minspped);//速度下限
			var naxaltitude = parseInt(this.taskErr.naxaltitude);//海拔上限
			var minaltitude = parseInt(this.taskErr.minaltitude);//海拔下限
			var maxpressure = parseInt(this.taskErr.maxpressure);//压力上限
			var minpressure = parseInt(this.taskErr.minpressure);//压力下限
            //height: height, speed: speed,ssflow:ssflow,s
            if(_points.ssflow<=0){
                return;
            } 
            if(naxaltitude&&naxaltitude!=0)
            if(_points.height>naxaltitude){//超出海拔上限
                this.hegihtErr = ('终端:'+_points.planeId+'海拔高度:'+_points.height+'超出上限值('+naxaltitude+'),时间:'+_points.speedtime);
            }
            if(minaltitude&&minaltitude!=0)
            if(_points.height<minaltitude){//低于海拔下限
                this.hegihtErr = ('终端:'+_points.planeId+'海拔高度:'+_points.height+'低于下限值('+minaltitude+'),时间:'+_points.speedtime);
            }
            if(maxspeed&&maxspeed!=0)
            if(_points.speed>maxspeed){//超出速度上限
                this.speedErr = ('终端:'+_points.planeId+'飞行速度:'+_points.speed+'超出上限值('+maxspeed+'),时间:'+_points.speedtime);
            }
            if(minspped&&minspped!=0)
            if(_points.speed<minspped){//低于速度下限
                this.speedErr = ('终端:'+_points.planeId+'飞行速度:'+_points.speed+'低于下限值('+minspped+'),时间:'+_points.speedtime);
            }
            if(maxflow&&maxflow!=0)
            if(_points.ssflow>maxflow){//超出瞬时流量上限
                this.ssflowErr = ('终端:'+_points.planeId+'瞬时流量:'+_points.ssflow+'超出上限值('+maxflow+'),时间:'+_points.speedtime);
            }
            if(minflow&&minflow!=0)
            if(_points.ssflow<minflow){//低于瞬时流量下限
                this.ssflowErr = ('终端:'+_points.planeId+'瞬时流量:'+_points.ssflow+'低于下限值('+minflow+'),时间:'+_points.speedtime);
            }
        },
        taskNameShow(){
            if(this.taskNameisShow==false){
                this.taskNameisShow=true;
            }else{
                this.taskNameisShow=false;
            }
        }
    },
    watch: {
        'clientHeight': function() {
            this.setHeight()
        },
    }
}
</script>

<style lang="scss" scoped>
//异常列表
.cardList{
    display: block;
    background-color: #f4f4f4 !important; 
    ul{
        padding: 0; 
    }
    ul li{
        list-style-type: none;
        overflow:hidden; 
        margin-top:.1rem;
        height: .5rem;
        padding-left:.1rem;
        padding-top:.1rem;
        background-color: #fff;
        &:nth-child(1){
          margin-top: 0;  
        }
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
    width: 1rem;
    display: inline-block;
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
}
</style>

