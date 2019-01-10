<template> 
    <md-layout md-flex-small="100" md-flex="100">
        <md-card class="mapcard">
            <div class="mapdiv"> 
                <div class="mybtn"> 
                    <md-layout md-row>
                        <md-layout>
                            <md-switch v-model="switchm" id="switchm" name="switchm" class="md-primary">
                                <span class="myspan">画面跟随</span>
                            </md-switch> 
                        </md-layout>
                    </md-layout> 
                </div>
                <div id="container">

                </div>
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
        this.baiduMap()
        //清覆盖物，初始化数据
        this.clear()
        
        this.setHeight()
        window.onresize = () => {
            this.clientHeight = document.body.clientHeight
        }
        // this.test()
    },
    created(){
        this.loading=1;
        this.cars();
        this.connectQ();  
        this.checkCar();
    },
    data() {
        return {
            map: {}, 
            car:{'a':'a'},//存放所有汽车 
            loading:0,
            snkey:JSON.parse(window.sessionStorage.getItem('snkey')), 
            taskCli:null, 
            switchm:false,
            gsCar:null,//跟随的车
            checkTime:null,//定时检查是否有车辆长时间未传递信息
        }
    },
    methods: {
        //创建RabbitMQ连接
        connectQ: function() {
            //初始化mqtt客户端，并连接mqtt服务
            var ws = new WebSocket(global.MQTT_SERVICE);
            this.taskCli = Stomp.over(ws);
            var headers = {
                login: global.MQTT_USERNAME, //用户名
                passcode: global.MQTT_PASSWORD, //密码
                host: global.MQTT_HOST // 虚拟空间
            };
            this.taskCli.connect(headers, this.onConnected, this.onFailed);
        },
        //连接上的
        onConnected: function(frame) { 
            // console.log("Connected: " + frame);
            //订阅频道FANOUT
            // var topic ="/exchange/" +BIPTASK +"/" + BIPTASK +"." +global.DBID +"." +this.userCode;
            this.taskCli.subscribe('/exchange/carLocus', this.responseCallback);
        },    
        //接收到信息
        responseCallback: function(frame) { 
            var c = decodeURIComponent(frame.body); 
            c = JSON.parse(c);
            var carid = c.carid;
            var longitude = c.longitude;
            var latitude = c.latitude;
            var time = c.time; 
            if(this.car[carid] && this.car[carid].points!=null && this.car[carid].points.length>0){ 
                this.car[carid].time = time;
                if(this.car[carid].state == 0){
                    this.car[carid].state =1;
                    this.map.removeOverlay(this.car[carid].icon);
                    var icon = new BMap.Icon(require('@/img/map/vehicle/car.png'), new BMap.Size(40, 40), { imageOffset: new BMap.Size(1, 1) })
                    this.car[carid].icon = new BMap.Marker(this.car[carid].dqpoint, { icon: icon })

                    this.map.addOverlay(this.car[carid].icon)
                    this.car[carid].icon.addEventListener('click',()=>{ 
                        this.map.setZoom(16) 
                        this.map.panTo(this.car[carid].dqpoint,true); 
                        this.gsCar = carid;
                    })
                }
                //设置汽车转向
                var rota = this.setRotation(this.car[carid].dqpoint, new BMap.Point(longitude,latitude))
                if(rota == 0 ){
                    rota = 360
                }

                let jl = this.getDistance(this.car[carid].dqpoint.lng,this.car[carid].dqpoint.lat,longitude,latitude);
                if(jl>0.001){
                    this.car[carid].icon.setRotation(rota)
                }
                this.map.addOverlay(this.car[carid].icon) 
                this.car[carid].dqpoint = new BMap.Point(longitude,latitude)

                if(this.switchm && this.gsCar == carid){
                    this.map.panTo(this.car[carid].dqpoint,true); 
                }

                this.car[carid].points.push(this.car[carid].dqpoint);
                this.car[carid].line.setPath(this.car[carid].points);   
                this.map.addOverlay(this.car[carid].line) 
                this.car[carid].icon.setPosition(this.car[carid].dqpoint);
                var title = `车牌号:${carid}\n经度:${longitude}\n维度:${latitude}\n上报时间:${time}`
                this.car[carid].icon.setTitle(title) 
                this.map.addOverlay(this.car[carid].icon) 
            }else{ 
                //先清除图标
                if(this.car[carid])
                    this.map.removeOverlay(this.car[carid].icon);
                //点；线；图；图坐标，上报时间，状态0离线1在线
                var onecar={points:[],line:null,icon:null,dqpoint:null,time:null,state:1};//存放所有线
                onecar.dqpoint = new BMap.Point(longitude,latitude)
                var v=[];
                v.push(onecar.dqpoint);  
                onecar.points=v;
                onecar.line = new BMap.Polyline(v,  {strokeColor:"#FC4236", strokeWeight:3, strokeOpacity:0.8}); 
                onecar.time = time;

                this.car[carid] = onecar;
                var icon = new BMap.Icon(require('@/img/map/vehicle/car.png'), new BMap.Size(40, 40), { imageOffset: new BMap.Size(1, 1) })
                onecar.icon = new BMap.Marker(this.car[carid].dqpoint, { icon: icon })

                this.map.addOverlay(onecar.icon)
                onecar.icon.addEventListener('click',()=>{ 
                    this.map.setZoom(16) 
                    this.map.panTo(this.car[carid].dqpoint,true); 
                    this.gsCar = carid;
                })

            }
        },
        //清空数据
        clear() {
            this.points = []
            this.bPoints = []
            this.i = 0
            this.areaFlag = false
            if (this.timer) {
                clearTimeout(this.timer)
            }
        },  
        //设置地图高度
        setHeight() {
            this.clientHeight = document.body.clientHeight
            document.getElementById('container').style.height = (this.clientHeight - 90) + 'px'
        }, 
        //地图初始化时获取所有设备 最后上报位置信息 点
        async cars(){
            let sorg = JSON.parse(window.sessionStorage.getItem('user')).deptInfo.cmcCode;
            let params ={
                snkey: this.snkey,
                method:'305',
                parameter:encodeURI('{"sorg":"'+sorg+'"}')
            };
            await axios.post(`${global.BIPAPIURL}vehicle`,qs.stringify(params)) .then(res=>{
                for(var i =0;i<res.data.length;i++){
                    let aa = res.data[i]
                    // {latitude: "39.954547", time: 1543466165000, carid: "京A38009", longitude: "116.314767"}
                    var onecar={points:[],line:null,icon:null,dqpoint:null,time:null};//存放所有线  
                    var icon = new BMap.Icon(require('@/img/map/vehicle/redCar.png'), new BMap.Size(40, 40), { imageOffset: new BMap.Size(1, 1) })
                    onecar.icon = new BMap.Marker( new BMap.Point(aa.longitude,aa.latitude), { icon: icon }) 
                    onecar.time=aa.time;
                    this.car[aa.carid] = onecar;
                    var title = `车牌号:${aa.carid}\n经度:${aa.longitude}\n维度:${aa.latitude}\n上报时间:${aa.time}`
                    this.car[aa.carid].icon.setTitle(title) 
                    this.map.addOverlay(onecar.icon)
                }
                this.loading=0;
            }) .catch(err=>{
                console.log(err)
                this.$notify.danger({content:'系统故障！'})
                this.loading=0;
            })
        } ,
        //计算两点之间的距离
        rad(d) {
            return d * Math.PI / 180.0;
        },
        //计算两点之间的距离
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
        //定时检查是否有车辆长时间未上报位置信息
        checkCar(){
            for(var aa in this.car){
                if(aa !='a'){
                    var nowDate = new Date();
                    var date1 = nowDate.getTime();
                    var date2 = nowDate.getTime();
                    if(this.car[aa].time){
                        var reg = new RegExp( '\\+' , "g" )
                        var newstr = this.car[aa].time.replace( reg , ' ' );
                        date2 = new Date(newstr).getTime(); 
                    }
                    if(date1-date2>(1000*60*5)){ 
                        var onecar=this.car[aa];//{points:[],line:null,icon:null,dqpoint:null,time:null};//存放所有线  
                        var title =this.car[aa].icon.getTitle();
                        var Point =this.car[aa].icon.point;
                        this.map.removeOverlay(this.car[aa].icon);

                        var icon = new BMap.Icon(require('@/img/map/vehicle/redCar.png'), new BMap.Size(40, 40), { imageOffset: new BMap.Size(1, 1) })
                        onecar.icon = new BMap.Marker( Point, { icon: icon }) 
                        onecar.time=aa.time;
                        this.car[aa] = onecar;
                        this.car[aa].icon.setTitle(title) 
                        this.map.addOverlay(onecar.icon)
                        this.car[aa].state=0
                        
                    }
                }
            }

            this.checkTime=setTimeout(() => {
                this.checkCar()
            }, 1000);
        }
    },
    //离开页面 
    destroyed(){
        this.taskCli.disconnect(function () {
            console.log("See you next time!");
        });
        if (this.checkTime) {
            clearTimeout(this.checkTime)
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
    left: 62px;
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

