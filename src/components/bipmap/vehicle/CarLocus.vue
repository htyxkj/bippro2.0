<template> 
            <md-layout md-flex-small="100" md-flex="100">
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
                                    <md-button class="md-primary md-raised md-icon-button" @click="fast">
                                        <md-icon>fast_forward</md-icon>
                                        <md-tooltip md-direction="right">快进{{fastn}}倍</md-tooltip>
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
</template>

<script>
import qs from 'qs'
import axios from 'axios'
import baiduMap from '../js/baiduMap.js'  
export default {
    mixins:[baiduMap],
    mounted() {
        
        this.baiduMap();
        this.setHeight();
        //清覆盖物，初始化数据 
        this.clear();
        window.onresize = () => {
            this.clientHeight = document.body.clientHeight
        } 
    },
    created(){ 
    },
    data() {
        return {
            carid:'',
            map: {}, 
            loading:0,
            i:0,
            fastn:1,//快进倍数
            switchm: true,//画面跟随
            disbegin: true,//开始
            dispause: true,//暂停
            values:null,//  value 点
            car:null,//车
            line:null,//线
            points:[],//点
            timer:null,//定时
            fastnum:1,//快放参数
            fastn:0,//快放参数
            param:{
                apiId: "assisto",
                dbid: `${global.DBID}`,
                usercode: JSON.parse(window.sessionStorage.getItem('user')).userCode,
                pageSize:500000,
                page:1,
                assistid: null,
                cont:null,
            },
        }
    },
    methods: {
        clear() { 
            this.map.clearOverlays();
            this.fastn=1;this.values=null;this.car=null;this.line=null;this.points=[];this.carid='';
            this.i = 0 
            if (this.timer) {
                clearTimeout(this.timer)
            }
        },  
        setHeight() {
            this.clientHeight = document.body.clientHeight
            document.getElementById('container').style.height = (this.clientHeight - 90) + 'px'
        },   
        loadPlane() {
            //清掉覆盖物
            // this.map.clearOverlays()            
            var icon = new BMap.Icon(require('@/img/map/vehicle/car.png'), new BMap.Size(30, 30), { imageOffset: new BMap.Size(1, 1) })
            this.plane = new BMap.Marker(this.points[0], { icon: icon })
            this.map.addOverlay(this.plane)
        }, 
        //查询任务
        select() {
            // this.progressBar.distance=11;
            var _this = this
            this.$mapCarDialog.open({ diaTitle: '轨迹回放参数选择', getOpt(carid,zdsid, start, end) { _this.getTim(carid,zdsid, start, end) } })
        },  
        //查询回放数据
        async getTim(carid,zdsid,startT,endT){ 
            this.clear();
            this.carid = carid;
            this.loading=1;
            //CARLOCUS
            this.param.assistid="CARLOCUS";
            this.param.cont="~zdsid='"+zdsid+"' and time >='"+startT+"' and time<='"+endT +"'";
            let _this = this;
            await axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`, qs.stringify(this.param)).then(res => {
                 if(res.data.total ==0){
                    _this.$notify.success({content:"暂无数据"}) 
                    _this.loading=0;
                    return;
                } 
                _this.values = res.data.values;
                _this.begin() ;
                _this.loading=0;
            });
        },
        loadCar(){ 
            var piont = this.values[this.i]; 
            var longitude = piont.longitude;
            var latitude = piont.latitude;
            var time = piont.time;  

            if(this.switchm){
                this.map.panTo(new BMap.Point(longitude,latitude),true); 
            }


            this.points.push(new BMap.Point(longitude,latitude));  
            
            if(this.i==0){ 
                this.map.setZoom(16) 
                this.line = new BMap.Polyline(this.points,  {strokeColor:"#FC4236", strokeWeight:3, strokeOpacity:0.8}); 
                var icon = new BMap.Icon(require('@/img/map/vehicle/car.png'), new BMap.Size(40, 40), { imageOffset: new BMap.Size(1, 1) });
                this.car = new BMap.Marker(new BMap.Point(longitude,latitude), { icon: icon });
            }else{
                //设置汽车转向
                var piont_1 = this.values[this.i-1]; 
                var longitude_1 = piont_1.longitude;
                var latitude_1 = piont_1.latitude;
                var rota = this.setRotation( new BMap.Point(longitude_1,latitude_1),new BMap.Point(longitude,latitude))
                if(rota == 0 ){
                    rota = 360
                }
                var jl = this.getDistance(longitude_1,latitude_1,longitude,latitude);
 
                if(jl>0.001){
                    this.car.setRotation(rota)
                }


                this.map.addOverlay(this.car) 

                var title = `车牌号:${this.carid}\n经度:${longitude}\n维度:${latitude}\n上报时间:${time}`
                this.car.setTitle(title);
                this.car.setPosition(new BMap.Point(longitude,latitude));

                this.line.setPath(this.points)
            }


            this.map.addOverlay(this.car);
            this.map.addOverlay(this.line);
            this.i++;
            if(this.i != this.values.length){
                this.timer=setTimeout(() => {
                    this.loadCar();
                }, this.fastnum * 1000);
            }
        },
        //开始
        begin() { 
            this.disbegin = true
            this.dispause = false
            this.map.addEventListener("zoomend", this.getCenterAndZoom); 
            this.loadCar();
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
        rad(d) {
            return d * Math.PI / 180.0;
        },
        getDistance(lat1,lng1,lat2,lng2) {
            var radLat1 = this.rad(lat1);
            var radLat2 = this.rad(lat2);
            var a = radLat1 - radLat2;
            var b = this.rad(lng1) - this.rad(lng2);
            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
                    + Math.cos(radLat1) * Math.cos(radLat2)
                    * Math.pow(Math.sin(b / 2), 2)));
            s = s * 6378.137;
            s =(Math.round(s * 10000) / 10000).toFixed(3);
            return s;
        },
    },
    destroyed(){
        this.clear();
    },
    watch: {
        'clientHeight': function() {
            this.setHeight()
        },
    }
}
</script>

<style lang="scss" scoped>
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
</style>

