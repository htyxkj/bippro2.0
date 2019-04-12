<template>
    <md-layout style="width:100%;height:100%">
        <md-layout md-flex="50">
            <div class="gaugechart" id="containerSpeedID" ></div>
        </md-layout>
        <md-layout md-flex="50">
            <div class="gaugechart" id="containerKID"></div>
        </md-layout>
    </md-layout>
</template>

<script> 
    // 最主要是这里模块的引入 很坑 

    // var Highcharts = import('highcharts/highstock');
    // var HighchartsMore = import('highcharts/highcharts-more');
    // var SolidGauge = import('highcharts/modules/solid-gauge.js');


    // import Highcharts from 'highcharts/highstock';
    // // 这个一定要引入 不然报错
    // import HighchartsMore from 'highcharts/highcharts-more';
    // import SolidGauge from 'highcharts/modules/solid-gauge.js'
    // HighchartsMore(Highcharts)
    // SolidGauge(Highcharts);
export default{
    name:'Highcharts1',
    data(){
        return{
            optionsSpeed:null,
            optionsK:null,
            containerSpeed:null, 
            containerK:null,
            Highcharts:null,
        }
    },
    props:['gaugeseries'],
    methods:{
        async init(){
            if(this.Highcharts == null){
                this.Highcharts = await import('highcharts/highstock'); 
                let HighchartsMore = await import('highcharts/highcharts-more');
                let SolidGauge = await import('highcharts/modules/solid-gauge.js');
                HighchartsMore(this.Highcharts)
                SolidGauge(this.Highcharts)
            }
            if(this.containerSpeed!=null){
                this.updateOpt();
                return;
            }
            this.Highcharts.setOptions({
		        credits: {  
		            enabled: false     //不显示LOGO 
	            }, 
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    size:"150%",
                    background: [ {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },
                yAxis: {
                    min: 0,
                    max: 200,
                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 4,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',
                    tickPixelInterval: 30,
                    tickWidth: 1,
                    tickPosition: 'inside',
                    tickLength: 4,
                    tickColor: '#666',
                    labels: {
						step: 2,
						rotation: 'auto'
				    },
                },
                colors: ['#F3387C', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
            });

            this.optionsSpeed={
                title: {
                    text: '飞行速度'
                },  
		        yAxis: {  
                    title: {
                        text: 'km/h',
                        y:5
                    },
                    plotBands: [{
                            from: 0,
                            to: 120,
                            color: '#55BF3B', // green
                            thickness: '5%'
                        }, {
                            from: 120,
                            to: 160,
                            color: '#DDDF0D', // yellow
                            thickness: '5%'
                        }, {
                            from: 160,
                            to: 200,
                            color: '#DF5353', // red
                            thickness: '5%'
                    }]
		        },
                series: [{
                    name: '飞行速度',
                    data: [0],
                    tooltip: {
                            valueSuffix: ' km/h'
                    }
                }]
            }
            this.optionsK={ 
                title: {
                    text: '喷雾压强'
                }, 
                // the value axis
                yAxis: { 
                    title: {
                        text: 'KPa',
                        y:5
                    },
                plotBands: [
                    {
						from: 0,
						to: 120,
                        color: '#55BF3B', // green
                        thickness: '5%'
				    }, {
						from: 120,
						to: 160,
                        color: '#DDDF0D', // yellow
                        thickness: '5%'
				    }, {
						from: 160,
						to: 200,
                        color: '#DF5353', // red
                        thickness: '5%'
                    }]
                },
                series: [{
                    name: '喷雾压强',
                    data: [0],
                    tooltip: {
                        valueSuffix: 'KPa'
                    }
                }]
            }
            // this.containerSpeed =  Highcharts.chart("containerSpeedID",this.optionsSpeed);
            // this.containerK =  Highcharts.chart("containerKID",this.optionsK);
            this.containerSpeed =  this.Highcharts.chart("containerSpeedID",this.optionsSpeed);
            this.containerK =  this.Highcharts.chart("containerKID",this.optionsK);

            this.updateOpt();
        }, 
        updateOpt(){
            if(this.gaugeseries.length>0){  
                var speed = this.containerSpeed.series[0].points[0];
                if(this.gaugeseries[0])
                    this.gaugeseries[0] = parseFloat(this.gaugeseries[0]);
                var sp = parseFloat(this.gaugeseries[0].toFixed(2))
                speed.update(sp);
                var kpa = this.containerK.series[0].points[0];
                if(this.gaugeseries[1])
                    this.gaugeseries[1] = parseFloat(this.gaugeseries[1]);
                var kp = parseFloat(this.gaugeseries[1].toFixed(2))
                kpa.update(kp);
            }
        }, 
    },
    async created(){ 
        
    },
    mounted(){
        
    },
    watch:{
        'gaugeseries':function(){ 
            if(this.gaugeseries.length>0){
                this.init()
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.gaugechart{
    width:100%;
    height:100%;
    // display: flex;
    // padding-left: 1em;
}  
</style>

