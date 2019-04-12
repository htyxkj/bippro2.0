<template>
    <div class="linechart" id="linechartid">
        <div v-if="showMsg" class="msgBar">
            {{msg}}
        </div>
    </div>
</template>

<script>
// import Highcharts from 'highcharts';
// require('highcharts/highcharts-3d')(Highcharts);

export default{
    name:'Highcharts1',
    data(){
        return{
            options:null,
            linecharts:null,
            data:[],
            showMsg:true,
            msg:'暂无数据', 
            Highcharts:null,
        }
    },
    props:['lineseries'],
    methods:{
        async init(){
             
            if(this.Highcharts == null){
                this.Highcharts = await import('highcharts');
            }
            if(this.linecharts !=null&&this.data.length>0){
                this.updateOpt();
                return;
            }
                
            var x =new Date(this.lineseries[0].time).getTime();
            var y = this.lineseries[0].val; 
            this.data.push({x:x,y:y});
            this.options ={ 
                tooltip: {
                    // valueSuffix: 'XXXXXX',
                    followPointer: true,
                    formatter: function () {
                        return `流量 : `+this.y+`/(m³/h)`;
                    }, 
                },
                chart: {
                    type: 'spline',
                    marginRight: 10, 
		        },
                title: {
                    text: '流量图'
                },
                xAxis: {
                    type: 'datetime',
                    labels: { 
                        formatter:function() {
                            var fmt = 'hh:mm:ss';
                            var date = new Date(this.value);
                            var o = {   
                                "M+" : date.getMonth()+1,                 //月份   
                                "d+" : date.getDate(),                    //日   
                                "h+" : date.getHours(),                   //小时   
                                "m+" : date.getMinutes(),                 //分   
                                "s+" : date.getSeconds(),                 //秒   
                                "q+" : Math.floor((date.getMonth()+3)/3), //季度   
                                "S"  : date.getMilliseconds()             //毫秒   
                            };   
                            if(/(y+)/.test(fmt))   
                                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
                            for(var k in o)   
                                if(new RegExp("("+ k +")").test(fmt))   
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
                            return fmt;                            
                        }
                    }
                },
                yAxis: { 
                    min:0,
                    floor: 0,//下线
                    title: {
                        text: ''
                    },
                    tickPositioner: function () {
                        var positions = []; 
                        if(this.dataMax&&this.dataMin){
                            var min = this.dataMin.toFixed(0)
                            var max = this.dataMax.toFixed(0)
                            
                            if(min != max){
                                min = ( parseInt(min)-3);
                                max = ( parseInt(max)+3); 
                                var increment = Math.ceil((max - min) / 5);
                                for (min; min - increment <= max; min += increment) {
                                    positions.push(min);
                                }
                            }else{
                                min = parseInt(min);
                                positions= [min-3,min-2,min-1,min,min+1,min+2]
                            }
                        }else{
                            positions=[0,5,10,15,20]
                        }
                        // console.log(positions);
                        return positions;
                    }
                }, 
                legend: {
                    enabled: false
                },
                series: [{
                    name: '瞬时流量',
                    data: []
                }],
                credits: {  
                    enabled: false     //不显示LOGO 
                }, 
                colors: ['#F3387C', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
            }
            // this.options.series[0].data=this.data; 
            // this.linecharts = Highcharts.chart("linechartid",this.options);
            this.linecharts = this.Highcharts.chart("linechartid",this.options);
            this.updateOpt();
        }, 
        updateOpt(){
            if(this.linecharts == null){
                return;
            } 
            if(this.lineseries.length>0){ 
               if(this.lineseries[0].id == -1)
                    return; 
                var x =new Date(this.lineseries[0].time).getTime();
                var y = this.lineseries[0].val; 
                this.data.push({x:x,y:y});

                var x =new Date(this.lineseries[0].time).getTime();
                var y = this.lineseries[0].val; 
                var flag = false
                if(this.data.length>6){
                    flag = true;
                }
                this.linecharts.series[0].addPoint([x, y], true, flag); 
            }
        },   
    }, 
    async created(){
        // if(this.Highcharts == null){
        //     this.Highcharts = await import('highcharts/highstock');
        // }
    },
    watch:{
        'lineseries':function(){
            if(this.lineseries[0].id == 0){
                this.data = []
            }
            this.init();
            // if(this.lineseries.length>0){
            //     this.showMsg = false
            //     this.updateOpt() 
            // }
        }
    }
}
</script>

<style lang="scss" scoped>
.linechart{
    width:100%;
    height:100%;
    display: flex;
    padding-left: 1em;
}
.msgBar{
    font-size: 18px;
    text-align: center;
    margin:auto;
}
</style>

