<template>
    <md-layout md-gutter md-column class="mapbody">
        <md-layout md-gutter md-row>
            <md-layout md-flex-small="100" md-flex="75">  
                <md-card class="mapcard">
                    <div class="mapdiv">
                        <div :class="ISPC()?mybtnpc:mybtn">
                            <md-layout md-row >
                                <!-- class="row1" -->
                                <md-layout>
                                    <md-button class="md-primary md-raised md-icon-button" @click="select">
                                        <md-icon>settings</md-icon>
                                        <md-tooltip md-direction="right">选项</md-tooltip>
                                    </md-button>
                                    <md-button class="md-primary md-raised md-icon-button" @click="begin" :disabled="disbegin">
                                        <md-icon>play_arrow</md-icon>
                                        <md-tooltip md-direction="right">播放</md-tooltip>
                                    </md-button>
                                    <md-button class="md-primary md-raised md-icon-button" @click="pause" :disabled="dispause">
                                        <md-icon>pause</md-icon>
                                        <md-tooltip md-direction="right">暂停</md-tooltip>
                                    </md-button> 
                                    <md-button class="md-primary md-raised md-icon-button" @click="fast">
                                        <md-icon>fast_forward</md-icon>
                                        <md-tooltip md-direction="right">快进{{fastn}}倍</md-tooltip>
                                    </md-button>
                                    <div v-on:mouseenter="taskNameShow" @mouseleave="taskNameShow"  :class="tasknameClass">
                                        <md-whiteframe v-if="taskNameisShow" md-elevation="1" class="taskname">{{taskName}}</md-whiteframe>
                                    </div>
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

                        <div class="jdt" >
                            <div   style="background-color: #FBFBFB;">
                                <md-layout md-flex-small="100" md-flex="100"> 
                                    <md-layout md-flex-small="90" md-flex="90">
                                    <progress-bar offsetParent="body" width="100%" leftBg="greenyellow" bgc="#ccc" ballBgc="red" :percent="percent"
                                    @pbar-drag="drag" @pbar-seek="seek"></progress-bar>
                                    </md-layout>
                                    <md-layout md-flex-small="10" md-flex="10">
                                        　{{percent.toFixed(2)}}%
                                    </md-layout> 
                                </md-layout>
                               
                                <md-layout md-flex-small="100" md-flex="100"> 
                                    <md-layout v-for="(item,index) in jdtTime" :key="index" md-flex="10">{{item}}</md-layout> 
                                </md-layout>
                            </div>
                            
                        </div>
                        
                </md-card>
                
                <md-loading :loading="loading"></md-loading>
            </md-layout>
            <md-layout md-flex-small="100" md-flex="25" md-column>
                <!-- 仪表盘 -->
                <md-layout md-flex="25">
                    <md-card class="mycard">
                        <echarts-gauge :gaugeseries="gaugeseries"></echarts-gauge>
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
                            <li v-for="(item,index) in errorMSG" :key="index">
                                <span v-if="item!=''">
                                    <md-icon class="list-icon">error</md-icon>
                                    <span class="md-body-1">{{item}}</span>
                                </span>
                            </li>
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
    
    mixins:[LuShu],
    mounted() {
        //清覆盖物，初始化数据
        this.clear()
        this.baiduMap() 
        this.snkey= JSON.parse(window.sessionStorage.getItem('snkey')) 
        this.plane_height=[]
        this.plane_height.unshift({id:-1,val:0,time:2})
        //设置流量折线图
        this.plane_ssflow = []  
        this.plane_ssflow.unshift({id:-1,val:0,time:2})
        //设置速度，喷雾压力
        this.gaugeseries = []
        this.gaugeseries.push(0)
        this.gaugeseries.push(0) 
        this.setHeight()
        window.onresize = () => { 
            this.clientHeight = document.body.clientHeight
        }
    },
    data() {
        return {
            map: {},
            points: [],//点集合
            i:0,//当前点
            //定时器
            timer: null,
            plane: null,//飞机
            clientHeight: '',//地图高度
            switchm: true,//画面跟随
            disbegin: true,//开始
            dispause: true,//暂停
            loading: 0,
            planeno: '',//用户。飞机编号
            taskno: '',//任务名称
            gaugeseries:[],//仪表盘
            plane_height:[],//海拔折线图
            plane_ssflow:[],//高度折线图
            fastnum:1,//快放参数
            fastn:0,//快放参数
            mybtnpc:'mybtnpc',
            mybtn:'mybtn',
            snkey:'',
            errorMSG:['','','','','','',''],//错误信息
            taskErr:'',//作业参数信息 
            taskName:"",//任务名称
            poinLin1:[],//红色线点集合
            polylineRED:null,//红色线
            whitearrPois:[],//白色喷洒线集合
            polyline_range:null,//白色喷洒线

            yellowPois:[],//黄色喷洒线集合
            polylineYellow:null,//黄色线

            pages:0,//页数
            nowPage:0,
            countNUM:0,//任务点数
            pointsStartTime:null,//任务开始时间（飞机开始作业时间点）
            pointsEndTime:null,//任务结束时间（飞机结束作业时间点）
            param:{
                apiId: "assisto",
                dbid: `${global.DBID}`,
                usercode: JSON.parse(window.sessionStorage.getItem('user')).userCode,
                pageSize:1000,
                page:1,
                assistid: null,
                cont:null,
            },
            isgetNextPage:true,
            //进度条
            percent:0,//百分比
            currentMiao:0,//当前秒
            asidType:'plane.png',//图标
            isowver:false,//回放是否完成
            jdtTime:[],
            taskNameisShow:false,
            tasknameClass:'tasknameClass1'
        }
    },
    methods: {
        clear() {
            this.poinLin1=[];//红色线点集合
            this.polylineRED=null;//红色线
            this.whitearrPois=[];//白色喷洒线集合
            this.polyline_range=null;//白色喷洒线 
            this.yellowPois=[];//黄色喷洒线集合
            this.polylineYellow=null;//黄色线

            this.isgetNextPage=false;
            this.points = []
            this.errorMSG=[] 
            this.param.page=1
            this.i = 0
            this.pages=0
            this.poinLin1=[],
            this.whitearrPois=[],
            this.areaFlag = false
            if (this.timer) {
                clearTimeout(this.timer)
            }
            if(this.map.height>0){ 
                this.map.clearOverlays()
            } 
        },
        //选取回放内容参数
        select() {
            // this.progressBar.distance=11;
            var _this = this
            this.$mapDialog.open({ diaTitle: '轨迹回放参数选择', getOpt(planeno, taskno, start, end) { _this.getTim(planeno, taskno, start, end) } })
        }, 
        //接收回放参数
        getTim(planeno, taskno, start, end) {
            this.isgetNextPage = false;
            this.loading = 1  
            this.getQiXie(taskno)
            //获取轨迹 用户标识，任务标识，开始时间，结束时间
            this.getPoint(planeno, taskno, start, end)
            //获取作业区域 以及避让点
            this.getAreaPoint(taskno)
            //获取作业参数信息
            this.getError(taskno)
            //获取异常信息
            this.getErrorMSG(planeno, taskno, start, end)  
            // this.getTaskTime(taskno)
        },
        //获取回放信息  第一页
        getPoint(usernumber, taskno, startTime, endTime){
            this.clear()
            console.log(usernumber, taskno, startTime, endTime)
            //获取 全部点数 
            this.param.assistid="TASKALL";
            this.param.cont="~tkid='"+taskno+"' and speedtime >='"+startTime+"' and speedtime<='"+endTime +"'";
             axios.post(global.BIPAPIURL+global.API_COM, qs.stringify(this.param)).then(res => {
                this.countNUM=res.data.total
                if(this.countNUM == 0 ){
                    this.$notify.success({content:"暂无数据"}) 
                    this.loading=0;
                    return;
                }
                if(this.countNUM%this.param.pageSize==0){
                    this.pages = parseInt(this.countNUM/this.param.pageSize)
                }else{
                    this.pages = parseInt(this.countNUM/this.param.pageSize)+1
                }
                console.log(res.data)
                for(var i in res.data.values){
                    var data = res.data.values[i]; 
                    var _point = {pt:new BMap.Point(data.longitude,data.latitude),lng: data.longitude, lat: data.latitude, planeId: data.usrcode, taskName: data.taskname, flow: data.flow, height: data.height, speed: data.speed,ssflow:data.flow,speedtime:data.speedtime}
                    this.points.push(_point)
                }
                console.log(this.points.length)
                this.taskName = "　　"+this.points[0].taskName+"　　"; 
                this.loadPlane(this.asidType)
                //加载完成，释放开始按钮
                this.disbegin = false
                this.isgetNextPage=true
                this.begin() 
                this.loading=0;
                this._getPoint(usernumber, taskno, startTime, endTime)
            });
        },
        //获取点  第一页之后
        async _getPoint(usernumber, taskno, startTime, endTime) {
            // console.log("获取点  第一页之后")
            if(this.nowPage<this.pages){
                if(this.param.page == this.pages)
                    return
                this.param.assistid="TASKALL";
                this.param.page=this.param.page+1;
                this.param.cont="~tkid='"+taskno+"' and speedtime >='"+startTime+"' and speedtime<='"+endTime +"'";
                await axios.post(global.BIPAPIURL+global.API_COM, qs.stringify(this.param)).then(res => {  
                    for(var i in res.data.values){
                        if(this.isgetNextPage==false){
                            console.log("退出数据加载！")
                            return;
                        }
                        var data = res.data.values[i]; 
                        var _point = {pt:new BMap.Point(data.longitude,data.latitude),lng: data.longitude, lat: data.latitude, planeId: data.usrcode, taskName: data.taskname, flow: data.flow, height: data.height, speed: data.speed,ssflow:data.flow,speedtime:data.speedtime}
                        this.points.push(_point)
                    }  
                    // console.log("结束:",this.points.length)
                    this.nowPage++; 
                    this._getPoint(usernumber, taskno, startTime, endTime);
                }); 
            }
        },
        //开始划线
        creatLine() { 
            this.loading = 0  
            if(this.isgetNextPage==false)
                return;
            this.currentMiao=this.i; 
            //设置进度
            this.percent = this.currentMiao / this.countNUM * 100; 
            if(this.i >= this.countNUM-1){
                this.timer = setTimeout(() => {
                    this.creatLine();
                }, this.fastnum*1000); 
                return;
            } 
            if(this.percent==100){
                this.$notify.success({content:"回放完成！"}) 
            }
            //还剩50点设置播放速度
            if(this.i >= this.points.length-100){
                this.fastnum = 1
                this.fastn = 0 
            }
            var _ssflow =this.points[this.i].ssflow;
            //设置弄药喷洒带
            if(this.points[this.i].ssflow>0){

                if(this.polyline_range==null){
                    this.polyline_range = new BMap.Polyline(this.whitearrPois, {strokeColor: '#339933',strokeWeight:1, strokeOpacity:0.3,enableClicking:false})//, strokeOpacity:0.5
                }
                if(this.polylineYellow ==null){
                    this.polylineYellow = new BMap.Polyline(this.yellowPois, {strokeColor: '#FCFF2B',strokeWeight: LINE_WEIGHT, strokeOpacity: LINE_OPACITY})//, strokeOpacity:0.5
                }
                this.whitearrPois.push(this.points[this.i].pt);
                this.yellowPois.push(this.points[this.i].pt); 
                this.polyline_range.setPath(this.whitearrPois);
                this.polylineYellow.setPath(this.yellowPois); 
                this.HFDrawAirStripsSprayingSpan(this.taskErr.widcloth,this.polyline_range,false); 
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
                this.HFDrawAirStripsSprayingSpan(this.taskErr.widcloth,this.polyline_range,true);
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
            // console.log(rota)
            // if(rota == 0 ){
            //     rota = 360
            // }
            if(rota!=0&&rota!=360&&rota!=-90)
                this.plane.setRotation(rota)
            //设置图标位置
            var title = `任务标识:${this.points[this.i].taskName}\n账户标识:${this.points[this.i].planeId}\n高度:${this.points[this.i].height}(m)\n速度:${this.points[this.i].speed}(km/h)\n流量:${this.points[this.i].ssflow}(m³/h)\n时间:${this.points[this.i].speedtime}`
            this.plane.setTitle(title) 
            this.plane.setPosition(this.points[this.i].pt)  
            //设置高度折线图
            this.plane_height = []
            this.plane_height.unshift({id:this.i,val:this.points[this.i].height,time:this.points[this.i].speedtime})
            //设置流量折线图
            this.plane_ssflow = [] 
            if(_ssflow<=0)
                _ssflow =0;
            this.plane_ssflow.unshift({id:this.i,val:_ssflow,time:this.points[this.i].speedtime})
            //设置速度，喷雾压力
            this.gaugeseries = []
            this.gaugeseries.push(this.points[this.i].speed)
            this.gaugeseries.push(0)
            //设置当前点 注释  
            var icon = new BMap.Icon(require('@/img/map/airfence/redpoint.png'), new BMap.Size(15, 15), { imageOffset: new BMap.Size(1, 1) })
            var _point = new BMap.Marker(this.points[this.i].pt, { icon: icon })
            _point.setTitle(title)  
            this.map.addOverlay(_point)
            
            this.i++;
            this.timer = setTimeout(() => {
                this.creatLine();
            }, this.fastnum*1000); 
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
            let area = []
            var icon = new BMap.Icon(require('@/img/map/airfence/birang.png'), new BMap.Size(15, 15), { imageOffset: new BMap.Size(1, 1) })
            for(var i=0;i<data.length;i++){
                //作业区域
                var listQY = data[i].listQY;
                for(var j =0;j<listQY.length;j++){
                    var _zb=listQY[j];
                    area.push(new BMap.Point(parseFloat(_zb[0]),parseFloat(_zb[1])))
                }
                var polygon = new BMap.Polygon(area, { strokeColor: AREA_COLOR, strokeWeight: AREA_WEIGHT, strokeOpacity: AREA_OPACITY,fillColor:AREA_FILLCOLOR,fillOpacity:AREA_FILLOPACITY })
                this.map.addOverlay(polygon)
                //避让点
                var listBR = data[i].listBR;
                // var markers = [];
                // var pt = null; 
                for(var z=0;z<listBR.length;z++){
                    var _zb = listBR[z]
                    var br = new BMap.Marker({ lng: _zb[0], lat: _zb[1]}, { icon: icon })
                    this.map.addOverlay(br)
                } 
            }
        },
        //加载飞机点
        loadPlane(asidType) { 
            if(this.points.length>0){
                var icon = new BMap.Icon(require('@/img/map/airfence/'+asidType), new BMap.Size(40, 40), { imageOffset: new BMap.Size(1, 1) })
                this.plane = new BMap.Marker(this.points[0].pt, { icon: icon })
                this.map.addOverlay(this.plane)
            }
        },
        //获取异常信息
        getErrorMSG(planeno, taskno, start, end){
            let params = {snkey:this.snkey,method:209,taskNo:taskno,userNumber:planeno,startTime:start,endTime:end}
            axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
            .then(res=>{
                  res.data.forEach((d,i)=>{
                    this.errorMSG.unshift(`${d.remark}`);
                  })
            })
            .catch(err=>{
                console.log(err)
            })
        },
        //获取预警信息参数
        getError(taskno){
            let params = {snkey:this.snkey,method:208,taskNo:taskno}
            axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
            .then(res=>{
                this.taskErr = res.data;
                // this.taskErr.widcloth = 100;
            })
            .catch(err=>{
                console.log(err)
            })
        },
        //设置地图高度
        setHeight() {
            this.clientHeight = document.body.clientHeight
            document.getElementById('container').style.height = (this.clientHeight - 90) + 'px'
        },
        //开始
        begin() { 
            this.disbegin = true
            this.dispause = false
            this.map.addEventListener("zoomend", this.getCenterAndZoom);
            this.creatLine()
        },
        //暂停
        pause() {
            this.dispause = true
            this.disbegin = false
            if (this.timer) {
                clearTimeout(this.timer)
            }
        },
        //设置播放速度
        fast(){
            if(this.fastnum == 1){
                this.fastnum = 1/2
                this.fastn = 2
                return
            }else if(this.fastnum == 1/2){
                this.fastnum = 1/4
                this.fastn = 4
                return
            }else if(this.fastnum == 1/4){
                this.fastnum = 1/8
                this.fastn = 8
                return
            }else{
                this.fastnum = 1
                this.fastn = 0
                return
            }
        },
        //点击 快进清除 之前的飞行数据
        KJclear(percent1){ 
            this.isgetNextPage;
            var d = parseInt(percent1 / 100 * this.countNUM);//当前点

            
            this.i=parseInt(percent1 / 100 * this.countNUM);
            if(this.i>this.points.length-20){
                this.i=this.points.length-20;
            } 

            if(this.currentMiao>0){
                this.percent = this.currentMiao / this.countNUM * 100; 
            }else{
                this.percent = 0;
                return;
            }
            this.map.clearOverlays()
            this.poinLin1=[],
            this.whitearrPois=[],
            this.AirStripsSprayingSpanLines=[]
            this.loadPlane(this.asidType)  
        },
        //拖动进度条
        drag(percent1){ 
            this.KJclear(percent1)
        },
        //点击进度条
        seek(percent1){ 
            this.KJclear(percent1);
        },
        async getQiXie(taskno){
            let param = this.param;
            param.page=1;
            param.assistid="GETTASKQX";
            param.cont="~o.sid ='"+taskno+"'";
            await axios.post(global.BIPAPIURL+global.API_COM, qs.stringify(param)).then(res => {
                let type= res.data.values[0].apclass;
                if(type=="0"){
                    this.asidType="plane.png";
                }else if(type=="1"){
                    this.asidType="plane.png";
                }else if(type=="2"){
                    this.asidType="car.png";
                }else if(type=="3"){
                    this.asidType="peopleA.png";
                }else if(type=="4"){
                    this.asidType="people.png";
                }
            });
        },
        //获取任务执行时间段
        // async getTaskTime(taskno){
        //     let param = this.param;
        //     var startTime = new Date();
        //     var endTime = new Date();
        //     param.page=1;
        //     param.pageSize=1;
        //     param.assistid="GETTTIMEASC";
        //     //开始时间
        //     param.cont="~ tkid ='"+taskno+"' ";
        //     await axios.post(global.BIPAPIURL+global.API_COM, qs.stringify(param)).then(res => { 
        //         startTime = new Date(res.data.values[0].speedtime);
        //     });
        //     //结束时间
        //     param.assistid = "GETTTIMEDESC";
        //     param.cont="~ tkid ='"+taskno+"' ";
        //     await axios.post(global.BIPAPIURL+global.API_COM, qs.stringify(param)).then(res => { 
        //         endTime = new Date(res.data.values[0].speedtime);
        //     });
        //     var currentTime = parseInt((endTime.getTime()-startTime.getTime())/10); 
        //     for(var i=0;i<10;i++){ 
        //         this.jdtTime.push(this.formatDate(new Date(startTime.getTime()+currentTime*(i+1)),"hh:mm:ss"));
        //         // .format("")
        //     }
        // },
        // formatDate(date,fmt){
        //     if(/(y+)/.test(fmt)){
        //         fmt = fmt.replace(RegExp.$1, (date.getFullYear()+'').substr(4-RegExp.$1.length));
        //     }
        //     let o = {
        //         'M+': date.getMonth()+1,
        //         'd+': date.getDate(),
        //         'h+': date.getHours(),
        //         'm+': date.getMinutes(),
        //         's+': date.getSeconds()
        //     }
        //     for(let k in o){    
        //         let str = o[k]+'';
        //         if(new RegExp(`(${k})`).test(fmt)){
        //             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1)?str:this.padLeftZero(str));
        //         }
        //     }
        //     return fmt;
        // },
        // padLeftZero(str){
        //     return ('00'+str).substr(str.length);
        // },
        taskNameShow(){
            if(this.taskNameisShow==false){
                this.taskNameisShow=true;
                this.tasknameClass="tasknameClass2";
            }else{
                this.taskNameisShow=false;
                this.tasknameClass="tasknameClass1";
            }
        }
    },
    //离开页面 
    destroyed(){ 
        this.clear();
        this.i=0;
        this.isgetNextPage=false;
    },
    watch: {
        'clientHeight': function() {
            this.setHeight()
        }, 
    }
}
</script>

<style lang="scss" scoped>
.tasknameClass1{
    width: 200px;
}
.tasknameClass2{
    width: auto;
}
.anchorBL{display:none;}
.taskname{
    text-align: center;
    background-color:#fff;
    line-height:40px;
    margin-left: 5px;
}
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
    width: 280px;
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
} 
.jdt{
    position: absolute;
    width: 80%;
    padding-left: 20%;
    margin-bottom: 2em;
    padding-bottom: 0px;
    bottom: 0px;
}
 
</style>

