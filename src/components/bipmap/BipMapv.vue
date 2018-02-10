<template>
    <md-layout md-gutter md-column class="mapbody">
        <md-layout md-gutter md-row>
            <md-layout md-flex-small="100" md-flex="75">
                <md-card class="mapcard">
                    <div class="mapdiv">
                        <div class="mybtn">
                            <md-layout md-row>
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
                    </div>
                </md-card>
                <md-loading :loading="loading"></md-loading>
            </md-layout>
            <md-layout md-flex-small="100" md-flex="25" md-column>
                <md-layout md-flex="25">
                    <md-card class="mycard">
                    <echarts-line :lineseries="lineseries"></echarts-line>
                    </md-card>
                </md-layout>
                <md-layout md-flex="25">
                    <md-card class="mycard">
                        <echarts-gauge :gaugeseries="gaugeseries"></echarts-gauge>
                    </md-card>
                </md-layout>
                <md-layout md-flex="10">
                    <md-card class="mycard">
                        <div class="listTitle">异常预警信息</div>
                    </md-card>
                </md-layout>
                <md-layout md-flex="40">
                    <md-card class="cardList">
                        <!-- <md-list>
                            <md-list-item>
                                <md-icon class="md-primary">airplanemode_active</md-icon>
                                <span class="md-body-2">异常预警信息</span>
                                <md-divider class="md-inset"></md-divider>
                            </md-list-item>
                            <md-list-item v-for="(item,index) in 10" :key="index">
                                <md-icon class="md-accent">error</md-icon>
                                <span class="md-body-1">xxx飞机速度异常&nbsp;&nbsp;&nbsp;&nbsp;12:0{{index}}:00</span>
                            </md-list-item>
                        </md-list> -->
                        <!-- <div class="listTitle">异常预警信息</div> -->
                        <ul>
                            <li v-for="(item,index) in 10" :key="index">
                                <md-icon class="list-icon">error</md-icon>
                                <span class="md-body-1">xxx飞机速度异常&nbsp;&nbsp;&nbsp;&nbsp;12:0{{index}}:00</span>
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
import mapoptions from './mapoptions.js'
export default {
    mixins:[mapoptions],
    mounted() {
        //清覆盖物，初始化数据
        this.clear()
        this.baiduMap()
        this.setHeight()
        window.onresize = () => {
            this.clientHeight = document.body.clientHeight
        }
        // this.test()
    },
    created(){
        //加载option
        // this.initOption()
    },
    data() {
        return {
            map: {},
            points: [],
            pointsCollection: [],
            bPoints: [],
            //聚合点
            markers: [],
            i: 0,
            //定时器
            timer: null,
            plane: null,
            circle: {},
            clientHeight: '',
            checkbox: false,
            switchm: true,
            disbegin: true,
            dispause: true,
            loading: 0,
            planeno: '',
            taskno: '',
            earth_arc: 111.199,
            strokeOpacity:0.1,
            distance:22.5,
            gaugeseries:[],
            lineseries:[],
        }
    },
    methods: {
        clear() {
            this.points = []
            this.bPoints = []
            this.i = 0
            this.areaFlag = false
            if (this.timer) {
                clearTimeout(this.timer)
            }
        },
        select() {
            var _this = this
            this.$mapDialog.open({ diaTitle: '轨迹回放参数选择', getOpt(planeno, taskno, start, end) { _this.getTim(planeno, taskno, start, end) } })
        },
        getTim(planeno, taskno, start, end) {
            this.loading = 1
            //清楚所有覆盖物
            this.map.clearOverlays()
            this.websocketInit(planeno, taskno, start, end)
        },
        setHeight() {
            this.clientHeight = document.body.clientHeight
            document.getElementById('container').style.height = (this.clientHeight - 90) + 'px'
        },
        begin() {
            this.disbegin = true
            this.dispause = false
            this.drawPointLine()
        },
        pause() {
            this.dispause = true
            this.disbegin = false
            if (this.timer) {
                clearTimeout(this.timer)
            }
        },
        addPoint(lng, lat, planeId, taskName, speed, flow, height,ssflow,speedtime) {
            var point = { lng: lng, lat: lat, planeId: planeId, taskName: taskName, flow: flow, height: height, speed: speed,ssflow:ssflow,speedtime:speedtime }
            this.points.push(point)
            var pt = new BMap.Point(lng, lat)
            this.bPoints.push(pt)
        },
        drawPointLine() {
            var zoom = this.map.getZoom()
            // console.log(zoom)
            var linePoints = []
            linePoints.push(new BMap.Point(this.points[this.i].lng, this.points[this.i].lat))
            linePoints.push(new BMap.Point(this.points[this.i + 1].lng, this.points[this.i + 1].lat))
            
            //创建折线 轨迹
            var polyline = new BMap.Polyline(linePoints, { strokeColor: "red", strokeWeight: 3, strokeOpacity: 1 })
            var opts = {
                width:0,
                height:0,
                title:`任务名称:${this.points[this.i].taskName}<br/>飞机编号:${this.points[this.i].planeId}<br/>高度:${this.points[this.i].height}(m)<br/>速度:${this.points[this.i].speed}(km/h)<br/>流量:${this.points[this.i].ssflow}(m3/h)<br/>时间:${this.points[this.i].speedtime}`,
                enableAutoPan:false
            }
            var infowin = new BMap.InfoWindow('',opts)
            polyline.addEventListener('mouseover',()=>{
                this.map.openInfoWindow(infowin,linePoints[0])
            })
            polyline.addEventListener('mouseout',()=>{
                this.map.closeInfoWindow()
            })
            //flow!=0的逻辑
            if(this.i && this.i+1){
                if (this.points[this.i].ssflow != '0.000000' && this.points[this.i+1].ssflow != '0.000000') {
                    var a1 = this.setRota(this.points[this.i-1],this.points[this.i])
                    var a2 = this.setRota(this.points[this.i],this.points[this.i+1])
                    if (a1 != a2 && (this.i - 1) && (this.points[this.i - 1].ssflow != '0.000000')) {
                        this.drawTri(this.points[this.i-1],this.points[this.i],this.points[this.i+1])
                    }
                    this.getFlowArea(this.points[this.i], this.points[this.i + 1])
                }
                //结尾加喷洒遗留
                if(this.i-1 && this.points[this.i].ssflow != '0.000000'
                        && this.points[this.i-1].ssflow != '0.000000' && this.points[this.i+1].ssflow == '0.000000'){
                    this.drawHM(this.points[this.i-1],this.points[this.i])
                }
            }
            this.drawCircleLine(this.i)
            //获取喷洒区域
            if (this.i == 0) {
                //第一次进入设置放大级别18 
                this.map.setZoom(19)
            }
            //加入两点连线
            this.map.addOverlay(polyline)
            //赋值给echarts
            this.gaugeseries = []
            this.lineseries = []
            //速度，流量，高度
            this.gaugeseries.push(this.points[this.i].speed)
            this.gaugeseries.push(this.points[this.i].height)
            this.lineseries.push({id:this.i,ssflow:this.points[this.i].ssflow,speedtime:this.points[this.i].speedtime})
            //画面跟随
            if (this.switchm) {
                this.map.panTo(linePoints[0])
            }
            //设置飞机转向
            var rota = this.setRota(this.points[this.i], this.points[this.i + 1])
            if(rota == 0 ){
                rota = 360
            }
            this.plane.setRotation(rota)
            //title
            var title = `任务名称:${this.points[this.i].taskName}\n飞机编号:${this.points[this.i].planeId}\n高度:${this.points[this.i].height}(m)\n速度:${this.points[this.i].speed}(km/h)\n流量:${this.points[this.i].ssflow}(m3/h)\n时间:${this.points[this.i].speedtime}`
            this.plane.setTitle(title)
            this.i++
            this.plane.setPosition(new BMap.Point(this.points[this.i].lng, this.points[this.i].lat))
            this.timer = setTimeout(this.drawPointLine, 1000)
        },
        drawTri(p1,p2,p3){
            //A,B
            var az1 = this.getAzimuth(p1.lng,p1.lat,p2.lng,p2.lat)
            var paz1 = this.getPointAz(p1,p2,az1).split(',')
            //B,C
            var az2 = this.getAzimuth(p2.lng,p2.lat,p3.lng,p3.lat)
            var paz2 = this.getPointAz(p2,p3,az2).split(',')
            //A,B
            var pz1_1 = this.getOtherPoint(p2.lng, p2.lat,this.distance, paz1[2]).split(',')
            var pz1_2 = this.getOtherPoint(p2.lng,p2.lat,this.distance,paz1[3]).split(',')
            //B,C
            var pz2_1 = this.getOtherPoint(p2.lng, p2.lat,this.distance, paz2[0]).split(',')
            var pz2_2 = this.getOtherPoint(p2.lng,p2.lat,this.distance,paz2[1]).split(',')
            var tri1 = [],tri2 = []
            tri1.push(new BMap.Point(pz1_1[0],pz1_1[1]))
            tri1.push(new BMap.Point(p2.lng,p2.lat))
            tri1.push(new BMap.Point(pz2_1[0],pz2_1[1]))

            tri2.push(new BMap.Point(pz1_2[0],pz1_2[1]))
            tri2.push(new BMap.Point(p2.lng,p2.lat))
            tri2.push(new BMap.Point(pz2_2[0],pz2_2[1]))
            var opts = {
               strokeColor: "#f1c721", 
               strokeWeight: 1, 
               strokeOpacity: this.strokeOpacity,
               fillColor:'#f1c721',
               fillOpacity:0.3
            }
            var polygon1 = new BMap.Polygon(tri1,opts)
            var polygon2 = new BMap.Polygon(tri2,opts)
            this.map.addOverlay(polygon1)
            this.map.addOverlay(polygon2)
        },
        //半弧面
        drawHM(p1,p2){
            var az = this.getAzimuth(p1.lng,p1.lat,p2.lng,p2.lat)
            var paz = this.getPointAz(p1, p2, az).split(',')    //270 < 90 false 90 
            paz[0] = parseInt(paz[0])
            paz[1] = parseInt(paz[1])
            if(paz[0]>=360 && paz[1]>=360){
                paz[0] = paz[0] - 360//180
                paz[1] = paz[1] - 360//0
            }
            var sdeg = paz[0]<paz[1]?paz[0]:paz[1]//0
            var deg = 180
            if(this.setRota(p1,p2)>= -180 && this.setRota(p1,p2)<0){
                deg = -180
            }
            var hmp = []
            hmp.push(new BMap.Point(p2.lng,p2.lat))
            for(var i = 0;i < 9; i++){
                var p = this.getOtherPoint(p2.lng,p2.lat,this.distance,sdeg + deg/8 * i).split(',')
                hmp.push(new BMap.Point(p[0],p[1]))
            }
            hmp.push(new BMap.Point(p2.lng,p2.lat))
            var opts = {
                fillColor:'#f1c721',
                fillOpacity:0.3,
                strokeColor:'#f1c721',
                strokeOpacity:this.strokeOpacity,
                strokeWeight: 1
            }
            var polygon = new BMap.Polygon(hmp,opts)
            this.map.addOverlay(polygon)
        },
        sleep(mills){
            var now = new Date()
            var exitTime = now.getTime() + mills
            while(true){
                now = new Date()
                if(now.getTime()>exitTime){
                    return
                }
            }
        },
        drawCircleLine(i){
            var linePoints = []
            if(i!=0 && i%5 == 0){
                for(var j = i-5;j < i;j++){//3 0,1,2,3 6 3,4,5,6
                    linePoints = []
                    if(this.points[j+1]){
                        linePoints.push(new BMap.Point(this.points[j].lng, this.points[j].lat))
                        linePoints.push(new BMap.Point(this.points[j+1].lng, this.points[j+1].lat))
                        var polyline = new BMap.Polyline(linePoints, { strokeColor: "red", strokeWeight: 3, strokeOpacity: 1 })
                        this.map.addOverlay(polyline)
                    }
                }
            }
        },
        //获取喷洒区域
        getFlowArea(p1, p2) {
            //存放上两个点
            /* a1 a2 b2 b1
               b1 b2 c2 c1 
             */
            var areap = []
            var az, a1, a2, b1, b2, paz
            //获取轨迹方位角
            az = this.getAzimuth(p1.lng, p1.lat, p2.lng, p2.lat)
            //获取4点方位角
            paz = this.getPointAz(p1, p2, az).split(',')
            /* 获取两个点的4点坐标 */
            a1 = this.getOtherPoint(p1.lng, p1.lat, this.distance, paz[0])
            a2 = this.getOtherPoint(p1.lng, p1.lat, this.distance, paz[1])
            b2 = this.getOtherPoint(p2.lng, p2.lat, this.distance, paz[3])
            b1 = this.getOtherPoint(p2.lng, p2.lat, this.distance, paz[2])
            areap.push(new BMap.Point(a1.split(',')[0], a1.split(',')[1]))
            areap.push(new BMap.Point(a2.split(',')[0], a2.split(',')[1]))
            areap.push(new BMap.Point(b2.split(',')[0], b2.split(',')[1]))
            areap.push(new BMap.Point(b1.split(',')[0], b1.split(',')[1]))
            //放第二个point的两个点
            var polygon = new BMap.Polygon(areap, { strokeColor: "#f1c721", strokeWeight: 1, strokeOpacity: this.strokeOpacity,fillColor:'#f1c721',fillOpacity:0.3 })
            this.map.addOverlay(polygon)    
            
        },
        setZoom(bPoints) {
            var view = this.map.getViewport(eval(bPoints));
            var mapZoom = view.zoom;
            var centerPoint = view.center;
            this.map.centerAndZoom(centerPoint, mapZoom);
        },
        websocketInit(planeno, taskno, startTime, endTime) {
            this.clear()
            this.randomId = Math.ceil(Math.random()*100)
            this.planeno = planeno || 'planeno'
            this.taskno = taskno || 'taskno'
            if ('WebSocket' in window) {
                this.websocket = new WebSocket(`${global.WEBSOCKET_WS}/${this.planeno}/${this.taskno}/${startTime}/${endTime}`)
            } else {
                console.log('not support')
            }
            if (this.i == 5) {
                // this.websocket.send('请服务器发送消息')
            }
            this.websocket.onerror = () => console.log('error')
            this.websocket.onopen = () => console.log('连接成功')
            this.websocket.onclose = () => console.log('连接断开')
            this.websocket.onmessage = event => {
                if (this.planeno == 'planeno' || this.taskno == 'taskno') {
                    // console.log('marker')
                    if (event.data != '201') {
                        //加载飞机marker
                        this.getPlaneIcon(event.data)
                        this.loading = 0
                    }
                } else {
                    // console.log('gj')
                    //为某一具体飞机添加轨迹
                    this.getGuiJi(event.data)
                }
            }
            //窗口关闭时，主动关掉websocket连接，防止server端异常
            window.onbeforeunload = () => this.closeWebSocket()
        },
        closeWebSocket() {
            this.websocket.close()
        },
        getGuiJi(e) {
            e = JSON.parse(e)
            //201代表完成所有点的获取
            if (e == '404') {
                this.$notify.warning({ content: '无轨迹数据' })
                this.loading = 0
            } else if (e != '201') {
                this.addPoint(e.lng, e.lat, e.planeId, e.taskName, e.speed, e.flow, e.height,e.ssflow,e.speedTime)
            } else {
                //加载轨迹线
                // setTimeout(this.drawLine(),100)
                //加载飞机marker
                this.loadPlane()
                //加载完成，释放开始按钮
                this.disbegin = false
                this.loading = 0
                this.begin()
            }
        },
        loadPlane() {
            //清掉覆盖物
            // this.map.clearOverlays()            
            var icon = new BMap.Icon(require('@/img/plane.png'), new BMap.Size(30, 30), { imageOffset: new BMap.Size(1, 1) })
            this.plane = new BMap.Marker(this.points[0], { icon: icon })
            this.map.addOverlay(this.plane)
        },
        getPlaneIcon(e) {
            var pt = {}
            pt = JSON.parse(e)
            var icon = new BMap.Icon(require('@/img/plane.png'), new BMap.Size(30, 30), { imageOffset: new BMap.Size(1, 1) })
            var title = `飞机:${pt.planeId}\n任务:${pt.taskName}`
            var point = { lng: pt.lng, lat: pt.lat }
            var planeMarker = new BMap.Marker(point, { icon: icon, title: title })
            this.map.addOverlay(planeMarker)
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
//异常列表
.cardList{
    display: block;
    background-color: #f4f4f4 !important;
    ul{
        padding: 0;
    }
    ul li{
        list-style-type: none;
        margin-top:.1rem;
        height: .4rem;
        line-height: .4rem;
        padding-left:.1rem;
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
}

.mybtn {
    position: absolute;
    top: 10px;
    left: 52px;
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

