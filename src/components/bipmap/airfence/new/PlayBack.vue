<template>
    <md-layout class="margin0">
        <md-tabs md-fixed>
            <md-tab id="Map" md-label="地图" class="padding0">
                <div class="mybtn">
                    <md-layout md-row >
                        <!-- class="row1" -->
                        <md-layout>
                            <md-button class="md-primary md-raised md-icon-button" @click="select('taskDialog')">
                                <md-icon>settings</md-icon>
                                <md-tooltip md-direction="right">选项</md-tooltip>
                            </md-button>
                            <md-button class="md-primary md-raised md-icon-button" @click="start">
                                <md-icon>play_arrow</md-icon>
                                <md-tooltip md-direction="right">播放</md-tooltip>
                            </md-button>
                            <md-button class="md-primary md-raised md-icon-button" @click="stop">
                                <md-icon>pause</md-icon>
                                <md-tooltip md-direction="right">暂停</md-tooltip>
                            </md-button> 
                            <md-button class="md-primary md-raised md-icon-button" @click="fastForward(forward++)">
                                <md-icon>fast_forward</md-icon>
                                <md-tooltip md-direction="right">快进{{forward}}倍</md-tooltip>
                            </md-button>
                            <!-- <div v-on:mouseenter="taskNameShow" @mouseleave="taskNameShow"  :class="tasknameClass">
                                <md-whiteframe v-if="taskNameisShow" md-elevation="1" class="taskname">{{taskName}}</md-whiteframe>
                            </div> -->
                        </md-layout>
                    </md-layout>
                    <md-layout md-row class="row2">
                        <md-switch v-model="isFollow" id="isFollow" name="isFollow" class="md-primary">
                            <span class="myspan">画面跟随</span>
                        </md-switch>
                    </md-layout>  
                </div>  
                <div id="PlayBackTMap" class="padding0"></div>
            </md-tab>

            <md-tab id="Cockpit" md-label="飞防驾驶舱" class="padding0" >
                <div class="right-content" id="cockpit">
                    <div class="header">
                        <img  class="header-img" src="@/assets/air-super/header.png" alt="">
                        <div class="header-title">
                            飞防驾驶舱
                        </div>
                    </div>
                    <div class="nowtitle">
                        <div class="nowtime-header">
                            回放任务
                        </div>
                        <div class="nowtaskname">
                            <p class="nowtaskname-p">{{taskname}}</p>   
                        </div>
                    </div>
                    <div class="nowtime">
                        <div class="nowtime-header">
                            回放时间
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
                                        <span>已飞行时长</span>
                                    </div>
                                    <div class="time">
                                        {{sumtime}}/s
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="speed-content">
                                    <div class="sp-title nowtime-header">
                                        <span>已喷洒时长</span>
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
                            喷洒面积
                        </div>
                        <div class="time">
                            {{sumareaFixed}}/亩
                        </div>
                    </div>
                </div> 
            </md-tab>

        </md-tabs>

        <md-dialog class="md-refs-dialog" ref="taskDialog">
            <md-toolbar> 
                <md-layout md-gutter md-flex="100" md-row>
                <md-layout md-flex-xsmall="90" :md-flex="true" style=" margin-top: .12rem;">
                    <h1 class="md-title">任务选择</h1> 
                </md-layout>
                <md-layout md-flex-xsmall="0" :md-flex="true"> 
                </md-layout>
                <md-layout md-flex-xsmall="10" md-flex-small="10" md-flex-medium="10" md-flex-large="10" >
                    <md-button class="md-icon-button" @click.native="closeDialog('taskDialog')">
                    <md-icon>close</md-icon>
                    </md-button>   
                </md-layout>
                </md-layout> 
            </md-toolbar>
            <md-dialog-content  v-if="dsm">
                <md-bip-input :dsm="dsm" v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog('taskDialog')">取消</md-button>
                <md-button class="md-primary" @click="getTaskData('taskDialog')">确定</md-button>
            </md-dialog-actions>
        </md-dialog>
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
        this.getCell();
    },
    mounted() {
        this.setHeight();
        this.createdMap();
        this.initWarn();
        window.onresize = () => { 
            this.setHeight();
        }
    },
    data() {
        return { 
            tabHeight:"height:100%",

            usercode:JSON.parse(window.sessionStorage.getItem("user")).userCode,
            loading:0,
            tMapDiv:"PlayBackTMap",
            tMap:null,
            tZoom:12,
            taskTjCellID:'B07ATJ',
            dsm:null,
            taskTrack:null,//天地图轨迹对象
            forward:1,//快进倍数
            flightBeltWidth:45,//幅宽
            takeoffRange:50,//起降点范围
            interval:1000,//数据上报间隔
            sprayLine0:[],//喷洒轨迹（农药范围）
            sprayLine1:[],//喷洒轨迹（一像素的线）
            sprayBreak:true,//喷洒是否中断
            flightBeltColor: "#ADFF2F",//行带颜色
            flightBeltOpacity:0.3,//航道透明度
            flightBeltWidth: 0,//航带宽度 米
            trackColor:"#FFFF00",//航迹颜色
            noFlowColor: "#F40",//未喷洒农药时的轨迹颜色
            haveFlow:[],//有流量的节点
            taskData:[],//任务数据集
            isFollow:true,//画面跟随
            // 回放时间对应的数据
            nowtime: '----',//当前时间
            nowspeed: 0,//当前速度
            nowflow: '0',//当前流量
            sumflow: '0',//当前总流量
            nowheight: '0',//当前高度
            sumtimeflow: 0,//累计喷洒时长
            sumtime: 0,//飞行时长
            taskname: "",//任务名称
            sumarea: 0,//喷洒面积
            mileage: 0,//喷洒里程

            warn:null,//预警信息
            
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
        //选择任务
        select(ref){
            this.$refs[ref].open();
        },
        //设置地图高度
        setHeight() {
            this.clientHeight = document.body.clientHeight
            document.getElementById('PlayBackTMap').style.height = (this.clientHeight - 100) + 'px'
            document.getElementById('cockpit').style.height = (this.clientHeight - 100) + 'px'
        },
        //查询对象
        async getCell(){ 
            var data1 = {
                dbid: global.DBID,
                usercode: this.usercode,
                apiId: global.APIID_CELLPARAMS,
                pcell: this.taskTjCellID,
            };
            var res = await this.getDataByAPINewSync(data1);
            var data = res.data;
            if(data.id===0){
                let cells0  = data.data.layCels[0]; 
                cells0 = await this.makeCellCL(cells0);
                this.dsm = new CDataSet(cells0);
                this.dsm.createRecord();
            }else{
                this.$notify.warning({content: data.message,placement:'mid-center'});
            }
        },
        //获取任务数据
        async getTaskData(ref){
            var isnull = this.checkNotNull(this.dsm);
            if(!isnull)
                return;
            this.$refs[ref].close();
            let currRecord = this.dsm.currRecord;
            if(this.taskTrack != null){
                this.taskTrack.clear();
                this.taskTrack = null;
            }
            this.loading = 1;
            try { 
                this.clearCover();
                this.taskname = this.dsm.currRecord.taskname; 
                this.flightBeltWidth = this.dsm.currRecord.widcloth;
                if(!this.flightBeltWidth)
                    this.flightBeltWidth=45;
                let oaid = this.dsm.currRecord.oaid;  //作业区
                let hoaid = this.dsm.currRecord.hoaid;//航空识别区
                let showarea = this.dsm.currRecord.showarea;//显示作业区
                let showhkarea = this.dsm.currRecord.showhkarea;//显示识别区
                let showroot = this.dsm.currRecord.showhkarea;//显示航线
                let takeoff = this.dsm.currRecord.takeoff;//起降点信息
                let tkid = this.dsm.currRecord.sid;//任务编码
                let bgtime = this.dsm.currRecord.bgtime;//开始时间
                let edtime = this.dsm.currRecord.edtime;//结束时间
                this.initTakeoff(takeoff);

                if(showarea == 1){
                    this.getOpera(oaid,this.tMap)//作业区
                    this.getOperaBr(oaid,this.tMap);//避让区
                }
                if(showhkarea ==1){
                    this.getOpera(hoaid,this.tMap);//航空识别区
                }
                if(showroot == 1){
                    this.getOperaRoute(oaid,this.tMap);
                }
                let data2 = {  
                    dbid: global.DBID,
                    usercode: this.usercode,
                    apiId: global.APIID_AIDO, 
                    pageSize:500000,
                    assistid: 'CORRD', //辅助名称
                    cont: ""
                }
                data2.cont ="~tkid ='" +tkid +"' and " +"speedtime >=" +"'" +bgtime +"'" +" and " +"speedtime<=" + "'" +edtime +"'";
                let vv = await this.getDataByAPINewSync(data2);
                
                if (vv.data && vv.data.values) {
                    let values = vv.data.values;
                    this.taskData = values;
                    let opt = {interval: this.interval,dynamicLine: true,
                                    polylinestyle: {color:this.noFlowColor, weight: 1, opacity: 0.9},Datas: [],
                                    carstyle:{display:true, iconUrl:require('@/assets/air-super/plane.png'), width:42, height:30},
                                    passOneNode:this.passOneNode}
                    let noFlow  = true;
                    this.haveFlow =[];
                    for(var i=0;i<values.length;i++){
                        let v = values[i];
                        let lnglat = this.bd09_To_gps84(v.latitude,v.longitude);
                        let poin = new T.LngLat(lnglat[1],lnglat[0]);
                        this.taskData[i].latitude = lnglat[0];
                        this.taskData[i].longitude = lnglat[1];
                        opt.Datas.push(poin);
                        if(v.flow>0){
                            if(noFlow){
                                v.cid = i;
                                this.haveFlow.push(v);
                            }
                            noFlow = false;
                        }else{
                            noFlow = true;
                        }
                    }

                    this.taskTrack = new T.CarTrack(this.tMap,opt);
                    this.taskTrack.start();
                    this.tMap.setZoom(15) 
                }
                this.loading = 0;
            } catch (error) {
                console.log("查询回放记录出错！")
                this.loading = 0;
            }
        },
        /**
         * 路线节点变化
         * lnglat:LngLat, index:Number, length:Number
         */
        passOneNode(LngLat,index,length){
            this.loading = 0;
            if(this.isFollow){//画面跟随
                this.tMap.panTo(LngLat);
            }
            let data = this.taskData[this.dragPoints+index-1];
            this.percent = (index+this.dragPoints)/this.taskData.length *100;
            if(data){
                this.nowtime = data.speedtime;
                this.nowspeed = data.speed; 
                this.nowflow = data.flow;
                this.nowheight = data.height;
                this.sumtime = this.sumtime + 1;
                let flow = data.flow
                if(this.takeoff){
                    let jl = this.tMap.getDistance(this.takeoff,LngLat);
                    if(jl<=this.takeoffRange){
                        this.sumflow='0';
                        this.sumarea = 0;
                    }
                }
                this.sumflow = ((parseFloat(this.sumflow+'') + parseFloat((parseFloat(this.nowflow+'')/60/60)+'')).toFixed(3))+'';
                if(flow>0){//有流量去划线
                    // 有流量的点喷洒时长+1s
                    this.sumtimeflow = this.sumtimeflow + 1;
                    this.mileage = this.mileage+data.speed /3600
                    this.mileage = parseFloat(this.mileage.toFixed(4))
                    let nowArea = this.flightBeltWidth  * data.speed *1000/3600 /666.67;
                    this.sumarea = (this.sumarea + nowArea);
                    let lgt = new T.LngLat(data.longitude, data.latitude)
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
                    
                    let msg = "";
                    //预警信息 
                    let standard=[];
                    let flow0 = (this.warn.drugload/1000)/(((this.warn.area/this.warn.area)/(this.flightBeltWidth/1000))/data.speed);
                    if(!isNaN(flow0)){
                        standard[0] = (flow0*(1-(this.warn.drugfloat/100))).toFixed(2);
                        standard[1] = (flow0*(1+(this.warn.drugfloat/100))).toFixed(2);
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
                        var marker = new T.Marker(LngLat, {icon: icon});
                        var markerInfoWin = new T.InfoWindow(msg);
                        marker.addEventListener("click", function () {
                            marker.openInfoWindow(markerInfoWin);
                        });// 将标注添加到地图中
                        this.tMap.addOverLay(marker)
                    }
                }else{
                    this.sprayBreak = true;
                }
            
                let speed = data.speed; 
            }
            // this.taskData[index-1] = null;
            if(index >= length){//最后一点
                this.taskTrack.pause()
            }
        },
        //关闭任务选择框
        closeDialog(ref){
            this.$refs[ref].close();
        },
        dataChange(res) { 
            this.dsm.checkEdit(res);
        },
        /**
         * 地图缩放结束
         */
        zoomend(){
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
            this.sprayBreak = true;
            this.stop()
            if(this.taskTrack){
                this.taskTrack.clear();
            }
            this.taskTrack = null;
            this.sprayLine0=[];//喷洒轨迹（农药范围）
            this.sprayLine1=[];//喷洒轨迹（一像素的线）
            this.dragPoints = 0;
            this.percent = 0;
            this.tMap.clearOverLays();
        },
        //开始
        start(){
            if( this.taskTrack)
                this.taskTrack.start()
        },
        //暂停
        stop(){
            if( this.taskTrack)
                this.taskTrack.pause()
        },
        //快进
        fastForward(forward){
            if(this.taskTrack){
                if(forward >=5){
                    this.forward =1;
                    forward =1
                }
                let interval = this.interval/forward;
                this.taskTrack.options.interval= interval
                this.stop();
                this.start();
            }
        },
        //检查非空项
        checkNotNull(cds) {
            for (let i = 0; i < cds.ccells.cels.length; i++) {
                var item = cds.ccells.cels[i]; 
                if (item.unNull) {
                    var vl = cds.currRecord[item.id];
                    if (!vl) {
                    this.$notify.warning({
                        content: "【" + item.labelString + "】"+this.$t('commInfo.notNull')+"！",
                        placement: "mid-center"
                    });
                    return false;
                    }
                }
            }
            return true;
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

