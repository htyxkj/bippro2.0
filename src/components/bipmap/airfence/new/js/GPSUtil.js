export default {
    data() {
        return {
            pi : 3.1415926535897932384626,
            x_pi : 3.14159265358979324 * 3000.0 / 180.0,
            a : 6378245.0,
            ee : 0.00669342162296594323,
        }
    },
    methods:{
        transformLat(x,y) {  
            var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y  
                    + 0.2 * Math.sqrt(Math.abs(x));  
            ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;  
            ret += (20.0 * Math.sin(y * this.pi) + 40.0 * Math.sin(y / 3.0 * this.pi)) * 2.0 / 3.0;  
            ret += (160.0 * Math.sin(y / 12.0 * this.pi) + 320 * Math.sin(y * this.pi / 30.0)) * 2.0 / 3.0;  
            return ret;  
        },  

        transformLon(x,y) {  
            var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1  
                    * Math.sqrt(Math.abs(x));  
            ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;  
            ret += (20.0 * Math.sin(x * this.pi) + 40.0 * Math.sin(x / 3.0 * this.pi)) * 2.0 / 3.0;  
            ret += (150.0 * Math.sin(x / 12.0 * this.pi) + 300.0 * Math.sin(x / 30.0  
                    * this.pi)) * 2.0 / 3.0;  
            return ret;  
        },
        transform(lat,lon) {  
            if (this.outOfChina(lat, lon)) {  
                return [lat,lon];  
            }  
            var dLat = this.transformLat(lon - 105.0, lat - 35.0);  
            var dLon = this.transformLon(lon - 105.0, lat - 35.0);  
            var radLat = lat / 180.0 * this.pi;  
            var magic = Math.sin(radLat);  
            magic = 1 - this.ee * magic * magic;  
            var sqrtMagic = Math.sqrt(magic);  
            dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi);  
            dLon = (dLon * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);  
            var mgLat = lat + dLat;  
            var mgLon = lon + dLon;  
            return [mgLat,mgLon];
        },  
        outOfChina(lat,lon) {  
            if (lon < 72.004 || lon > 137.8347)  
                return true;  
            if (lat < 0.8293 || lat > 55.8271)  
                return true;  
            return false;  
        },  
        /** 
         * 84 to 火星坐标系 (GCJ-02) World Geodetic System ==> Mars Geodetic System 
         * 
         * @param lat 
         * @param lon 
         * @return 
         */  
        gps84_To_Gcj02(lat,lon) {  
            if (this.outOfChina(lat, lon)) {  
                return [lat,lon];
            }  
            var dLat = this.transformLat(lon - 105.0, lat - 35.0);  
            var dLon = this.transformLon(lon - 105.0, lat - 35.0);  
            var radLat = lat / 180.0 * this.pi;  
            var magic = Math.sin(radLat);  
            magic = 1 - this.ee * magic * magic;  
            var sqrtMagic = Math.sqrt(magic);  
            dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi);  
            dLon = (dLon * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);  
            var mgLat = lat + dLat;  
            var mgLon = lon + dLon;  
            return [mgLat, mgLon];
        },  
    
        /** 
         * * 火星坐标系 (GCJ-02) to 84 * * @param lon * @param lat * @return 
         * */  
        gcj02_To_Gps84(lat, lon) {  
            var gps = this.transform(lat, lon);  
            var lontitude = lon * 2 - gps[1];  
            var latitude = lat * 2 - gps[0];  
            return [latitude, lontitude];
        },  
        /** 
         * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换算法 将 GCJ-02 坐标转换成 BD-09 坐标 
         * 
         * @param lat 
         * @param lon 
         */  
        gcj02_To_Bd09(lat,lon) {  
            var x = lon, y = lat;  
            var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);  
            var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);  
            var tempLon = z * Math.cos(theta) + 0.0065;  
            var tempLat = z * Math.sin(theta) + 0.006;  
            var gps = {tempLat,tempLon};  
            return gps;  
        },  
        /** 
         * * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换算法 * * 将 BD-09 坐标转换成GCJ-02 坐标 * * @param 
         * bd_lat * @param bd_lon * @return 
         */  
        bd09_To_Gcj02(lat,lon) {  
            var x = lon - 0.0065, y = lat - 0.006;  
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);  
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);  
            var tempLon = z * Math.cos(theta);  
            var tempLat = z * Math.sin(theta);  
            var gps = {tempLat,tempLon};  
            return gps;  
        },  
    
        /**将gps84转为bd09 
         * @param lat 
         * @param lon 
         * @return 
         */  
        gps84_To_bd09(lat,lon){  
            var gcj02 = this.gps84_To_Gcj02(lat,lon);  
            var bd09 = this.gcj02_To_Bd09(gcj02[0],gcj02[1]);  
            return bd09;  
        },  
        bd09_To_gps84(lat,lon){  
            var gcj02 = this.bd09_To_Gcj02(lat, lon);  
            var gps84 = this.gcj02_To_Gps84(gcj02.tempLat, gcj02.tempLon);  
            //保留小数点后六位  
            gps84[0] = (gps84[0]);  
            gps84[1] = (gps84[1]);  
            return gps84;  
        }  
    }
}