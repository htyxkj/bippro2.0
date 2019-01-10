<template> 
    <md-layout md-flex-small="100" md-flex="100">
      <md-layout md-flex-small="100" md-flex="25"> 
        <md-card class="fencetopcard" v-if="show">  
          <md-layout style="padding-left: .2rem;" >
            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100"> 
              <md-input-container>
                <label>围栏名称</label>
                <md-input v-model="name"></md-input>  
              </md-input-container>
            </md-layout> 
            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100"> 
              <md-bip-input-ref  :cell="carcell" :modal="carmodal" :ref="carcell.id" @change="carChange"></md-bip-input-ref>
            </md-layout> 
            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100"> 
              <md-bip-input-list :cell="tycell" :modal="tymodal" :ref="tycell.id" @change="tyChange"></md-bip-input-list>
            </md-layout> 
            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100"> 
              <md-input-container>
                <label>开始时间</label>
                <md-date btime="min"  btimeformat="YYYY-MM-DD HH:mm:ss" v-model="bgtime"></md-date>  
              </md-input-container>
            </md-layout>
            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100"> 
              <md-input-container>
                <label>结束时间</label>
                <md-date btime="min" btimeformat="YYYY-MM-DD HH:mm:ss" v-model="edtime"></md-date>  
              </md-input-container>
            </md-layout>
            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33"> 
                <md-button class="md-raised md-primary btn" v-on:click="add">提交</md-button>
            </md-layout> 
          </md-layout>
        </md-card>
        <md-card class="fencebottomcard"> 
          <ul class="adList"> 
            <md-layout md-gutter v-for="(item, index) in fenceArr" :key="index">
              <md-layout md-flex="65" >
                <li  v-on:click="checkenmap(index,item.enmap)" > {{item.name}}</li> 
              </md-layout>
              <md-layout md-flex="35"><md-button class="md-mini  md-primary" style="margin:0px" v-on:click="delFence(index,item.id)">删除</md-button></md-layout>
            </md-layout>
          </ul>
        </md-card>
      </md-layout>
      <md-layout md-flex-small="100" md-flex="75">
        <md-card class="mapcard">  
          <div class="mybtnpc">
            <md-layout md-row>
              <md-layout> 
                <md-button class="md-primary md-raised md-icon-button" @click="clear">
                  <md-icon>delete</md-icon>
                  <md-tooltip md-direction="right">清除围栏数据</md-tooltip>
                </md-button>   
              </md-layout>
            </md-layout> 
          </div>
          <div id="container"></div>
        </md-card>
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
    async mounted() { 
      this.snkey= JSON.parse(window.sessionStorage.getItem('snkey')) 
      var cell={cels:[{  
          id:"entype", 
          labelString:"监控类型", 
          refValue:"{$ENTYPE}",
          type:12, 
      }]}
      var cells0 = await this.makeCellCL(cell);
      await this.getFence();
      this.show=true; 
      this.baiduMap()          
      //清覆盖物，初始化数据
      this.clear()
      this.setHeight()
      this.bdDrawingManager() 
      window.onresize = () => {
          this.clientHeight = document.body.clientHeight
      }  
    }, 
    data() {
        return {
            param:{
              apiId: "assisto",
              dbid: `${global.DBID}`,
              usercode: JSON.parse(window.sessionStorage.getItem('user')).userCode, 
              page:1,
              assistid: null,
              cont:null,
            },
            show:false,
            map: {}, 
            loading:0, 
            drawingManager:null,//鼠标绘制工具
            edtime:null,//开始时间
            bgtime:null,//结束时间
            name:'',//围栏名称
            entype:'',//监控类别
            carid:'',//车牌号
            enmap:'',//经纬度信息

            //车牌号辅助
            carmodal:{
                carid:'',
            },
            carcell:{ 
              assist:true,
              attr:2097160,
              editName:"CARID",
              editType:0,
              id:"carid",
              index:0,
              isReq:false,
              isShow:true,
              labelString:"车 牌 号",  
            },
            //监控类别辅助
            tymodal:{ 
              entype:''
            },
            tycell:{  
                id:"entype", 
                labelString:"监控类型", 
                refValue:"{$ENTYPE}",
                type:12, 
            },
            fenceArr:[],
            snkey:"",
        }
    },
    methods: {
        async getCell(){  
          var cell={cels:[{  
                id:"entype", 
                labelString:"监控类型", 
                refValue:"{$ENTYPE}",
                type:12, 
            }]}
          var cells0 = await this.makeCellCL(cell); 
        },
        clear() {
            //清除地图上的覆盖物
            this.map.clearOverlays()    
        },  
        setHeight() {
            this.clientHeight = document.body.clientHeight
            document.getElementById('container').style.height = (this.clientHeight - 90) + 'px'
        },
        myFun(result){
          var cityName = result.name;
          this.map.setCenter(cityName);  
          this.map.setZoom(10);
        },
        //实例化鼠标绘制工具
        bdDrawingManager(){ 
          	//根据IP定位
            var myCity = new BMap.LocalCity();
            myCity.get(this.myFun);
            var styleOptions = {
                strokeColor:"red",    //边线颜色。
                // fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 3,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.5,	   //边线透明度，取值范围0 - 1。
                fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
            }
            this.drawingManager = new BMapLib.DrawingManager(this.map, {
                isOpen: false, //是否开启绘制模式
                enableDrawingTool: true, //是否显示工具栏
                // drawingMode:BMAP_DRAWING_POLYGON,//绘制模式  多边形
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                    drawingModes:[
                        // BMAP_DRAWING_MARKER,// 画点 
                        // BMAP_DRAWING_CIRCLE,//  画圆 
                        BMAP_DRAWING_POLYLINE,//  画线 
                        BMAP_DRAWING_POLYGON ,// 画多边形 
                        BMAP_DRAWING_RECTANGLE,//  画矩形
                    ]
                },
                circleOptions: styleOptions, //圆的样式
                polylineOptions: styleOptions, //线的样式
                polygonOptions: styleOptions, //多边形的样式
                rectangleOptions: styleOptions //矩形的样式
            }); 
            //添加鼠标绘制工具监听事件，用于获取绘制结果
            this.drawingManager.addEventListener('overlaycomplete', this.overlaycomplete);  
        },
        //输出绘制点信息
        overlaycomplete(e){ 
            this.enmap="";
            var path = e.overlay.getPath();//Array<Point> 返回多边型的点数组
            if(path.length<=2){
              this.$notify.warning({content:'请绘制正确的围栏(两点以上)！'})
              this.clear();
              return ;
            }
            for(var i=0;i<path.length;i++){
              if(i==path.length-1){
                this.enmap+=path[i].lng+","+path[i].lat;
              }else{
                this.enmap+=path[i].lng+","+path[i].lat+";";
              }
            }
        }, 
        //监控类型
        tyChange(data){
          this.entype=data.value;
        },
        //车牌号
        carChange(data){ 
          this.carid="";
          for(var i=0;i<data.value.length;i++){
            if(i==data.value.length-1){
              this.carid += data.value[i]["id"]; 
            }else{
              this.carid += data.value[i]["id"]+";"; 
            }
          } 
        },
        //提交数据
        add(){
          if(this.enmap==null||this.enmap==""){
            this.$notify.danger({content:'请绘制围栏范围'});
            return;
          }
          if(this.name==null||this.name==""){
            this.$notify.danger({content:'请填写围栏名称'});
            return;
          }
          if(this.carid==null||this.carid==""){
            this.$notify.danger({content:'请选择车牌'});
            return;
          }
          if(this.entype==null||this.entype==""){
            this.$notify.danger({content:'请选择监控类型'});
            return;
          }
          var data1 = {
            "dbid": `${global.DBID}`,
            "usercode": JSON.parse(window.sessionStorage.getItem('user')).userCode,
            "apiId": "savedata", //cellparam pbuid=21243&pmenuid=22403
            "pcell": 'A90003',
            "jsonstr": '{"name":"'+this.name+'","carid":"'+this.carid+'","entype":"'+this.entype+'","bgtime":"'+this.bgtime+'","edtime":"'+this.edtime+'","isopen":"0","enmap":"'+this.enmap+'"}',
            "datatype":1
          }; 
          this.loading=1;
          let _this =this;
          axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
              if(res.data.id==0){
                _this.$notify.success({content:'保存成功'})
              }else{
                _this.$notify.danger({content:'保存失败'})
              }
              _this.clear();
              _this.enmap="";
              _this.getFence();
              _this.loading=0;
          }) .catch(err=>{
              console.log(err)
              _this.$notify.danger({content:'系统故障！'})
              _this.loading=0;
          })

        },
        //查询已有的电子围栏 
        async getFence(){
          let _this = this;
          let params = this.param; 
          params.assistid="GETFENCE";
          params.pagesize=100000;
          await axios.post(`${global.BIPAPIURL}`+`${global.API_COM }`,qs.stringify(params)) .then(res=>{
              _this.fenceArr=res.data.values;
          }) .catch(err=>{
              console.log(err)
          })
        },
        //绘制多边形覆盖物
        checkenmap(index,data){
          var item  =  this.fenceArr[index]; 
          this.clear();
          var arr = data.split(";");
          var point=[];
          for(var i=0;i<arr.length;i++){
            var _a = arr[i].split(",");
            point.push(new BMap.Point(_a[0],_a[1]));
          }
          var polygon = new BMap.Polygon(point, {strokeColor:"red", strokeWeight:3, strokeOpacity:0.5});  //创建多边形 
          this.map.addOverlay(polygon);           //增加多边形  
          this.map.setViewport(point);//根据提供的地理区域或坐标设置地图视野，调整后的视野会保证包含提供的地理区域或坐标
          var opts = {
            width : 200,     // 信息窗口宽度
            height: 100,     // 信息窗口高度
            title : item.name , // 信息窗口标题
            enableMessage:true,//设置允许信息窗发送短息
            message:""
          }
          var entype="";
          var data = JSON.parse(window.sessionStorage.getItem("{$ENTYPE}"));
          for(var i=0;i<data.values.length;i++){
            var _item = data.values[i];
            if(_item.code==item.entype){
              entype=_item.name;
            }
          }
          var cont = "车辆："+item.carid+"<br/>开始时间："+item.bgtime+"<br/>结束时间："+item.edtime+"<br/>监控类型："+entype;
          var infoWindow = new BMap.InfoWindow(cont, opts);  // 创建信息窗口对象 
          polygon.addEventListener("mouseover", function(){       
            this.map.openInfoWindow(infoWindow,point[0]); //开启信息窗口
          });
          polygon.addEventListener("mouseout", function(){   
            this.map.closeInfoWindow()
          });
          
        },
        //删除覆盖物
        delFence(index,id){
          let _this=this;
          this.loading=1;
            let params ={
                snkey: this.snkey,
                method:'301',
                parameter:encodeURI('{"id":"'+id+'"}')
            };
            axios.post(`${global.BIPAPIURL}vehicle`,qs.stringify(params)) .then(res=>{ 
                if(res.data.code==0){
                    this.$notify.success({content:'删除成功！'})
                    _this.getFence();
                }
                this.loading=0;
            }) .catch(err=>{
                console.log(err)
                this.$notify.danger({content:'系统故障！'})
                this.loading=0;
            })
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

svg{ 
  max-width: '';
  vertical-align: middle; 
}
.adList{
    padding: 0;  
    background-color: #DAD7D6;
    li{ 
      margin-left: .2rem;
      list-style-type: none;
      overflow:hidden;  
      height: .4rem;  
      line-height: .4rem;
    } 
    .md-layout{
      background-color:#FBFBFB;
      padding: 0px;
      margin-bottom: 2px;
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
.fencetopcard{
  margin-left: .15rem;  
  height: 51%;
}
.fencebottomcard{
  margin-left: .15rem; 
  margin-top: 0px;
  height: 42%;
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
.btn{
    margin-left: 0px; 
    width: 96%;
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
</style>