import common from './common.js'
const EARTH_ARC = common.EARTH_ARC
const _DISTANCE = common.DISTANCE
const POLYGON_COLOR = common.POLYGON_COLOR
const POLYGON_WEIGHT = common.POLYGON_WEIGHT
const POLYGON_OPACITY = common.POLYGON_OPACITY
const POLYGON_FILLCOLOR = common.POLYGON_FILLCOLOR
const POLYGON_FILLOPACITY = common.POLYGON_FILLOPACITY
const LINE_COLOR = common.LINE_COLOR
const LINE_WEIGHT = common.LINE_WEIGHT
const LINE_OPACITY = common.LINE_OPACITY
const TRI_COLOR = common.TRI_COLOR
const TRI_WEIGHT = common.TRI_WEIGHT
const TRI_OPACITY = common.TRI_OPACITY
const TRI_FILLCOLOR = common.TRI_FILLCOLOR
const TRI_FILLOPACITY = common.TRI_FILLOPACITY
const HM_FILLOPACITY = common.HM_FILLOPACITY
export default {
    mounted() {
        //清覆盖物，初始化数据
    },
    data() {
        return {
            DISTANCE : _DISTANCE,
        }
    },
    methods:{
        setDISTANCE(val){
            this.DISTANCE=val/2;
        },
        baiduMap() {
            this.map = new BMap.Map("container")
            //104.524489 38.810945
            // this.map.centerAndZoom(new BMap.Point(116.98591030212918,34.57042861596912),18)
            // this.map.centerAndZoom(new BMap.Point(100.922859, 40.881121), 4);  // 初始化地图,设置中心点坐标和地图级别
            // this.map.centerAndZoom(new BMap.Point(103.388611,35.563611), 5);  // 初始化地图,设置中心点坐标和地图级别
            this.map.centerAndZoom(new BMap.Point(105.000, 38.000), 5); 
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
        },
        //转化为弧度
        rad(d) {
            return d * Math.PI / 180.0
        },
        //获取垂直轨迹的四点方位角
        getPointAz(p1, p2, az) { 
            if ((p1.lng < p2.lng && p1.lat >= p2.lat) || (p1.lng >= p2.lng && p1.lat > p2.lat)) { 
                return (270 - az) + ',' + (90 - az) + ',' + (270 - az) + ',' + (90 - az)
            }
            if ((p1.lng > p2.lng && p1.lat <= p2.lat) || (p1.lng <= p2.lng && p1.lat < p2.lat)) { 
                return (270 + az) + ',' + (90 + az) + ',' + (270 + az) + ',' + (90 + az)
            }
            
            console.log("获取垂直轨迹的四点方位角")
            console.log(p1)
            console.log(p2)
            console.log(az)

        },
        drawCircleLine(i){
            var linePoints = []
            if(i!=0 && i%5 == 0){
                for(var j = i-5;j < i;j++){//3 0,1,2,3 6 3,4,5,6 //[-2,3) -2 -1 0 1 2 //[-1,4) -1 0 1 2 3 [0,5) 0 1 2 3 4 10  [5,10] 5 6 7 8 9
                    linePoints = []
                    if(this.points[j+1]){
                        linePoints.push(new BMap.Point(this.points[j].lng, this.points[j].lat))
                        linePoints.push(new BMap.Point(this.points[j+1].lng, this.points[j+1].lat))
                        //0-1 1-2 2-3 3-4 4-5
                        //5-6 6-7 7-8 8-9 9-10
                        var polyline = new BMap.Polyline(linePoints, { strokeColor: LINE_COLOR, strokeWeight: LINE_WEIGHT, strokeOpacity: LINE_OPACITY })
                        this.map.addOverlay(polyline)
                    }
                }
            }
        },
        //弧面
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
                var p = this.getOtherPoint(p2.lng,p2.lat,this.DISTANCE,sdeg + deg/8 * i).split(',')
                hmp.push(new BMap.Point(p[0],p[1]))
            }
            hmp.push(new BMap.Point(p2.lng,p2.lat))
            var opts = {
                fillColor:TRI_FILLCOLOR,
                fillOpacity:HM_FILLOPACITY,
                strokeColor:TRI_COLOR,
                strokeOpacity:TRI_OPACITY,
                strokeWeight: TRI_WEIGHT
            }
            var polygon = new BMap.Polygon(hmp,opts)
            this.map.addOverlay(polygon)
        },
        //求两个经纬度的方位角
        getAzimuth(lng1, lat1, lng2, lat2) {
            lat1 = this.rad(lat1)
            lat2 = this.rad(lat2)
            lng1 = this.rad(lng1)
            lng2 = this.rad(lng2)
            var azimuth = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1)
                * Math.cos(lat2) * Math.cos(lng2 - lng1)
            azimuth = Math.sqrt(1 - azimuth * azimuth)
            azimuth = Math.cos(lat2) * Math.sin(lng2 - lng1) / azimuth
            azimuth = Math.asin(azimuth) * 180 / Math.PI

            if (isNaN(azimuth)) {
                if (lng1 < lng2) {
                    azimuth = 90.0
                } else {
                    azimuth = 270.0
                }
            }
            return Math.ceil(azimuth)
        },
        //已知一个经纬度，方向角，距离，求另外一个点的经纬度
        getOtherPoint(lng1, lat1, distance, az) {
            distance = distance / 1000;
            az = az * Math.PI / 180;
            var lng = lng1 + (distance * Math.sin(az)) / (EARTH_ARC * Math.cos(this.rad(lat1)));
            var lat = lat1 + (distance * Math.cos(az)) / EARTH_ARC;
            return lng + "," + lat;
        },
        //设置转向
        setRota(f, m) {
            var e = 0
            f = this.map.pointToPixel(f);//起点经纬度
            m = this.map.pointToPixel(m);//终点经纬度
            if (m.x != f.x) {
                var k = (m.y - f.y) / (m.x - f.x),
                    g = Math.atan(k);
                e = g * 360 / (2 * Math.PI);
                if (m.x < f.x) {
                    e = -e + 90 + 90
                } else {
                    e = -e
                }
                return -e
            } else {
                var h = m.y - f.y;
                if (h > 0) {
                    return 90
                } else {
                    return -90
                }
            }
            return
        },
        getFlowArea1(p1, p2) {
            var areap = []
            var az, a1, a2,b1,b2,paz,ab1={}, ab2={},
            //获取轨迹方位角
            az = this.getAzimuth(p1.lng, p1.lat, p2.lng, p2.lat)
            //获取4点方位角
            paz = this.getPointAz(p1, p2, az).split(',')
            /* 获取两个点的4点坐标 */
            a1 = this.getOtherPoint(p1.lng, p1.lat, this.DISTANCE, paz[0]).split(',')
            a2 = this.getOtherPoint(p1.lng, p1.lat, this.DISTANCE, paz[1]).split(',')
            b2 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz[3]).split(',')
            b1 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz[2]).split(',')
            
            ab1.lng = (parseFloat(a1[0])+parseFloat(b1[0]))/2 
            ab1.lat = (parseFloat(a1[1])+parseFloat(b1[1]))/2
            ab2.lng = (parseFloat(a2[0])+parseFloat(b2[0]))/2
            ab2.lat = (parseFloat(a2[1])+parseFloat(b2[1]))/2
            areap.push(new BMap.Point(a1[0], a1[1]))
            areap.push(new BMap.Point(a2[0], a2[1]))
            areap.push(new BMap.Point(ab2.lng, ab2.lat))
            areap.push(new BMap.Point(ab1.lng, ab1.lat))
            //放第二个point的两个点
            var polygon = new BMap.Polygon(areap, { strokeColor: POLYGON_COLOR, strokeWeight: POLYGON_WEIGHT, strokeOpacity: POLYGON_OPACITY,fillColor:POLYGON_FILLCOLOR,fillOpacity:POLYGON_FILLOPACITY })
            this.map.addOverlay(polygon)    
        },
        getFlowArea2(p1, p2, p3) {
            var areap = []
            var az1,az2, a1, a2,b1,b2,c1,c2,paz1,paz2,ab1={}, ab2={},bc1={},bc2={}
            //获取轨迹方位角
            az1 = this.getAzimuth(p1.lng, p1.lat, p2.lng, p2.lat)
            az2 = this.getAzimuth(p2.lng, p2.lat, p3.lng, p3.lat)
            //获取4点方位角
            if(this.getPointAz(p1, p2, az1)!=null)
            paz1 = this.getPointAz(p1, p2, az1).split(',')
            if(this.getPointAz(p2, p3, az2)!=null)
            paz2 = this.getPointAz(p2, p3, az2).split(',')
            /* 获取两个点的中点坐标 */ 
            a1 = this.getOtherPoint(p1.lng, p1.lat, this.DISTANCE, paz1[0]).split(',')
            a2 = this.getOtherPoint(p1.lng, p1.lat, this.DISTANCE, paz1[1]).split(',')
            b2 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz1[3]).split(',')
            b1 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz1[2]).split(',')
            ab1.lng = (parseFloat(a1[0])+parseFloat(b1[0]))/2
            ab1.lat = (parseFloat(a1[1])+parseFloat(b1[1]))/2
            ab2.lng = (parseFloat(a2[0])+parseFloat(b2[0]))/2 
            ab2.lat = (parseFloat(a2[1])+parseFloat(b2[1]))/2
            
            b1 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz2[0]).split(',')
            b2 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz2[1]).split(',')
            c2 = this.getOtherPoint(p3.lng, p3.lat, this.DISTANCE, paz2[3]).split(',')
            c1 = this.getOtherPoint(p3.lng, p3.lat, this.DISTANCE, paz2[2]).split(',')
            bc1.lng = (parseFloat(b1[0])+parseFloat(c1[0]))/2
            bc1.lat = (parseFloat(b1[1])+parseFloat(c1[1]))/2
            bc2.lng = (parseFloat(b2[0])+parseFloat(c2[0]))/2
            bc2.lat = (parseFloat(b2[1])+parseFloat(c2[1]))/2

            areap.push(new BMap.Point(ab1.lng, ab1.lat))
            areap.push(new BMap.Point(ab2.lng, ab2.lat))
            areap.push(new BMap.Point(bc2.lng, bc2.lat))
            areap.push(new BMap.Point(bc1.lng, bc1.lat))

            //放第二个point的两个点
            var polygon = new BMap.Polygon(areap, { strokeColor: POLYGON_COLOR, strokeWeight: POLYGON_WEIGHT, strokeOpacity: POLYGON_OPACITY,fillColor:POLYGON_FILLCOLOR,fillOpacity:POLYGON_FILLOPACITY })
            this.map.addOverlay(polygon)    
        },
        getFlowArea3(p1, p2) {
            var areap = []
            var az, a1, a2,b1,b2,paz,ab1={}, ab2={},
            //获取轨迹方位角
            az = this.getAzimuth(p1.lng, p1.lat, p2.lng, p2.lat)
            //获取4点方位角
            paz = this.getPointAz(p1, p2, az).split(',')
            /* 获取两个点的4点坐标 */
            a1 = this.getOtherPoint(p1.lng, p1.lat, this.DISTANCE, paz[0]).split(',')
            a2 = this.getOtherPoint(p1.lng, p1.lat, this.DISTANCE, paz[1]).split(',')
            b2 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz[3]).split(',')
            b1 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz[2]).split(',')
            ab1.lng = (parseFloat(a1[0])+parseFloat(b1[0]))/2
            ab1.lat = (parseFloat(a1[1])+parseFloat(b1[1]))/2
            ab2.lng = (parseFloat(a2[0])+parseFloat(b2[0]))/2
            ab2.lat = (parseFloat(a2[1])+parseFloat(b2[1]))/2
            areap.push(new BMap.Point(ab1.lng, ab1.lat))
            areap.push(new BMap.Point(ab2.lng, ab2.lat))
            areap.push(new BMap.Point(b2[0], b2[1]))
            areap.push(new BMap.Point(b1[0], b1[1]))
            //放第二个point的两个点
            var polygon = new BMap.Polygon(areap, { strokeColor: POLYGON_COLOR, strokeWeight: POLYGON_WEIGHT, strokeOpacity: POLYGON_OPACITY,fillColor:POLYGON_FILLCOLOR,fillOpacity:POLYGON_FILLOPACITY })
            this.map.addOverlay(polygon)    
        },
        //判断两条线的交点
        segmentsIntr(a, b, c, d){  
            // 三角形abc 面积的2倍  
            var area_abc =(a[0] - c[0]) * (b[1] - c[1]) - (a[1] - c[1]) * (b[0] - c[0]);  
            // 三角形abd 面积的2倍  
            var area_abd = (a[0] - d[0]) * (b[1] - d[1]) - (a[1] - d[1]) * (b[0] - d[0]);   
            // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);  
            if ( area_abc*area_abd>=0 ) {  
                return false;  
            }  
            // 三角形cda 面积的2倍  
            var area_cda = (c[0] - a[0]) * (d[1] - a[1]) - (c[1] - a[1]) * (d[0] - a[0]);  
            // 三角形cdb 面积的2倍  
            // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.  

            var area_cdb = area_cda + area_abc - area_abd ;  
            if (  area_cda * area_cdb >= 0 ) {  
                return false;  
            }  
          
            //计算交点坐标  
            var t = area_cda / ( area_abd- area_abc );  
            var dx= t*(b[0] - a[0]), dy= t*(b[1] - a[1]);  
            // System.out.println(" x:"+ (a[0] + dx)+" , y:"+ (a[1] + dy) ); 
            var lng = parseFloat( parseFloat(a[0])+parseFloat(dx));
            var lat = parseFloat( parseFloat(a[1])+parseFloat(dy));
            // console.log({lng: lng,lat:lat})
            return {lng: lng,lat:lat};  
        },        
        //三个坐标点   p3是当前点
        setTrack(jdarr,p1,p2,p3){ 
            var _jdarr = [null,null]
            var areap = []
            var _areap = []
            var az1,az2, a1, a2,b1,b2,bc1,bc2,c1,c2,paz1,paz2,ab1={}, ab2={},bc1={},bc2={}
            //获取轨迹方位角
            //获取第二个点在第一个点的什么方位上
            az1 = this.getAzimuth(p1.lng, p1.lat, p2.lng, p2.lat)
            //获取第三个点在第二个点的什么方位上
            az2 = this.getAzimuth(p2.lng, p2.lat, p3.lng, p3.lat)

            if(p1.lng==p2.lng&&p1.lat==p2.lat)
                return jdarr

            //获取第一个点 以及第二个  4点方位角
            paz1 = this.getPointAz(p1, p2, az1).split(',')

            //获取第二个点 以及第三个  4点方位角
            paz2 = this.getPointAz(p2, p3, az2).split(',')

            //第一 第二 点幅宽延伸四点坐标
            a1 = this.getOtherPoint(p1.lng, p1.lat, this.DISTANCE, paz1[0]).split(',')
            a2 = this.getOtherPoint(p1.lng, p1.lat, this.DISTANCE, paz1[1]).split(',')
            b2 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz1[3]).split(',')
            b1 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz1[2]).split(',') 


            // console.log(a1)
            // console.log(a2)
            // console.log(b2)
            // console.log(b1)


            //第二 第三 点幅宽延伸四点坐标
            bc1 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz2[0]).split(',')
            bc2 = this.getOtherPoint(p2.lng, p2.lat, this.DISTANCE, paz2[1]).split(',')
            c2 = this.getOtherPoint(p3.lng, p3.lat, this.DISTANCE, paz2[3]).split(',')
            c1 = this.getOtherPoint(p3.lng, p3.lat, this.DISTANCE, paz2[2]).split(',')

            // console.log(bc1)
            // console.log(bc2)
            // console.log(c1)
            // console.log(c2)
            // console.log("end")
            //判断两线交点
            var jd1=this.segmentsIntr(a1,b1,bc1,c1); 
            // console.log(a1,b1,bc1,c1)
            // console.log(jd1)
            var jd2=this.segmentsIntr(a2,b2,bc2,c2); 
            
            
            
            var jd3=this.segmentsIntr(a1,b1,bc2,c2); 

            var jd4=this.segmentsIntr(a2,b2,bc1,c1); 



            // console.log(a2,b2,bc2,c2)
            // console.log(jd2)
            //      
            //      A2             B2       jd2
            //      
            //      A1             B1       jd1
            //      
            
            if(jdarr[0]!=null){
                let _a1=jdarr[0]
                areap.push(new BMap.Point(_a1.lng, _a1.lat))    
            }else{
                areap.push(new BMap.Point(a1[0], a1[1]))
            }
            if(jdarr[1]!=null){
                let _a2=jdarr[1]
                areap.push(new BMap.Point(_a2.lng, _a2.lat))    
            } else{
                areap.push(new BMap.Point(a2[0], a2[1]))
            }
            if(jd1!=false&&jd2!=false){
            }
           
            if(jd1!=false){
                areap.push(new BMap.Point(b2[0], b2[1]))  
                areap.push(new BMap.Point(bc2[0], bc2[1]))
                areap.push(new BMap.Point(jd1.lng, jd1.lat))
                //拐角处
                // _areap.push(new BMap.Point(b2[0], b2[1]))  
                
                // _areap.push(new BMap.Point(jd1.lng, jd1.lat))
                _jdarr[0] = jd1;
            }else if(jd2!=false){ 
                areap.push(new BMap.Point(jd2.lng, jd2.lat))
                areap.push(new BMap.Point(bc1[0], bc1[1]))
                areap.push(new BMap.Point(b1[0], b1[1]))  
                //拐角处
                // _areap.push(new BMap.Point(b1[0], b1[1]))  
                
                // _areap.push(new BMap.Point(jd2.lng, jd2.lat))
                _jdarr[1] = jd2;
            }else if(jd3!=false){
                areap.push(new BMap.Point(b2[0], b2[1]))  
                areap.push(new BMap.Point(jd3.lng, jd3.lat))

                _areap.push(new BMap.Point(b2[0], b2[1]))  
                _areap.push(new BMap.Point(bc1[0], bc1[1]))
                _areap.push(new BMap.Point(jd3.lng, jd3.lat))

                _jdarr[1] = jd3;
            }else if(jd4!=false){
                areap.push(new BMap.Point(jd4.lng, jd4.lat))
                areap.push(new BMap.Point(b1[0], b1[1]))  

                _areap.push(new BMap.Point(b1[0], b1[1]))  
                _areap.push(new BMap.Point(bc2[0], bc2[1]))
                _areap.push(new BMap.Point(jd4.lng, jd4.lat))

                _jdarr[0] = jd4;
            }else{
                areap.push(new BMap.Point(b2[0], b2[1])) 
                areap.push(new BMap.Point(b1[0], b1[1]))  
                //拐角处
                // _areap.push(new BMap.Point(b1[0], b1[1]))  
                // _areap.push(new BMap.Point(bc1[0], bc1[1]))
                // _areap.push(new BMap.Point(p2.lng, p2.lat))
            }

            //画第一点  第二点的  喷洒图
            var polygon = new BMap.Polygon(areap, { strokeColor: POLYGON_COLOR, strokeWeight: POLYGON_WEIGHT, strokeOpacity: POLYGON_OPACITY,fillColor:POLYGON_FILLCOLOR,fillOpacity:POLYGON_FILLOPACITY })
            this.map.addOverlay(polygon)  
            //画第二点 第三点 拐角处
            polygon = new BMap.Polygon(_areap, { strokeColor: POLYGON_COLOR, strokeWeight: POLYGON_WEIGHT, strokeOpacity: POLYGON_OPACITY,fillColor:POLYGON_FILLCOLOR,fillOpacity:POLYGON_FILLOPACITY })
            this.map.addOverlay(polygon) 
            return _jdarr;
        },
        
    }
}