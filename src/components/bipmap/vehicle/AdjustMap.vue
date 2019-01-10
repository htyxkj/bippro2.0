<template>
    <md-layout md-gutter md-column class="mapbody">
        <md-layout md-gutter md-row> 
            <md-layout md-flex-small="100" md-flex="25"> 
                <md-card class="adjuscardtop"> 
                    <!-- <md-layout style="height:.4rem">
                        待调度任务
                    </md-layout>  -->
                    <!--<ul> 
                        <md-layout v-for="(item, index) in adjustTask" :key="index" >
                            <li v-on:click="checkTask(index)" md-elevation="6"><md-radio v-model="radio1"  :md-value="index" class="md-primary">{{item.smake}}-{{item.out_time}}-{{item.m_first}}-{{item.destin}}-{{item.car_number}}人</md-radio></li>
                        </md-layout> 
                    </ul> -->
                    <ul class = "adList" >
                        <li style="height:.4rem;line-height: .4rem;">待调度任务</li>  
                        <li v-for="(item, index) in adjustTask" :key="index" v-on:click="checkTask(index)" >
                            <md-radio v-model="radio1"  :md-value="index" class="md-primary">{{item.smake}}-{{item.out_time}}-{{item.m_first}}-{{item.destin}}-{{item.car_number}}人</md-radio>
                        </li> 
                    </ul>
                </md-card>
                <md-card class="adjuscardbottom"> 
                    <md-layout class = "adjustList" >
                        <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33"> 
                            <md-bip-input-ref  :cell="carcell" :modal="carmodal" :ref="carcell.id" @change="carChange"></md-bip-input-ref>
                        </md-layout>
                        <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33"> 
                            <md-bip-input-ref  :cell="drcell" :modal="drmodal" :ref="drcell.id" @change="drChange"></md-bip-input-ref>
                        </md-layout>
                        <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33"> 
                            <md-button class="md-raised md-primary btn" v-on:click="doAdjust">发布任务</md-button>
                        </md-layout> 
                    </md-layout>
                </md-card>
            </md-layout>
            <md-layout md-flex-small="100" md-flex="75">
                <md-card class="mapcard">
                    <div class="mapdiv"> 
                        <div id="container"></div>
                    </div>
                </md-card> 
            </md-layout> 
        </md-layout>  
        <md-loading :loading="loading"></md-loading>
    </md-layout> 
</template>

<script>
import qs from 'qs'
import axios from 'axios'
import baiduMap from '../js/baiduMap.js'  
export default {
    mixins:[baiduMap],
    data() {
        return {
            map: {},
            loading:0,
            geocoder : null,
            param:{
                apiId: "assisto",
                dbid: `${global.DBID}`,
                usercode: JSON.parse(window.sessionStorage.getItem('user')).userCode, 
                page:1,
                assistid: null,
                cont:null,
            },
            adjustTask:[],//待调度列表
            dirid:"",//驾驶员
            carid:"",//车牌号
            //车牌号辅助
            carmodal:{
                id:'',
            },
            carcell:{
              assist:true, 
              editName:"CARID",
              editType:0,
              id:"carid",
              index:0,
              isReq:false,
              isShow:true,
              labelString:"车 牌 号",  
            },
            //驾驶员辅助
            drmodal:{
                sid:'',
            },
            drcell:{
                editName:"DRIVID",
                editType:0,
                id:"sid",
                index:0,
                isReq:false,
                labelString:"驾驶员",
                refValue:"{&DRIVID}",
            },
            radio1:0,
            snkey:"",
        }
    },
    mounted() {
        this.baiduMap()
        this.map.centerAndZoom(new BMap.Point(103.388611,43.563611), 5); //设置地图中心点
        this.setHeight()
        //清覆盖物，初始化数据
        this.clear()
        window.onresize = () => {
            this.clientHeight = document.body.clientHeight
        } 
        this.creatGeocoder();
        this.getAdjust();
        this.snkey= JSON.parse(window.sessionStorage.getItem('snkey')) 
    },
    created(){ 
    },
    methods: {
        //创建一个地址解析器
        creatGeocoder(){
            this.geocoder= new BMap.Geocoder();
        },
        clear() {
            //清除地图上的覆盖物
            this.map.clearOverlays()    
        },
        //设置地图高度
        setHeight() {
            this.clientHeight = document.body.clientHeight
            document.getElementById('container').style.height = (this.clientHeight - 90) + 'px'
        },
        //点击待调度任务
        checkTask(index){ 
            this.radio1=index;
            let _this = this;
            let address = this.adjustTask[index].m_first;
            this.geocoder.getPoint(address,function(e){
                if(e!=null){
                    _this.clear()
                    _this.map.centerAndZoom(new BMap.Point(e.lng,e.lat), 16);
                    var icon = new BMap.Icon(require('@/img/map/vehicle/start.png'), new BMap.Size(30, 30), { imageOffset: new BMap.Size(1, 1) })
                    let plane = new BMap.Marker(e, { icon: icon })
                    _this.map.addOverlay(plane)
                }
            },"");
        },
        loadPlane() {        
            var icon = new BMap.Icon(require('@/img/map/vehicle/car.png'), new BMap.Size(30, 30), { imageOffset: new BMap.Size(1, 1) })
            this.plane = new BMap.Marker(this.points[0], { icon: icon })
            this.map.addOverlay(this.plane)
        }, 
        //获取带调度任务
        getAdjust(){
            //辅助：GETADJUST
            let _this = this;
            let params = this.param; 
            params.assistid="GETADJUST";
            params.pagesize=100000;
            axios.post(`${global.BIPAPIURL}`+`${global.API_COM }`,qs.stringify(params)) .then(res=>{
                console.log(res.data);
                _this.adjustTask=res.data.values;
            }) .catch(err=>{
                console.log(err)
            })
        },
        carChange(data){ 
            console.log(data);
            this.carid=data.value["id"]; 
        },
        drChange(data){
             this.dirid=data.value["sid"]; 
        },
        //进行调度
        doAdjust(){ 
            if(this.adjustTask ==null||this.adjustTask.length==0){
                this.$notify.danger({content:'暂无可调度任务！'})
                return;
            }
            let sid = this.adjustTask[this.radio1].sid; 
            
            if(sid==null||sid==""){
                this.$notify.danger({content:'请选择调度任务！'})
                return;
            }

            if(this.carid==null||this.carid==""){
                this.$notify.danger({content:'请选择车牌号！'})
                return;
            }
            if(this.dirid==null||this.dirid==""){
                this.$notify.danger({content:'请选择驾驶员！'})
                return;
            } 
            let _this =this;
            this.loading=1;
            let params ={
                snkey: this.snkey,
                method:'300',
                parameter:encodeURI('{"sid":"'+sid+'","carid":"'+this.carid+'","dirid":"'+this.dirid+'"}')
            };
            axios.post(`${global.BIPAPIURL}vehicle`,qs.stringify(params)) .then(res=>{
                console.log(res.data);
                if(res.data.code==0){
                    this.$notify.success({content:'发布成功！'})
                    _this.getAdjust();
                }
                this.loading=0;
            }) .catch(err=>{
                console.log(err)
                this.$notify.danger({content:'系统故障！'})
                this.loading=0;
            })
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
.adjuscardbottom{
    margin-left: .15rem;
    margin-top: 0px;
    height: 27%;
}
.adjuscardtop{
    margin-left: .15rem;
    margin-bottom: 0px;
    height: 68%;
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
.mycard{ 
    overflow: hidden;
    display: flex;  
}
.adList{
    padding: 0; 
    background-color: #f4f4f4 !important; 
    li{
    padding-left: .2rem;
    list-style-type: none;
    overflow:hidden;  
    height: .8rem; 
    background-color: #fff; 
    line-height: .8rem;
    } 
}
li{ 
    list-style-type: none; 
} 
.adjustList{ 
    padding-left: .2rem;
    background-color: #f4f4f4 !important;  
}
.btn{
    margin-left: 0px; 
    width: 98%;
}
  
</style>

