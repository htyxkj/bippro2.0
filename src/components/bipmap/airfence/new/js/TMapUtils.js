export default {
    data() {
        return {
            usercode:JSON.parse(window.sessionStorage.getItem("user")).userCode,
            data2: {  
                dbid: global.DBID,
                usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
                apiId: global.APIID_AIDO, 
                assistid: '', //辅助名称
                cont: ""
            },
        }
    },
    methods:{
        /**
         * 绘制作业区，航空识别区
         * @param {*} sid 编码
         * @param {*} tMap 地图
         */
        async getOpera(sid,tMap){
            let points = [];
            if(sid){
                let aid = sid.split(";")
                for(var i=0;i<aid.length;i++){
                    let cc = await this.getOpera0(aid[i],tMap);
                    points = points.concat(cc);
                }
            }
            return points;
        },
        async getOpera0(oid,tMap){ 
            let points =[];
            this.data2.assistid = 'ROUTEOPERA', //辅助名称
            this.data2.cont = "~id ='"+oid+"'"
            let vv = await this.getDataByAPINewSync(this.data2);
            if(vv.data && vv.data.values){
                let values = vv.data.values;
                for(var i =0;i<values.length;i++){
                    let vl = values[i];
                    if(vl.mergeid){
                        let oidArr = vl.mergeid.split(";");
                        for(var l =0;l<oidArr.length;l++){
                            let cc = await this.getOpera0(oidArr[l],tMap);
                            points = points.concat(cc);
                        }
                    }else{
                        let cc = this.markSurface(vl.boundary1,vl.color,tMap)
                        points = points.concat(cc);
                    }
                }
            }
            return points;
        },
        /**
         * 绘制作业区的避让区
         * @param {*} sid 编码
         * @param {*} tMap 地图
         */
        async getOperaBr(sid,tMap){
            if(sid){
                let haid = sid.split(";")
                for(var i=0;i<haid.length;i++){
                    this.data2.assistid = 'ROUTEOPERA', //辅助名称
                    this.data2.cont = "~id ='"+sid+"'"
                    let vv = await this.getDataByAPINewSync(this.data2);
                    if(vv.data && vv.data.values){
                        let values = vv.data.values;
                        for(var i =0;i<values.length;i++){
                            let vl = values[i];
                            if(vl.mergeid){
                                let oidArr = vl.mergeid.split(";");
                                for(var l =0;l<oidArr.length;l++){
                                    this.getOperaBr0(oidArr[l],tMap);
                                }
                            }else{
                                this.getOperaBr0(haid[i],tMap);
                            }
                        }
                    }
                    
                }
            }
        },
        async getOperaBr0(oid,tMap){
            this.data2.assistid = 'ROUTEOPERAA', //辅助名称
            this.data2.cont = "~oid ='"+oid+"'"
            let vv = await this.getDataByAPINewSync(this.data2);
            if(vv.data && vv.data.values){
                let values = vv.data.values;
                for(var i =0;i<values.length;i++){
                    let vl = values[i];
                    if(vl.type ==1){
                        this.markSurface(vl.avoid,vl.color,tMap)
                    }else if(vl.type ==2){
                        this.markCircle(vl.avoid,vl.color,vl.radius,tMap);
                    }else if(vl.type ==0){
                        this.markpoint(vl.avoid,tMap)
                    }
                }
            }
        },
        /**
         * 绘制作业区航线
         * @param {*} sid  编码
         * @param {*} tMap 地图
         */
        async getOperaRoute(sid,tMap){
            let points = [];
            if(sid){
                let aid = sid.split(";")
                for(var i=0;i<aid.length;i++){
                    let cc = await this.getOperaRoute0(aid[i],tMap);
                    points = points.concat(cc);
                }
            }
            return points;
        },
        async getOperaRoute0(oaid,tMap){
            this.data2.assistid = 'ROUTEOPERA', //辅助名称
            this.data2.cont = "~id ='"+oaid+"'"
            let vv = await this.getDataByAPINewSync(this.data2);
            let points =[];
            if(vv.data && vv.data.values){
                let values = vv.data.values;
                for(var i =0;i<values.length;i++){
                    let vl = values[i];
                    this.makeRoute(vl.route,'#00FFFF',tMap)
                }
            }
            return points;
        },
        /**
         * 画覆盖面
         * @param lngLat 经纬度 信息   经度,纬度;经度,纬度。。。。。。
         * @param color 覆盖区颜色
         * @param tMap  当前地图对象
         */
        markSurface(lngLat,color,tMap){
            let boundary = lngLat.split(";");
            var points = [];
            for (var j = 0; j < boundary.length; j++) {
                let poin = boundary[j].split(",");
                if (poin.length >= 2) {
                points.push(new T.LngLat(poin[0], poin[1]));
                }
            }
            //创建面对象
            var polygon = new T.Polygon(points, {
                color: "blue",
                weight: 1,
                opacity: 0.5,
                fillColor: color,
                fillOpacity: 0.5
            });
            tMap.addOverLay(polygon);
            return points;
        },
        /**
         * 覆盖圆
         * @param lngLat 经纬度
         * @param color 颜色
         * @param radius 半径
         * @param tMap 地图
         */
        markCircle(lngLat,color,radius,tMap){
            radius = parseFloat(radius+'')
            var circle = new T.Circle(new T.LngLat(lngLat.split(",")[0], lngLat.split(",")[1]), radius,{color:"blue",weight:1,opacity:0.7,fillColor:color,fillOpacity:0.5,lineStyle:"solid"});
            //向地图上添加圆
            tMap.addOverLay(circle); 
        },
        /**
         * 画覆盖点
         * @param lngLat 经纬度 信息   经度,纬度
         * @param tMap  当前地图对象
         */
        markpoint(lngLat,tMap){
            var marker = new T.Marker(new T.LngLat(lngLat.split(",")[0], lngLat.split(",")[1]));
            //向地图上添加标注
            tMap.addOverLay(marker);
        },
        /**
         * 规划的路线
         * @param lngLat 经纬度 信息   经度,纬度;经度,纬度。。。。。。
         * @param color 颜色 未实现
         * @param tMap 当前地图对象
         * @returns 线对象
         */
        async makeRoute(lngLat,color,tMap){
            let editLine = null;
            if(lngLat && lngLat.length>1){
                let points = [];
                let boundary = lngLat.split(";");
                for (var j = 0; j < boundary.length; j++) {
                    let poin = boundary[j].split(",");
                    if (poin.length >= 2) {
                        points.push(new T.LngLat(poin[0], poin[1]));
                    }
                }
                let options ={color:color,
                    opacity: 1,
                    weight: 4,};
                //创建线对象
                editLine = new T.Polyline(points,options);
                //向地图上添加线
                tMap.addOverLay(editLine); 
            }
            return editLine;
        },


        /** 
         * @description   添加自定义飞机标注图片
         * @param lngLat  经纬度信息   xxx,xxx
         * @param tMap    天地图对象
         * @param key     标注点唯一值
         * @param click   单机回调方法
         * @returns 标注点对象
         * */        
        markRealTimeAir(lngLat,tMap,key,click){
            var icon = new T.Icon({
                iconUrl: require('@/assets/air-super/plane.png'),
                iconSize: new T.Point(40, 40),
                iconAnchor: new T.Point(20, 20)
            });
            var marker = new T.Marker(new T.LngLat(lngLat.split(",")[0], lngLat.split(",")[1]), {icon: icon});
            //向地图上添加标注
            tMap.addOverLay(marker);
            marker.key = key;
            marker.addEventListener("click",click)
            return marker;
        },
        /**
         *在每个点的真实步骤中设置小车转动的角度
         */
        setRotation(curPos, targetPos,TMap) {
            var deg = 0;
            //start!
            curPos = TMap.lngLatToContainerPoint(curPos);//起点经纬度
            targetPos = TMap.lngLatToContainerPoint(targetPos);//终点经纬度
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
            return 0;
        },
        /**
         * 每个浏览器的偏转兼容
         * @returns {string}
         * @constructor
         */
        CSS_TRANSFORM() {
            var div = document.createElement('div');
            var props = [
                'transform',
                'WebkitTransform',
                'MozTransform',
                'OTransform',
                'msTransform'
            ];

            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                if (div.style[prop] !== undefined) {
                    return prop;
                }
            }
            return props[0];
        },
        /**
         * 获取对象
         * @param cellid  对象编码
         */
        async getCell(cellid) {
            let res = await tools.getCCellsParams(cellid);
            let rtn = res.data;
            if (rtn.id == 0) {
                let kn= rtn.data.layCels;
                let cells = kn;
                return new CDataSet(cells[0]);
            } else {
                return new CDataSet("");
            }
        },
        /**
         * 检查非空项
         * @param cds CdataSet 对象
         */
        checkNotNull(cds) {
            let bok = "";
            cds.ccells.cels.forEach(item => {
                if (item.unNull && bok == "") {
                    let vl = null;
                    let hide = [];
                    if (cds.currRecord.data[item.id] != null)
                        vl = cds.currRecord.data[item.id] + "";
                    if (!vl && hide.indexOf(item.id) == -1) {
                        bok = "【" + item.labelString + "】不能为空!";
                        return bok;
                    }
                }
            });
            return bok;
        } ,
        
        dateFormat(time, format){
            var t = new Date(time);
            var tf = function(i){return (i < 10 ? '0' : '') + i};
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
                switch(a){
                    case 'yyyy':
                        return tf(t.getFullYear());
                        break;
                    case 'MM':
                        return tf(t.getMonth() + 1);
                        break;
                    case 'mm':
                        return tf(t.getMinutes());
                        break;
                    case 'dd':
                        return tf(t.getDate());
                        break;
                    case 'HH':
                        return tf(t.getHours());
                        break;
                    case 'ss':
                        return tf(t.getSeconds());
                        break;
                }
            })
        }
    }
}