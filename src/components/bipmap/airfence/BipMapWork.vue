<template> 
    <md-layout style="padding-left: 8px;" md-flex-small="100" md-flex="100">
      <md-layout md-flex-small="100" :md-flex="leftcar"  > 
        <md-card v-if="leftshow">   
            <div style="width:100%;">
                <md-layout md-gutter style="margin-left:.1rem;margin-right:.1rem;">
                    <md-layout  md-flex="100"><md-bip-input-ref  :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-ref></md-layout>
                </md-layout>
                <md-layout md-gutter style="margin-left:.1rem;margin-right:.1rem;">
                    <md-input-container>
                <label for="plane">架区名称</label> 
                <md-input :required="false" v-model="jqname"></md-input>
                </md-input-container> 
                </md-layout>
                <md-layout md-gutter style="margin-left:.1rem;margin-right:.1rem;">
                    <md-input-container>
                <label for="plane">所属乡镇</label> 
                <md-input :required="false" v-model="township"></md-input>
                </md-input-container> 
                </md-layout>
                <md-layout md-gutter style="margin-left:.1rem;margin-right:.1rem;"> 
                    <md-layout md-flex="25"><md-radio v-model="season" id="CJ" name="CJ" md-value="CJ" class="md-primary">春季</md-radio></md-layout>
                    <md-layout md-flex="25"><md-radio v-model="season" id="XJ" name="XJ" md-value="XJ" class="md-primary">夏季</md-radio></md-layout>
                    <md-layout md-flex="25"><md-radio v-model="season" id="QJ" name="QJ" md-value="QJ" class="md-primary">秋季</md-radio></md-layout>
                    <md-layout md-flex="25"><md-radio v-model="season" id="QB" name="QB" md-value="QB" class="md-primary">全部</md-radio></md-layout>
                </md-layout>
                <md-layout md-gutter style="margin-left:.1rem;margin-right:.1rem;">
                    <md-layout  md-flex="50">
                        <md-button class="md-primary" style="background-color:#2196f3;color:#FFFFFF" @click="selZYQ()">查询</md-button>
                    </md-layout>
                    <md-layout  md-flex="50">
                        <md-button class="md-primary" style="background-color:#2196f3;color:#FFFFFF" @click="drawAllZYQ()" >绘制</md-button> 
                    </md-layout>
                </md-layout> 
                

            </div>
            <div style="overflow:auto; width:100%;" >  
                <md-list class=" md-double-line">
                    <md-subheader>作业区</md-subheader>
                    <md-list-item v-for="(item, index) in operarea" :key="index" > 
                        <md-checkbox :id='item.id' :name="item.id" v-model="checkbox" :md-value="index+'|'+item.id+'|'+item.scm+'|'+item.boundary+'|'+item.boundary1" class="md-primary"></md-checkbox>
                        <div class="md-list-text-container">
                            <span>{{item.name}}-{{item.township}}</span> 
                            <p>{{item.address}}</p>
                        </div>
                        <md-divider></md-divider>
                    </md-list-item> 
                </md-list>  
            </div> 
        </md-card>
      </md-layout> 
      <md-layout md-flex-small="100" :md-flex="rightcar" > 
        <md-card class="mapcard">  
          <div class="mybtnpc">
            <md-layout md-row>
                <md-layout> 
                    <md-button class="md-primary md-raised md-icon-button" @click="jtclick">
                        <md-icon>{{jtIcon}}</md-icon>
                        <md-tooltip md-direction="right">{{jtText}}</md-tooltip>
                    </md-button>   
                </md-layout>
                <md-layout> 
                    <md-button class="md-primary md-raised md-icon-button" @click="clear">
                        <md-icon>delete</md-icon>
                        <md-tooltip md-direction="right">清除作业区数据</md-tooltip>
                    </md-button>   
                </md-layout>
                <md-layout> 
                    <md-button class="md-primary md-raised md-icon-button" @click="insert">
                        <md-icon>add</md-icon>
                        <md-tooltip md-direction="right">新增作业区</md-tooltip>
                    </md-button>   
                </md-layout>
                <md-layout> 
                    <md-button class="md-primary md-raised md-icon-button" @click="open_lock">
                        <md-icon>{{lock}}</md-icon>
                        <md-tooltip md-direction="right">开启/关闭绘制</md-tooltip>
                    </md-button>   
                </md-layout>
                <md-layout> 
                    <md-button class="md-primary md-raised md-icon-button" @click="updateZYQ">
                        <md-icon>save</md-icon>
                        <md-tooltip md-direction="right">保存修改的作业区</md-tooltip>
                    </md-button>   
                </md-layout>
                <md-layout>
                    <div style="    line-height: .42rem;margin-left:.4rem" id="cityList"></div> 
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
        this.baiduMap();     
        //清覆盖物，初始化数据
        this.clear();
        this.setHeight()
        window.onresize = () => {  
            this.setHeight();
        }  
        //查询全部作业区
        this.getALLOPERAREA();
        //开启绘制作业区
        this.bdDrawingManager()  
        //开启行政区选择
        this.CityList(); 
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
            map: {}, 
            loading:0,  
            snkey:"", 
            operarea:[],//作业区信息
            checkbox:[],//选中的作业区
            mpzyq:{},//作业区覆盖物 
            boundary1:"",//鼠标绘制点 边界坐标
            boundary:"",//边界坐标 度分秒格式
            modal:{
                orgcode:JSON.parse(window.sessionStorage.getItem('user')).deptInfo.cmcCode,
            },
            cell:{
                editName:"SORG",
                editType:0,
                id:"orgcode",
                index:0,
                isReq:false,
                labelString:"隶属部门",
                refValue:"{&SORG}",
            },
            season:'QB',//季节
            selsorg:'',//查询部门
            jqname:'',//架区名称
            township:'',//所属乡镇
            area:0,//作业区面积
            earthRadiusMeters : 6371000.0,
            metersPerDegree : 2.0 * Math.PI * 6371000.0 / 360.0,
            radiansPerDegree : Math.PI / 180.0,
            degreesPerRadian : 180.0 / Math.PI,
            drawingManager:null,//绘制
            jtText:"隐藏左侧区域",
            jtIcon:'fast_rewind',
            rightcar:75,//右侧地图宽度
            leftcar:25,//左侧宽度
            leftshow:true,//左侧是否显示
            lock:'lock',
            polygons:[],//全部作业区覆盖物
            province:'',//省
            city:'',//市
            Area:'',//区
            district:[],//选择行政区覆盖物
        }
    },
    methods: { 
        dataChange(data){
            this.selsorg=data.value[data.cellId]  
        },
        clear() {
            //清除地图上的覆盖物
            this.map.removeOverlay();
            this.checkbox=[];
            this.mpzyq={};
            this.boundary1=null;
            this.boundary=null;
            this.area = null;
            if(this.drawingManager){
                this.drawingManager.close(); 
            } 
        },
        //新增作业区  
        insert(){
            if(this.boundary1==null||this.boundary==null || this.boundary1=='' ||this.boundary==''){
                this.$notify.warning({content:'请绘制作业区！'})
                return;
            }
            let _this = this;
            this.$mapDialog.openWorkArea({ diaTitle: '作业区参数录入',boundary:this.boundary,boundary1:this.boundary1,area:this.area, getOpt(state) { _this.savezyq(state) } })
        },
        savezyq(state){
            if(state==1){
                this.clear();
            }
        },
        setHeight() {
            this.clientHeight = document.body.clientHeight
            document.getElementById('container').style.height = (this.clientHeight - 90) + 'px'
        },
        //绘制全部作业区
        async drawAllZYQ(){
            await this.selZYQ();
            var array=[];
            if(this.operarea!=null)
            for(var i=0;i<this.operarea.length;i++){
                var item =this.operarea[i];
                var val=i+'|'+item.id+'|'+item.scm+'|'+item.boundary+'|'+item.boundary1;
                array.push(val);
            }
            this.checkbox=array;
        },
        //查询    已有的作业区
        async selZYQ(){
            var where ="";
            if(this.season !='QB'){
                where = "id like '%"+this.season+"%' and sorg like '"+this.selsorg+"%'  and name like '%"+this.jqname+"%' and township like '%"+this.township+"%'"
            }else{
                where = "sorg like '"+this.selsorg+"%' and name like '%"+this.jqname+"%' and township like '%"+this.township+"%'"
            } 
            await this.getALLOPERAREA("~"+where);
        },
        //查询已有的作业区
        async getALLOPERAREA(cont){
            let _this = this;
            let params = this.param; 
            params.assistid="ALLOPERAREA";
            params.pageSize=100000;
            params.cont=cont;
            await axios.post(`${global.BIPAPIURL}`+`${global.API_COM }`,qs.stringify(params)) .then(res=>{
                _this.operarea = res.data.values;
                if(res.data.total ==0){
                    this.$notify.warning({content:'该部门暂无作业区!'})
                }
            }) .catch(err=>{
                console.log(err)
            })
        },
        //画作业区
        openBoundary(){ 
            this.polygons=[];
            if(this.checkbox.length==0){
                this.lock = 'lock'
            }
            this.map.clearOverlays(); 
            var ponit =[];
            for(var i=0;i<this.checkbox.length;i++){
                let item = this.checkbox[i];
                if(item == null)
                    continue;
                let val = item.split("|");
                let boundary = val[4];
                let listQY=[];
                
                if(boundary == null||boundary==''){
                    boundary = val[3];
                    var oneE = boundary.indexOf("E");
                    var oneN = boundary.indexOf("N");
                    if(oneE>=oneN){
                        this.$notify.warning({content:'坐标数据错误！'})
                        this.checkbox[i]=null;
                        continue;
                    }
                    while(boundary.indexOf("E") !=-1){
                        // 经度 
                        var oneE = boundary.indexOf("E");
                        var oneEF = boundary.indexOf("″"); 
                        var nexN = boundary.indexOf("N");
                        if(oneEF>nexN){
                            this.$notify.warning({content:'坐标数据错误！'})
                            this.checkbox[i]=null;
                            boundary='';
                            continue;
                        }
                        var lngStr = boundary.substring(oneE,oneEF+1);
                        var lng = this.convertLngLat(lngStr); 
                        boundary = boundary.substring(oneEF+1,boundary.length);
                        // 纬度
                        var oneN = boundary.indexOf("N");
                        var oneNF = boundary.indexOf("″"); 
                        var nexE = boundary.indexOf("E");
                        if(nexE != -1)
                        if(oneNF>nexE){
                            this.$notify.warning({content:'坐标数据错误！'})
                            this.checkbox[i]=null;
                            boundary='';
                            continue;
                        }
                        if(oneNF == -1){
                            this.$notify.warning({content:'坐标数据错误！'})
                            this.checkbox[i]=null;
                            boundary='';
                            continue;
                        }
                        var latStr = boundary.substring(oneN,oneNF+1); 
                        var lat = this.convertLngLat(latStr);
                        boundary = boundary.substring(oneNF+1,boundary.length);
                        var e = [lng,lat];
                        listQY.push(e);
                    } 
                    if(listQY.length<=2){
                        this.$notify.warning({content:'坐标数据错误！'})
                        this.checkbox[i]=null;
                        continue;
                    }
                }else{
                    var arr = boundary.split(";");
                    for(var j=0;j<arr.length;j++){
                        var jwd = arr[j].split(",");
                        var lng = jwd[0];
                        var lat = jwd[1];
                        var e = [lng,lat];
                        listQY.push(e);
                    }
                }
                ponit = this.checkenmap(val[0],listQY,ponit,val[1]+'|'+val[2]);
            }
        },
        checkenmap(index,data,ponit1,id){
            var key = "";
            var item  =  this.operarea[index];  
            var point=[];
            var lat = 0, lon = 0;  
            var total = data.length;
            for(var i=0;i<data.length;i++){
                var _a = data[i];
                key+=_a[0]+''+_a[1]
                point.push(new BMap.Point(_a[0],_a[1]));
                ponit1.push(new BMap.Point(_a[0],_a[1]));
                lat += _a[0] * Math.PI / 180;  
                lon += _a[1] * Math.PI / 180;  
            } 
            lat /= total;
            lon /= total;
            //计算中心点 
            lat = lat * 180 / Math.PI
            lon = lon * 180 / Math.PI;   
          
            var point1 = new BMap.Point(lat,lon);
            var opts1 = {
            position : point1,    // 指定文本标注所在的地理位置
            offset   : new BMap.Size(0, -30)    //设置文本偏移量
            }
            var label = new BMap.Label(item.township+"<br/>"+item.address, opts1); 
            label.setStyle({
                color : "red",
                fontSize : "12px",
                height : "20px",
                lineHeight : "20px",
                fontFamily:"微软雅黑"
            });
            this.map.addOverlay(label); 

            var polygon = new BMap.Polygon(point, {strokeColor:"red", strokeWeight:3, strokeOpacity:0.5});  //创建多边形 
            this.map.addOverlay(polygon);           //增加多边形    
            this.map.setViewport(ponit1);//根据提供的地理区域或坐标设置地图视野，调整后的视野会保证包含提供的地理区域或坐标
            var opts = {
                width : 180,     // 信息窗口宽度
                height: 80,     // 信息窗口高度
                title : item.name , // 信息窗口标题
                enableMessage:true,//设置允许信息窗发送短息
                message:""
            } 
            var cont = item.township+"<br/>"+item.address;
            console.log(item.area)
            if(item.area !=0){
                cont += "<br/>面积："+item.area+"亩";
            }
            
            var infoWindow = new BMap.InfoWindow(cont, opts);  // 创建信息窗口对象 
            polygon.addEventListener("click", function(){       
                this.map.openInfoWindow(infoWindow,point1); //开启信息窗口
            });
            if(this.lock =='lock_open'){
                polygon.enableEditing();
            }
            var p = {id:id,polygon:polygon,key:key};
            this.polygons.push(p);
            return ponit1;
        },
        //开启覆盖物绘制
        open_lock(){
            if(this.polygons.length==0){
                this.$notify.warning({content:'请勾选作业区！'})
                return;
            }
            if(this.lock == 'lock'){//开启绘制
                this.lock = 'lock_open';
                for(var i=0;i<this.polygons.length;i++){
                    var p = this.polygons[i];
                    p.polygon.enableEditing();
                }
            }else{
                this.lock = 'lock'
                for(var i=0;i<this.polygons.length;i++){
                    var p = this.polygons[i];
                    p.polygon.disableEditing();
                }
            }
        },
        //修改作业区
        updateZYQ(){
            this.loading=1;
            for(var i=0;i<this.polygons.length;i++){
                var p = this.polygons[i];
                var polygon = p.polygon;
                var point = polygon.getPath();
                var key1 = "";
                for(var j =0;j<point.length;j++){
                    key1+= point[j].lng+''+point[j].lat
                }
                var change = key1 == p.key;
                if(!change){
                    var kid = p.id.split('|'); 
                    var pointArr=[];
                    var boundary1="";
                    var boundary = "";
                    var path = point;
                    for(var z=0;z<path.length;z++){ 
                        if(z==path.length-1){
                            boundary1+=path[z].lng+","+path[z].lat;
                        }else{
                            boundary1+=path[z].lng+","+path[z].lat+";";
                        }
                        var E = 'E'+this.ChangeToDFM(path[z].lng);
                        var N = 'N'+this.ChangeToDFM(path[z].lat);
                        boundary +=(E+N) 
                        var point = new Array();
                        point.push(Number(path[z].lng), Number(path[z].lat));
                        pointArr.push(point);
                    }  
                    var area = this.calculateArea(pointArr);

                    var jsonstr={};
                    jsonstr["id"]=kid[0];//架区编号
                    jsonstr["area"] = (area/666.66).toFixed(2);//作业区面积
                    jsonstr["boundary1"]=boundary1;//边界坐标
                    jsonstr["boundary"]=boundary;//边界坐标
                    jsonstr["state"]='6';//状态* 
                    jsonstr["scm"]=kid[1];//隶属公司
                    jsonstr["sys_stated"]=2;//单据状态 

                    var data1 = {
                        "dbid": `${global.DBID}`,
                        "usercode": JSON.parse(window.sessionStorage.getItem('user')).userCode,
                        "apiId": "savedata", //cellparam pbuid=21243&pmenuid=22403
                        "pcell": '3513UP',
                        "jsonstr":JSON.stringify(jsonstr),
                        "datatype":1
                    };
                    
                    let _this =this; 
                    axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
                        console.log(res.data)
                        if(res.data.id==0){
                            _this.$notify.success({content:'保存成功'}) 
                        }else{
                            _this.$notify.danger({content:'保存失败'})
                        }
                    }) .catch(err=>{
                        console.log(err)
                        _this.$notify.danger({content:'系统故障！'})
                        _this.loading=0;
                    })  
                }
            }
            this.loading=0;
        }, 
        //经纬度 度分秒 转换
        convertLngLat(jwd) {
            var lnglat = 0.0;
            jwd = jwd.replace("E", "").replace("N", "");

            var du = jwd.substring(0, jwd.indexOf("°"));// 116度 
            var fen = jwd.substring(jwd.indexOf("°") + 1, jwd.indexOf("′"));// 23分
            var seconds = jwd.substring(jwd.indexOf("′") + 1,jwd.indexOf("″"));// s

            var d = parseFloat(du);
            var f = parseFloat(fen);
            var s = parseFloat(seconds);
            lnglat = d + f / 60 + s / 60 / 60;

            return lnglat;
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
                    offset: new BMap.Size(3 , 35), //偏离值
                    drawingModes:[
                        // BMAP_DRAWING_MARKER,// 画点 
                        // BMAP_DRAWING_CIRCLE,// 画圆 
                        BMAP_DRAWING_POLYLINE,//  画线
                        BMAP_DRAWING_POLYGON ,//  画多边形 
                        BMAP_DRAWING_RECTANGLE,// 画矩形
                    ]
                },
                // circleOptions: styleOptions, //圆的样式
                polylineOptions: styleOptions, //线的样式
                polygonOptions: styleOptions, //多边形的样式
                rectangleOptions: styleOptions //矩形的样式
            });
            //打开距离或面积计算
            // this.drawingManager.enableCalculate();
            //添加鼠标绘制工具监听事件，用于获取绘制结果
            this.drawingManager.addEventListener('overlaycomplete', this.overlaycomplete);  
        },
        //输出绘制点信息
        overlaycomplete(e){ 
            this.boundary1="";
            this.boundary="";
            var path = e.overlay.getPath();//Array<Point> 返回多边型的点数组
            if(path.length<=2){
                this.$notify.warning({content:'请绘制正确的围栏(两点以上)！'})
                this.clear();
                return ;
            }  
            var pointArr=[];
            for(var i=0;i<path.length;i++){ 
                if(i==path.length-1){
                this.boundary1+=path[i].lng+","+path[i].lat;
                }else{
                this.boundary1+=path[i].lng+","+path[i].lat+";";
                }
                var E = 'E'+this.ChangeToDFM(path[i].lng);
                var N = 'N'+this.ChangeToDFM(path[i].lat);
                this.boundary +=(E+N)


                var point = new Array();
                point.push(Number(path[i].lng), Number(path[i].lat));
                pointArr.push(point);
            }  
            var area = this.calculateArea(pointArr);
            // console.log(aa)
            // console.log(e.calculate)
            this.area = (area/666.66).toFixed(2);
        }, 
        ChangeToDFM(val){ 
            var du = val+'';
            var str1 = du.split(".");
            var du1 = str1[0];
            var tp = "0."+str1[1]
            var tp = String(tp*60);		//这里进行了强制类型转换
            var str2 = tp.split(".");
            var fen =str2[0];
            tp = "0."+str2[1];
            tp = tp*60;
            var miao = tp;
            return du1+"°"+fen+"'"+miao+"\″";
        }, 
        CityList(){
            var cityList = new BMapLib.CityList({map: this.map,container: 'cityList'});
            cityList.addEventListener("cityclick",this.dispatchCityClick);
        },
        dispatchCityClick(option){ 
            // console.log(option.area_name)//点击的区域名称
            // console.log(option.area_code)//点击的区域代码
            // console.log(option.geo)//点击区域合适显示的中心点位置
            // console.log(option.area_type)//该区域的类型(全国0、省1、城市2) 
            if(option.area_name == '请选择'){
                for(var i =0;i<this.district.length;i++){
                    this.district[i].enableMassClear();
                    this.map.removeOverlay(this.district[i]);        //清除地图覆盖物  
                }
                this.district=[];    
                this.city='';
                this.Area=''; 
                this.province='';
                return;
            }
            if(option.area_type == 1){
                this.city='';
                this.Area='';
                this.province = option.area_name 
            }else if(option.area_type == 2){
                this.Area='';
                this.province='';
                this.city = option.area_name 
            }else if(option.area_type == 3){
                this.Area = option.area_name
            }  
            var bdary = new BMap.Boundary();
            let _this = this;
            bdary.get(this.province+this.city+this.Area, function(rs){       //获取行政区域
                if(_this.district.length>0){
                    for(var i =0;i<_this.district.length;i++){
                        _this.district[i].enableMassClear();
                        _this.map.removeOverlay(_this.district[i]);        //清除地图覆盖物  
                    } 
                    _this.district=[];    
                }
                var count = rs.boundaries.length; //行政区域的点有多少个
                if (count === 0) {
                    alert('未能获取当前输入行政区域');
                    return ;
                }
                var pointArray = [];
                for (var i = 0; i < count; i++) {
                    _this.district.push( new BMap.Polygon(rs.boundaries[i], {fillOpacity:0.01,strokeWeight: 2, strokeColor: "#ff0000"})); //建立多边形覆盖物
                    _this.district[i].disableMassClear();
                    _this.map.addOverlay( _this.district[i]);  //添加覆盖物 
                    pointArray = pointArray.concat( _this.district[i].getPath());
                }    
                _this.map.setViewport(pointArray);    //调整视野                 
            });
        },
        calculateArea(points) {
            var areaMeters2 = 0;
            if (points.length > 2) { 
                areaMeters2 = this.PlanarPolygonAreaMeters2(points); 
                if (areaMeters2 > 1000000.0) {
                    areaMeters2 = this.SphericalPolygonAreaMeters2(points); 
                } 
            }
            return areaMeters2;
        } ,
        /*平面多边形面积*/
        PlanarPolygonAreaMeters2(points) {
    
            var a = 0;
            for (var i = 0; i < points.length; ++i) {
                var j = (i + 1) % points.length;
                var xi = points[i][0] * this.metersPerDegree * Math.cos(points[i][1] * this.radiansPerDegree);
                var yi = points[i][1] * this.metersPerDegree;
                var xj = points[j][0] * this.metersPerDegree * Math.cos(points[j][1] * this.radiansPerDegree);
                var yj = points[j][1] * this.metersPerDegree;
                a += xi * yj - xj * yi;
            }
            return Math.abs(a / 2);
        } ,
        /*球面多边形面积计算*/
        SphericalPolygonAreaMeters2(points) {
            var totalAngle = 0;
            for (var i = 0; i < points.length; i++) {
                var j = (i + 1) % points.length;
                var k = (i + 2) % points.length;
                totalAngle += this.Angle(points[i], points[j], points[k]);
            }
            var planarTotalAngle = (points.length - 2) * 180.0;
            var sphericalExcess = totalAngle - planarTotalAngle;
            if (sphericalExcess > 420.0) {
                totalAngle = points.length * 360.0 - totalAngle;
                sphericalExcess = totalAngle - planarTotalAngle;
            } else if (sphericalExcess > 300.0 && sphericalExcess < 420.0) {
                sphericalExcess = Math.abs(360.0 - sphericalExcess);
            }
            return sphericalExcess * this.radiansPerDegree * this.earthRadiusMeters * this.earthRadiusMeters;
        },
        /*角度*/
        Angle(p1, p2, p3) {
            var bearing21 = this.Bearing(p2, p1);
            var bearing23 = this.Bearing(p2, p3);
            var angle = bearing21 - bearing23;
            if (angle < 0) {
                angle += 360;
            }
            return angle;
        },

        /*方向*/
        Bearing(from, to) {
            var lat1 = from[1] * this.radiansPerDegree;
            var lon1 = from[0] * this.radiansPerDegree;
            var lat2 = to[1] * this.radiansPerDegree;
            var lon2 = to[0] * this.radiansPerDegree;
            var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
            if (angle < 0) {
                angle += Math.PI * 2.0;
            }
            angle = angle * this.degreesPerRadian;
            return angle;
        },

        jtclick(){
            if(this.jtIcon =='fast_rewind'){
                this.jtText="显示左侧区域",
                this.jtIcon="fast_forward"; 
                this.leftcar=0
                this.rightcar=100;//右侧地图宽度
                this.leftshow=false;
            }else{
                this.jtText="隐藏左侧区域",
                this.jtIcon="fast_rewind"; 
                this.leftcar=25
                this.rightcar=75;//右侧地图宽度
                this.leftshow=true;
            }
        }
    },
    watch: {
        clientHeight:function() {
            this.setHeight()
        },
        checkbox:function(){
            this.openBoundary();
        }, 

    }
}
</script>

<style lang="scss" scoped> 
svg{ 
  max-width: '';
  vertical-align: middle; 
}
.zyqList{
    padding: 0;  
    background-color: #DAD7D6; 
    .md-layout{ 
      height: .3rem;   
      background-color:#FBFBFB;
      padding: 0px; 
    }
}  
.md-layout{
    margin: 0;
}
.md-card {
    margin: 0.15rem;
    margin-left:0;
}
.mapcard{
  margin-right: .1rem; 
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
 
.md-theme-default.md-button:not([disabled]).md-primary.md-raised,
.md-theme-default.md-button:not([disabled]).md-primary.md-fab {
    background-color: #FBFBFB;
    color: #3D6DCC;
    border: 1px solid #929191;
}   
.mybtnpc {
    position: absolute;
    top: .1rem;
    left: .52rem;
    z-index: 1;
} 
</style>