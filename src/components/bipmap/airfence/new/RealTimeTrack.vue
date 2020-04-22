<template>
    <md-layout class="margin0">
        <md-tabs md-fixed>
            <md-tab id="Map" md-label="地图" class="padding0">
                <div class="mybtn">
                    <md-layout md-row >
                        <md-layout>
                            <md-button class="md-primary md-raised md-icon-button" @click="refresh">
                                <md-icon>refresh</md-icon>
                                <md-tooltip md-direction="right">刷新</md-tooltip>
                            </md-button> 
                        </md-layout>
                    </md-layout>
                    <md-layout md-row class="row2">
                        <md-switch v-model="isFollow" id="isFollow" name="isFollow" class="md-primary">
                            <span class="myspan">画面跟随</span>
                        </md-switch>
                    </md-layout>  
                </div>  
                <div id="RealTimeTrackTMap" class="padding0"></div>
            </md-tab>

            <md-tab id="Cockpit" md-label="飞防驾驶舱" class="padding0" >
                <div class="right-content" id="cockpit"> 
                    <div class="header">
                        <img  class="header-img" src="@/assets/air-super/header.png" alt="">
                        <div class="header-title">
                            飞防驾驶舱
                        </div>
                    </div>

                    <div v-if="rightState">
                        <div class="nowtitle pointer" v-for="(item,index) in newTaskList" :key="index" @click="detailTask(item.sid)">
                            <div class="nowtime-header">
                                实时任务
                            </div>
                            <div class="nowtaskname">
                                <p class="nowtaskname-p">
                                    {{item.taskname}}
                                </p>       
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="nowtitle">
                            <div class="nowtime-header">
                                当前任务
                            </div>
                            <div class="nowtaskname">
                                <p class="nowtaskname-p">{{taskname}}</p>   
                            </div>
                        </div>
                        <div class="nowtime">
                            <div class="nowtime-header">
                                当前时间
                            </div>
                            <div class="time">
                                {{nowtime}}
                            </div>
                        </div>
                        <div class="speed-flow">
                            <md-layout class="padding0">
                                <div class="speed-content">
                                    <div class="sp-title ">
                                        <span>当前速度</span>
                                    </div>
                                    <div class="time">
                                        {{nowspeed}}km/h
                                    </div>
                                </div>

                                <div class="speed-content">
                                    <div class="sp-title nowtime-header">
                                        <span>海拔高度</span>
                                    </div>
                                    <div class="time">
                                        {{nowheight}}m
                                    </div>
                                </div>
                            </md-layout>
                        </div>
                                                <div class="speed-flow">
                            <md-layout class="padding0">
                                <div class="speed-content">
                                    <div class="sp-title ">
                                        <span>当前压力</span>
                                    </div>
                                    <div class="time">
                                        {{nowpressure}}kpa
                                    </div>
                                </div>

                                <div class="speed-content">
                                    <div class="sp-title nowtime-header">
                                        <span>当前温度</span>
                                    </div>
                                    <div class="time">
                                        {{nowtemperature}}℃
                                    </div>
                                </div>
                            </md-layout>
                        </div>
                        <div class="speed-flow">
                            <md-layout class="padding0">
                                <div>
                                    <div class="speed-content">
                                        <div class="sp-title ">
                                            <span>当前流量</span>
                                        </div>
                                        <div class="time">
                                            {{nowflow}}m³/h
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="speed-content">
                                        <div class="sp-title nowtime-header">
                                            <span>累计流量</span>
                                        </div>
                                        <div class="time">
                                            {{sumflow}}m³
                                        </div>
                                    </div>
                                </div>
                            </md-layout>
                        </div>
                        <div class="speed-flow">
                            <md-layout class="padding0">
                                <div>
                                    <div class="speed-content">
                                        <div class="sp-title ">
                                            <span>累计飞行时长</span>
                                        </div>
                                        <div class="time">
                                            {{sumtime}}/s
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="speed-content">
                                        <div class="sp-title nowtime-header">
                                            <span>累计喷洒时长</span>
                                        </div>
                                        <div class="time">
                                            {{sumtimeflow}}/s
                                        </div>
                                    </div>
                                </div>
                            </md-layout>
                        </div>
                        <div class="nowtime">
                            <div class="nowtime-header">
                                累计喷洒面积
                            </div>
                            <div class="time">
                                {{sumareaFixed}}/亩
                            </div>
                        </div>
                    </div>
                </div>
            </md-tab>
        </md-tabs>  
        <md-loading :loading="loading"></md-loading>
    </md-layout>
</template>

<script>
import CDataSet from '@/components/views/classes/CDataSet';
import qs from 'qs'
import axios from 'axios'  
import GPSUtil from './js/GPSUtil.js' 
import TMapUtils from './js/TMapUtils.js' 
export default {
    mixins:[TMapUtils,GPSUtil],
    created(){ 
    },
    async mounted() {
        this.setHeight();
        this.createdMap();
        this.initWarn();
        window.onresize = () => { 
            this.setHeight();
        }
        await this.initTask();
        for(var k in this.taskData){
            await this.initOperDevice(this.taskData[k]);
        }
        let t1 = this.tMap.getViewport(this.airPoint);
        this.tMap.panTo(t1.center, t1.zoom);
    },
    data() {
        return { 
            tabHeight:"height:100%",
            sleepTime : 5*60*1000,//延迟时间
            usercode:JSON.parse(window.sessionStorage.getItem("user")).userCode,
            loading:0,
            tMapDiv:"RealTimeTrackTMap",
            tMap:null,
            tZoom:12, 
            rightState: true, //右侧显示内容状态判断
            warn:null,//预警信息
            newTaskList:[],//任务集合
            taskname:"",//当前任务
            maxTime:null,//最大时间
            sprayLine0:[],//喷洒轨迹（农药范围）
            sprayLine1:[],//喷洒轨迹（一像素的线）
            sprayLine2:[],//飞行轨迹（没有喷洒农药的轨迹线）
            sprayBreak:true,//喷洒是否中断
            flightBeltColor: "#ADFF2F",//行带颜色
            flightBeltOpacity: 0.3,//航道透明度
            flightBeltWidth: 45,//航带宽度 米
            trackColor:"#FFFF00",//航迹颜色
            noFlowColor: "#F40",//未喷洒农药时的轨迹颜色


            taskData:{},//当天任务集合
            airPoint:[],//初始化飞机任务点  用来确认地图基本以及中心点
            taskPoint:[],//任务点
            taskPointJSON:[],//任务点
            plane:null,//单个飞机实时点
            rotate:0,//飞机旋转角度

            _timer:null,//计时器  画线
            _timer1:null,//计时器 查询数据
            _timer2:null,//计时器 无数据时查询数据
            interval:1000,//飞行间隔时间 毫秒    
            isFollow:true,//画面跟随

            // 实时时间对应的数据
            nowtime:'----',
            nowspeed:'--',
            nowpressure: '--',//压强
            nowtemperature: '--',//温度
            nowflow:'--',
            sumflow:0,
            nowheight:'--',
            sumtimeflow: 0,
            sumtime: 0,
            taskname:"",
            sumarea: 0,
            //当前任务起降点
            takeoff: null,//起降点
            takeoffRange: 50,//起降点范围
            warnInterval:0,//预警点数
        }
    },
    methods: { 
        createdMap(){
            console.log("初始化天地图！")
            //初始化地图对象
            this.tMap = new T.Map(this.tMapDiv,{projection:"EPSG:4326"});
            // this.tMap = new T.Map(this.tMapDiv);
            //设置显示地图的中心点和级别
            this.tMap.centerAndZoom(new T.LngLat(116.40969, 39.89945), this.tZoom);
            //创建缩放平移控件对象
            let control = new T.Control.Zoom();
            //添加缩放平移控件
            control.setPosition(T_ANCHOR_BOTTOM_RIGHT);
            this.tMap.addControl(control);
            //创建比例尺控件对象
            let scale = new T.Control.Scale();
            //添加比例尺控件
            this.tMap.addControl(scale);
            //创建对象
            var ctrl = new T.Control.MapType();
            //添加控件
            this.tMap.addControl(ctrl);
            //地图缩放结束事件
            this.tMap.addEventListener("zoomend", this.zoomend);
            setTimeout(() => {
                this.tMap.checkResize();  
            }, 200);
        },
        //初始化飞防任务
        async initTask(){
            // let res = await tools.getServerTime();
            // let time = res.data.data.data.time;
            let time = new Date().getTime();
            let date = this.dateFormat(time,"yyyy-MM-dd HH:mm:ss")
            let data2 = {  
                dbid: global.DBID,
                usercode: this.usercode,
                apiId: global.APIID_AIDO, 
                pageSize:500000,
                assistid: 'TKMSG', //辅助名称
                cont: ""
            }
            data2.cont ="~bgtime<='"+date+"' and edtime>='"+date+"'";
            let vv = await this.getDataByAPINewSync(data2);
            if(vv.data && vv.data.values){
                let values = vv.data.values;
                this.newTaskList = values;
                for(var i=0;i<values.length;i++){
                    let vl = values[i];
                    let tlid = await this.initNewTlid(vl.asid)
                    vl.tlid = tlid[0];
                    vl.trtype = tlid[1];
                    // vl.tlid = "20003720032"
                    this.taskData[vl.sid]= vl;
                }
            }
        },
        /**
         * 查询任务最新设备  可能会做设备便跟
         * @param asid 器械标识
         */
        async initNewTlid(asid){
            let data2 = {  
                dbid: global.DBID,
                usercode: this.usercode,
                apiId: global.APIID_AIDO, 
                pageSize:500000,
                assistid: 'EQUI', //辅助名称
                cont: ""
            }
            data2.cont ="~asid ='"+asid+"'";
            
            let tlid = ['',''];
            let vv = await this.getDataByAPINewSync(data2); 
            if(vv.data && vv.data.values){
                let values = vv.data.values;
                 if(values.length>=1){
                    tlid[0] = values[0].tlid;
                    tlid[1] = values[0].trtype;
                }
                return tlid;
            }else{
                return tlid
            }
        },
        /**
         * 查询正在作业的设备
         */
        async initOperDevice(task){
            // let rest = await tools.getServerTime();
            // let time = rest.data.data.data.time;
            let time = new Date().getTime();
            this.maxTime = time; 
            if(task.trtype == '0'){
                time = parseInt(((time - this.sleepTime)/1000)+"");
                // time = 1585473945;
            }else{
                time = time - 5000;
            }
            let key = task.tlid;
            let trtype = task.trtype;
            let condition ={key:key,time:time,trtype:trtype};
            let data = { 
                dbid: global.DBID,
                usercode: this.usercode,
                condition:JSON.stringify(condition),
                oprid:200,
            }
            let data1 = qs.stringify(data);
            let res = await axios.post(global.BIPAPIURL+"/realTimeServlet", data1);
            if(res.data.id ==0){
                let v = res.data.data.data;
                if(v){
                    let key = task.sid;
                    let lnglat = [v.latitude,v.longitude];
                    if(task.trtype =='0'){
                        lnglat = this.bd09_To_gps84(v.latitude,v.longitude);
                    }
                    let cc = lnglat[1]+","+lnglat[0]
                    let poin = new T.LngLat(lnglat[1], lnglat[0]);
                    this.airPoint.push(poin);
                    this.markRealTimeAir(cc,this.tMap,key,this.ariClick)
                }
            } 
        },
    // 点击右侧任务跳转至详情页面
        detailTask(tkid){
            let data1 = {target:{key:tkid}}
            this.ariClick(data1);
        },
        /**
         * 点击单个飞机
         */
        ariClick(data){
            this.rightState = false;
            this.clearCover();
            this.loading = 1;
            let tkid = data.target.key;
            let task = this.taskData[tkid];
            this.taskname = this.taskData[tkid].taskname;
            this.flightBeltWidth = this.taskData[tkid].widcloth;
            let route = task.route
            let hoaid = task.hoaid;
            let oaid = task.oaid;
            let takeoff = task.takeoff;
            this.initTakeoff(takeoff);
            if(route){
                this.makeRoute(route,"",this.tMap);
            }
            if(hoaid){
                this.getOpera(hoaid,this.tMap);
            }
            if(oaid){
                this.getOperaRoute(oaid,this.tMap);
                this.getOpera(oaid,this.tMap);
                this.getOperaBr(oaid,this.tMap);
            }
            if(task.trtype=='0'){
                this.maxTime = parseInt(((this.maxTime - this.sleepTime)/1000)+"");
                // this.maxTime = 1566597121;
            }else{
                this.maxTime = this.maxTime -5000;
            }
            this.getPointList(task.tlid,true,task.trtype)
            this.tMap.setZoom(16)//设置地图放大级次

        },

        /***
         * 获取实时数据
         * 设备号
         * 是否第一次
         * 设备类型
         */
        async getPointList(key,frist,trtype){ 
            try{
                let condition ={key:key,time:this.maxTime,trtype:trtype};
                let data = { 
                    dbid: global.DBID,
                    usercode: this.usercode,
                    condition:JSON.stringify(condition),
                    oprid:210,
                }
                let data1 = qs.stringify(data);
                let cc = await axios.post(global.BIPAPIURL+"/realTimeServlet", data1);
                if(cc.data.id ==0 ){
                    let values = cc.data.data.data;
                    for(var i =0;i<values.length;i++){
                        let v = values[i];
                        this.maxTime = v.speedtime;
                        let lnglat = [v.latitude,v.longitude];
                        if(trtype =='0'){
                            lnglat = this.bd09_To_gps84(v.latitude,v.longitude);
                        }
                        v.latitude = lnglat[0];
                        v.longitude = lnglat[1]; 
                        if(this.taskPointJSON.indexOf(this.maxTime) ==-1){
                            this.taskPoint.push(v); 
                            this.taskPointJSON.push(this.maxTime);
                        } 
                    }
                }
                if(frist){
                    this.drawPointLine(key,false,trtype);
                }
                this.loading = 0;
                // this._timer1 = window.setTimeout(() => {
                //     this.getPointList(key,false,trtype)
                // }, 2500);
            }catch(err){                
                this.$notify.danger({content:'出错了！'})
                this.loading = 0;
            }
        },
        /**
         * 开始画作业记录
         */
        drawPointLine(key,frist,trtype){
            if(this.taskPoint.length==0){
                this._timer2 = window.setTimeout(() => {
                    this.drawPointLine(key,false,trtype)
                    this.getPointList(key,false,trtype);
                }, 1000);
                return;
            }
            if(this.taskPoint.length<=3){
                this.getPointList(key,false,trtype);
            }
            let t1 = new Date().getTime();
            this.passOneNode(this.taskPoint[0]);
            if(this.taskPoint.length>0){
                if(this.taskPoint.length>1){
                    this.loadPlane(this.taskPoint[0],this.taskPoint[1]);
                }else{
                    this.loadPlane(this.taskPoint[0],this.taskPoint[0]);
                }
            }
            if(this.taskPointJSON.length>30){
                this.taskPointJSON = this.taskPointJSON.splice(1,1)
            }
            this.taskPoint = this.taskPoint.slice(1);
            let t2 = new Date().getTime();
            let t=1000;
            if(t2-t1<this.interval){ 
                t=t-(t2-t1);
            }else{
                t=0;
            } 
            this._timer = window.setTimeout(() => {
                this.drawPointLine(key,false,trtype);
            }, t);
        },
        /**
         * 路线节点变化
         * lnglat:LngLat, index:Number, length:Number
         */
        passOneNode(data){
            if(data.longitude == '0' || data.latitude == '0')
                return;
            if(this.isFollow){//画面跟随
                this.tMap.panTo(new T.LngLat(data.longitude, data.latitude));
            }
            if(data){
                let flow = data.flow;
                
                this.nowtime = this.dateFormat(data.speedtime*1000,"yyyy-MM-dd HH:mm:ss")
                if(data.datetime){
                    this.nowtime = data.datetime;
                }
                this.nowspeed = (data.speed).toFixed(3);
                this.nowpressure = data.pressure
                this.nowtemperature = (data.temperature).toFixed(1);

                this.nowflow = data.flow;
                // this.sumflow = (data.sumfolw).toFixed(3);
                this.nowheight = data.height;
                this.sumtime = this.sumtime+1;
                let lgt = new T.LngLat(data.longitude, data.latitude)
                if(this.takeoff){
                    let jl = this.tMap.getDistance(this.takeoff,lgt);
                    if(jl<=this.takeoffRange){
                        this.sumflow= 0;
                        this.sumarea = 0;
                    }
                }

                if(flow>0){//有流量去划线
                    this.sumflow = parseFloat(this.sumflow) + parseFloat(flow/60/60);

                    this.sumflow = parseFloat((this.sumflow).toFixed(3));
                    let nowArea = this.flightBeltWidth  * data.speed *1000/3600 /666.67;
                    this.sumarea = (this.sumarea + nowArea);
                    let msg = "";
                    //预警信息
                    //this.flightBeltWidth  幅宽
                    //Flow = （Loading÷1000）÷（ （（ Area÷1500）÷（Swath÷1000）） ÷ Speed）  
                    let standard=[];
                    this.warnInterval++;
                    let flow0 = (this.warn.drugload/1000)/(((this.warn.area/this.warn.area)/(this.flightBeltWidth/1000))/data.speed);
                    if(!isNaN(flow0)&& this.warnInterval >this.warn.interval){
                        standard[0] = (flow0*(1-(this.warn.drugfloat/100))).toFixed(2);
                        standard[1] = (flow0*(1+(this.warn.drugfloat/100))).toFixed(2);
                        console.log(standard)
                        if(flow>standard[1] || flow<standard[0]){
                            msg = "当前速度："+data.speed+"km/h<br/>瞬时流量异常("+flow+"),超出当前速度标准范围("+standard[0]+"~"+standard[1]+")"
                        }
                    }
                    if(msg != ""){
                        //创建图片对象
                        var icon = new T.Icon({
                            iconUrl: require('@/assets/air-super/avoid.png'),
                            iconSize: new T.Point(20, 20),
                            iconAnchor:new T.Point(10, 20),
                        });
                        //向地图上添加自定义标注
                        var marker = new T.Marker(lgt, {icon: icon});
                        var markerInfoWin = new T.InfoWindow(msg);
                        marker.addEventListener("click", function () {
                            marker.openInfoWindow(markerInfoWin);
                        });// 将标注添加到地图中
                        this.tMap.addOverLay(marker)
                    }
                    this.sumtimeflow = this.sumtimeflow + 1;
                    if(this.sprayBreak){//中断过需要从起一条线
                        let points = [];
                        let zoom = this.tMap.getZoom();
                        let cc = 256 * Math.pow(2, zoom) / 40075017 //换算一米转多少像素
                        let opts0 = {color:this.flightBeltColor,weight:cc*this.flightBeltWidth,opacity:this.flightBeltOpacity};
                        points.push(lgt);
                        var newLine0 = new T.Polyline(points,opts0);
                        this.tMap.addOverLay(newLine0);
                        this.sprayLine0.push(newLine0)

                        let opts1 = {color:this.trackColor,weight:1,opacity:1};
                        var newLine1 = new T.Polyline(points,opts1);
                        this.tMap.addOverLay(newLine1);     
                        this.sprayLine1.push(newLine1)
                    }else{//没有中断需要在最后一条线追加点 或重画最后一条线
                        let line0 = this.sprayLine0[this.sprayLine0.length-1];
                        let points0 = line0.getLngLats();
                        points0.push(lgt);
                        line0.setLngLats(points0)

                        let line1 = this.sprayLine1[this.sprayLine1.length-1];
                        let points1 = line1.getLngLats();
                        points1.push(lgt);
                        line1.setLngLats(points1)
                    }
                    this.sprayBreak = false;
                }else{
                    this.warnInterval =0;
                    if(this.sprayBreak && this.sprayLine2.length>0){
                        let line2 = this.sprayLine2[this.sprayLine2.length-1];
                        let points2 = line2.getLngLats();
                        points2.push(lgt);
                        line2.setLngLats(points2)
                    }else{
                        let opts2 = {color:this.noFlowColor,weight:1,opacity:1};
                        let points = [];
                        points.push(lgt);
                        var newLine2 = new T.Polyline(points,opts2);
                        this.tMap.addOverLay(newLine2);     
                        this.sprayLine2.push(newLine2)
                    }   
                    this.sprayBreak = true;
                }
                let speed = data.speed; 
            }
        },
        /**
         * 设置飞机
         */
        loadPlane(lnglat1,lnglat2) { 
            let cc = lnglat1.longitude + "," + lnglat1.latitude
            if(!this.plane){
                this.plane = this.markRealTimeAir(cc,this.tMap,"",null)
            }else{
                this.plane.setLngLat(new T.LngLat(lnglat1.longitude, lnglat1.latitude))
            }  
            let jl = this.tMap.getDistance(new T.LngLat(lnglat1.longitude, lnglat1.latitude),new T.LngLat(lnglat2.longitude, lnglat2.latitude));
            if(jl>1.2){
                let curPos = new T.LngLat(lnglat1.longitude, lnglat1.latitude)
                let targetPos = new T.LngLat(lnglat2.longitude, lnglat2.latitude)
                this.rotate =  this.setRotation(curPos,targetPos,this.tMap);
                this.rotate = parseFloat( this.rotate+'')  
                // if(lnglat1.sbid)
                //     this.rotate = lnglat1.direction || "0";  
            }
            if(this.rotate && this.rotate!=0 && this.rotate!=360){
                let style = this.plane.Fr.style[this.CSS_TRANSFORM()];
                this.plane.Fr.style[this.CSS_TRANSFORM()]= style+" rotate(" +this.rotate + "deg)";
                this.plane.Fr.style["transform-origin"] = "50% 50%";
            }

        },

        //选择任务
        select(ref){
            this.$refs[ref].open();
        },
        //设置地图高度
        setHeight() {
            this.clientHeight = document.body.clientHeight
            document.getElementById(this.tMapDiv).style.height = (this.clientHeight - 100) + 'px'
            document.getElementById('cockpit').style.height = (this.clientHeight - 100) + 'px'
        },
         
        /**
         * 地图缩放结束
         */
        zoomend(){
            if(this.plane){
                let style = this.plane.Fr.style[this.CSS_TRANSFORM()];
                this.plane.Fr.style[this.CSS_TRANSFORM()]= style+" rotate(" +this.rotate + "deg)";
                this.plane.Fr.style["transform-origin"] = "50% 50%";
            }
            let zoom = this.tMap.getZoom();
            let cc = 256 * Math.pow(2, zoom) / 40075017 //换算一米转多少像素
            let opts0 = {color:this.flightBeltColor,weight:cc*this.flightBeltWidth,opacity:this.flightBeltOpacity};
            //重新画 农药喷洒范围
            for(var i=0;i<this.sprayLine0.length;i++){
                let line = this.sprayLine0[i];
                let points = line.getLngLats();
                var newLine = new T.Polyline(points,opts0);
                this.tMap.addOverLay(newLine);
                this.sprayLine0[i] = newLine;
                this.tMap.removeOverLay(line);
            }
        },
        /**
         * 初始化起降点信息
         */
        async initTakeoff(sid){
            if(sid){
                let data2 = {  
                    dbid: global.DBID,
                    usercode: this.usercode,
                    apiId: global.APIID_AIDO, 
                    assistid: 'TAKEOFF', //辅助名称
                    cont: "~sid ='"+sid+"'"
                }; 
                this.getDataByAPINewSync(data2).then((res)=>{ 
                    if(res.data && res.data.values){
                        let takoff = res.data.values[0];
                        let north = takoff.north 
                        if(takoff.range)
                            this.takeoffRange = takoff.range 
                        let boundary = north.split(",");
                        //创建图片对象
                        var icon = new T.Icon({
                            iconUrl: require('@/assets/air-super/lift.png'), 
                            iconSize: new T.Point(70, 70),
                            iconAnchor:new T.Point(35,70),
                        });
                        //向地图上添加自定义标注
                        this.takeoff = new T.LngLat(boundary[0], boundary[1]);
                        var marker = new T.Marker(this.takeoff,{icon: icon});
                        this.tMap.addOverLay(marker);
                    }
                }); 
            }
        },
        //清空
        clearCover(){
            if(this._timer){
                window.clearTimeout(this._timer);
                delete this._timer;
                this._timer = null;
            }
            if(this._timer2){
                window.clearTimeout(this._timer2);
                delete this._timer2;
                this._timer2 = null;
            }
            if(this._timer1){
                window.clearTimeout(this._timer1);
                delete this._timer1;
                this._timer1 = null;
            } 
            this.tMap.clearOverLays();
        },
        /**
         * 刷新
         */
        async refresh(){
            try{
                this.rightState = true;
                this.clearCover();
                this.loading = 1;
                this.taskData={};//当天任务集合
                this.airPoint=[];//初始化飞机任务点  用来确认地图基本以及中心点
                this.taskPoint=[];//任务点
                this.plane = null;//单个飞机实时点
                this.isFollow = true;//画面跟随
                this.sprayLine0=[];//喷洒轨迹（农药范围）
                this.sprayLine1=[];//喷洒轨迹（一像素的线）
                this.sprayLine2=[];//飞行轨迹（没有喷洒农药的轨迹线）
                this.sprayBreak = true;//喷洒是否中断
                this.airPoint=[];
                await this.initTask();
                for(var k in this.taskData){
                    await this.initOperDevice(this.taskData[k]);
                }
                let t1 = this.tMap.getViewport(this.airPoint);
                this.tMap.panTo(t1.center, t1.zoom);
                this.loading = 0;
            }catch(err){
                this.loading = 0;
                this.$notify.error({content:'出错了！'})
            }
        },
        /**
         * 初始化飞行预警参数
         */
        async initWarn(){
            let data2 = {  
                dbid: global.DBID,
                usercode: this.usercode,
                apiId: global.APIID_AIDO, 
                pageSize:1,
                assistid: 'GETWARN', //辅助名称
            }
            let res = await this.getDataByAPINewSync(data2);
            if(res.data && res.data.values){
                this.warn = res.data.values[0] 
            }
        },
    },
    computed: {
        sumareaFixed(){
            // console.log(this.sumarea)
            return this.sumarea.toFixed(3)
        },
    },
    //离开页面 
    destroyed(){  

    },
    watch: {
        'clientHeight': function() {
            this.setHeight()
        }, 
    }
}
</script>

<style lang="scss" scoped>
.padding0{
    padding: 0px !important;
}
.margin0{
    margin: 0px;
}
.mybtn{
    position: absolute;
    top: .1rem;
    left: .1rem;
    z-index: 500;
}
.right-content {
    width: 100%;
    overflow-y: auto;
    background-color: #004981;
} 
.header{
    position: relative;
}
.header-img{
    width: 100%;
    height: 35px;
}
.header-title {
    position: absolute;
    top: 5px;
    left: 50%;
    color: #f9f9f9;
    text-align: center;
    margin-left: -40px;
}
.nowtitle {
    width: 290px;
    height: 150px;
    margin: 0px auto;
    background-image: url(../../../..//assets/air-super/box.png);
    background-size:100% 100%;
    box-sizing: border-box;   
    color: #f9f9f9;
} 
.nowtaskname-p {
    padding-left: 5px;
    text-indent: 20px;
    line-height: 30px;
}
.nowtime {
    width: 290px;
    height: 80px;
    margin: 0px auto;
    margin-top: 10px;
    background-image: url(../../../../assets/air-super/box.png);
    background-size:100% 100%;
    box-sizing: border-box;   
     color: #f9f9f9;
}
.nowtime-header {
    width: 270px;
    height: 25px;
    line-height: 25px;
    border-left: 5px solid #185BFF;
    margin: 0px auto;
    padding-left: 10px;
    font-size: 14px;
}
.time {
    height: 55px;
    line-height: 55px;
    text-align: center;
    font-size: 20px;
}
.speed-flow{
    width: 300px;
    height: 90px;
    margin: 0px auto
}
.speed-content {
    height: 80px;
    background-image: url(../../../../assets/air-super/box.png);
    background-size:100% 100%;
    box-sizing: border-box;  
    color: #f9f9f9;
    margin: 5px;
}
.sp-title {
    width: 140px;
    height: 25px;
    line-height: 25px;
    border-left: 5px solid #185BFF;
    margin: 0px auto;
    padding-left: 10px;
    font-size: 14px;
}
</style>

