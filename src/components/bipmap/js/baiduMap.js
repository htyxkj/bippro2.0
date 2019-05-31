export default {
    mounted() {
        //清覆盖物，初始化数据
    },
    data() {
        return {
            _map:null,
            _path:null,
            i:0,
            _setTimeoutQuene:[],
            _projection:null,
            _markerEnd:null,
            _marker:null,
            AirStripsSprayingSpan : 45,//幅宽
            AirStripsSprayingSpanLines :[],
            mapLastLevel : 0,

            drawingManager:null,//百度地图鼠标绘制工具
        }
    },
    methods:{
        //创建地图
        baiduMap() {
            this.map = new BMap.Map("container")
            //104.524489 38.810945
            // this.map.centerAndZoom(new BMap.Point(116.98591030212918,34.57042861596912),18)
            // this.map.centerAndZoom(new BMap.Point(100.922859, 40.881121), 4);  // 初始化地图,设置中心点坐标和地图级别
            // this.map.centerAndZoom(new BMap.Point(98.388611,30.563611), 5);  // 初始化地图,设置中心点坐标和地图级别
            this.map.centerAndZoom(new BMap.Point(103.388611,38.563611), 5); 
            this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
            //添加工具条、比例尺控件
            this.map.addControl(new BMap.ScaleControl());
            this.map.addControl(new BMap.NavigationControl());
            //定位
            this.map.addControl(this.geolocationControl)
            // 添加地图类型控件
            this.map.addControl(new BMap.MapTypeControl())
            /* this.map.addEventListener('click',e=>{
                console.log(e.point.lng,e.point.lat)
            }) */
            this._map=this.map;
        },
        LuShu(map, path,color,isViewport) {
            if (!path || path.length < 1) {
                return;
            }
            this._map = map;
            //存储一条路线
            this._path = path;
            //移动到当前点的索引
            this.i = 0;
            //控制暂停后开始移动的队列的数组
            this._setTimeoutQuene = [];
            //进行坐标转换的类
            this._projection = this._map.getMapType().getProjection();
            this._initMarker(color,isViewport);

            this._isFirst = true;   //是否第一次运行
            this._fromPause = false;
            this._rotation = 0;//小车转动的角度
            this._pauseTimeStamp = null;  //暂停时， 记录当前的时间戳
            this._initTimeStamp = null;   //记录movenext时的时间戳, _pauseTimeStamp - _initTimeStamp = 该点已经等待的时间，move时将当前点的time+等待时间
        },
        _initMarker(color,isViewport) {
            var me = this;  
            //初始化线路,从path中取出point数组赋值给arrPois
            var arrPois = new Array();
            var arrPoisParts = new Array();
            var arrPoisPart = new Array();
            var polyPart = null;
 
            for (var i in this._path) { 
                arrPois.push(this._path[i].pt); 
               arrPoisPart.push(this._path[i].pt);
            } 
            if(isViewport){
                // var poly = new BMap.Polyline(arrPois, {strokeColor: color,strokeWeight:2}) 
                // poly.setStrokeOpacity(0);
                // this._map.addOverlay(poly);
                this._map.setViewport(arrPois);
            }else{
                var poly = new BMap.Polyline(arrPois, {strokeColor: color,strokeWeight:2}) 
                this._map.addOverlay(poly); 
            }

        },
        //绘制有效喷福 参数定义：有效喷福 Point[]
        DrawAirStripsSprayingSpan(fk,arrInfos){
            var vSprayingSpan = fk;
            //(1)绘制缓冲 由测量工具测量 50 米 134像素
            /*var Pixel3 = new BMap.Pixel(116,39);
            var p3 = map.pixelToPoint(Pixel3);
                
            var Pixel4 = new BMap.Pixel(116,40);
            var p4 = map.pixelToPoint(Pixel4);

            var dis = Math.abs(p3.lat - p4.lat);//按照一度代表111千米计算
            var rangeWeight = (vSprayingSpan)/(dis*111000);//2*
            rangeWeight = rangeWeight + 2;//左右各1像素的取上,中间2像素的线宽 #E0CF9B*/

            var zm =this._map.getZoom();
            var vZS = Math.pow(2,19-zm);
            var rangeWeight = (vSprayingSpan/50 * 134)/vZS;

            var arrPois = new Array();
            for (var iLine = 0; iLine < arrInfos.length; iLine++) 
            {
                var vPoints = arrInfos[iLine];
                arrPois.push(vPoints.pt);
            }
            if (arrPois.length >=2){
                this.AirStripsSprayingSpan = vSprayingSpan;
                var polyline_range = new BMap.Polyline(arrPois, {strokeColor: '#339933',strokeWeight:rangeWeight, strokeOpacity:0.3,enableClicking:false})//, strokeOpacity:0.5
                this._map.addOverlay(polyline_range);
                // var _polyline_range = new BMap.Polyline(arrPois, {strokeColor: 'yellow',strokeWeight:3, strokeOpacity:0.5,enableClicking:false})//, strokeOpacity:0.5
                // this._map.addOverlay(_polyline_range);
                
                // polyline_range.addEventListener("mouseover", function () {
                    // if (AirlineBeginPoint!=null)
                    //     AirlineBeginPoint.show();
                    // if (AirlineEndPoint!=null)
                    //     AirlineEndPoint.show();
                // });
                // polyline_range.addEventListener("mouseout", function () {
                    // if (AirlineBeginPoint!=null)
                    //     AirlineBeginPoint.hide();
                    // if (AirlineEndPoint!=null)
                    //     AirlineEndPoint.hide();
                // });
                //存储多线
                this.AirStripsSprayingSpanLines.push(polyline_range);
            }
        },
        //地图比例发生变化
        getCenterAndZoom() {
            var pt = this._map.getCenter()
            var zm = this._map.getZoom();
            // if (this.mapLastLevel != zm) {
             //航迹的线像素大小变化
                /*var Pixel3 = new BMap.Pixel(116,39);
                var p3 = map.pixelToPoint(Pixel3);
                
                var Pixel4 = new BMap.Pixel(116,40);
                var p4 = map.pixelToPoint(Pixel4);
        
                var dis = Math.abs(p3.lat - p4.lat);//按照一度代表111千米计算
                var rangeWeight = (AirStripsSprayingSpan)/(dis*111000);//2*
                rangeWeight = rangeWeight + 2;*/
        
                var vZS = Math.pow(2,19-zm);
                var rangeWeight = (this.AirStripsSprayingSpan/50*134)/vZS;
                if ( this.AirStripsSprayingSpanLines!= null) {
                    console.log("地图比例发生变化,重新设置幅宽为："+rangeWeight)
                    for (var index in this.AirStripsSprayingSpanLines){
                        if (this.AirStripsSprayingSpanLines[index] && rangeWeight >= 0){
                            this.AirStripsSprayingSpanLines[index].setStrokeWeight(rangeWeight);
                        };
                    };
                };
            // };
            // this.mapLastLevel = zm; 
        },
        /**
         *在每个点的真实步骤中设置小车转动的角度
         */
        setRotation(curPos, targetPos) {
            var me = this;
            var deg = 0;
            //start!
            curPos = this.map.pointToPixel(curPos);//起点经纬度
            targetPos = this.map.pointToPixel(targetPos);//终点经纬度
            if(curPos == null)
                return 360;
            if(targetPos == null)
                return 360;
            if (targetPos.x != curPos.x) {
                var tan = (targetPos.y - curPos.y) / (targetPos.x - curPos.x),
                        atan = Math.atan(tan);
                deg = atan * 360 / (2 * Math.PI);
                //degree  correction;
                if (targetPos.x < curPos.x) {
                    deg = -deg + 90 + 90;

                } else {
                    deg = -deg;
                }
                return (-deg);
            } else {
                var disy = targetPos.y - curPos.y;
                var bias = 0;
                if (disy > 0)
                    bias = -1
                else
                    bias = 1
                return (-bias * 90);
            }
            return;
        },
        //回放是绘制喷福
        //绘制有效喷福 参数定义：有效喷福 Point[] 
        HFDrawAirStripsSprayingSpan(fk,arrInfos,isSave){
            var vSprayingSpan = fk;
            //(1)绘制缓冲 由测量工具测量 50 米 134像素
            /*var Pixel3 = new BMap.Pixel(116,39);
            var p3 = map.pixelToPoint(Pixel3);
                
            var Pixel4 = new BMap.Pixel(116,40);
            var p4 = map.pixelToPoint(Pixel4);

            var dis = Math.abs(p3.lat - p4.lat);//按照一度代表111千米计算
            var rangeWeight = (vSprayingSpan)/(dis*111000);//2*
            rangeWeight = rangeWeight + 2;//左右各1像素的取上,中间2像素的线宽 #E0CF9B*/

            var zm =this._map.getZoom();
            var vZS = Math.pow(2,19-zm);
            var rangeWeight = (vSprayingSpan/50 * 134)/vZS; 
            if (arrInfos !=null ){
                this.AirStripsSprayingSpan = vSprayingSpan;     
                arrInfos.setStrokeWeight(rangeWeight);
                this._map.addOverlay(arrInfos); 
                //存储多线
                if(isSave){
                    console.log("将线存放到集合中")
                    this.AirStripsSprayingSpanLines.push(arrInfos);
                }else{
                    if(this.AirStripsSprayingSpanLines.length==0){
                        this.AirStripsSprayingSpanLines.push(arrInfos);
                    }else{ 
                        this.AirStripsSprayingSpanLines[this.AirStripsSprayingSpanLines.length-1] = arrInfos;
                    }
                }
            }
        },

        //实例化鼠标绘制工具
        bdDrawingManager(Options){ 
            var styleOptions = {
                strokeColor:"red",    //边线颜色。
                fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 3,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
            }
            if(Options){
                styleOptions = Options;
            }
            this.drawingManager = new BMapLib.DrawingManager(this.map, {
                isOpen: true, //是否开启绘制模式
                enableDrawingTool: true, //是否显示工具栏
                drawingMode:BMAP_DRAWING_POLYGON,//绘制模式  多边形
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_BOTTOM_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                    drawingModes:[
                        // BMAP_DRAWING_MARKER,// 画点 
                        // BMAP_DRAWING_CIRCLE,//  画圆 
                        BMAP_DRAWING_POLYLINE,//  画线 
                        BMAP_DRAWING_POLYGON ,// 画多边形 
                        // BMAP_DRAWING_RECTANGLE,//  画矩形
                    ]
                },
                circleOptions: styleOptions, //圆的样式
                polylineOptions: styleOptions, //线的样式
                polygonOptions: styleOptions, //多边形的样式
                rectangleOptions: styleOptions //矩形的样式
            }); 
        },

    }
}