
<template>
  <div class="hello" id="map"></div>
</template>

<script>
export default { 
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },    
  mounted() { 
    this.getmap();
  }, 
  methods: {
    getmap(){
      	// 百度地图API功能
      var map = new BMap.Map('map');
      var poi = new BMap.Point(116.307852,40.057031);
      map.centerAndZoom(poi, 16);
      map.enableScrollWheelZoom();  
      var overlays = [];
      var overlaycomplete = function(e){
            overlays.push(e.overlay);
        };
        var styleOptions = {
            strokeColor:"red",    //边线颜色。
            fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
        }
        //实例化鼠标绘制工具
        var drawingManager = new BMapLib.DrawingManager(map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: true, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
            },
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions //矩形的样式
        }); 
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hello{
  width: 100%;
  height: 500px;
}
</style>



 