<template>
    <div class="linechart" id="heightlinechart">
        <div v-if="showMsg" class="msgBar">
            {{msg}}
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'

export default{
    name:'echarts',
    data(){
        return{
            options:null,
            heightlinechart:null,
            data:[],
            showMsg:true,
            msg:'暂无数据', 
        }
    },
    props:['lineseries'],
    methods:{
        init(){
            // this.options.title.text=this.lineseries[0].title; 
            this.heightlinechart = echarts.init(document.getElementById('heightlinechart'))
            this.setOpt()
        },
        setOpt(){
            window.onresize = () =>{
                this.heightlinechart.resize()
            }
            this.heightlinechart.setOption(this.options)
        },
        updateOpt(){
            if(this.data.length>8){
                this.data.shift()
            }
            if(this.lineseries.length>0){
                this.data.push({value:[this.lineseries[0].time,this.lineseries[0].val]}) 
                this.options.series = [{data:this.data}]
            }
            
        },
        loadOptions(){
            this.options = {
                title: {
                    text: "海拔高度图",
                    left:'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return `海拔 : ${params[0].value[1]}/(m)`;
                    },
                    axisPointer: {
                        animation: false
                    }
                },
                xAxis: {
                    type: 'time',
                    splitLine:{
                        show:false
                    },
                    splitNumber:5,
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine:{
                        show:false
                    },
                    // axisLabel : {
                    //     formatter: '{value} m'
                    // },
                    splitNumber:4
                }, 
                series:[{ 
                    type:'line',
                    smooth:true,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                shadowColor : 'rgba(0,0,0,0.4)'
                            }
                        }
                    },
                }],
                grid:{
                    show:true,
                    left:'10%',
                    right:'10%',
                    top:'20%',
                    bottom:'20%',
                    width:'auto',
                    height:'auto'
                }
            }
        },
    },
    mounted(){
        this.loadOptions()
    },
    watch:{
        'lineseries':function(){
            if(this.lineseries.length>0){
                this.showMsg = false
                this.init()
                if(this.lineseries[0].id == 0){
                    this.data = []
                }
                this.updateOpt()
                this.setOpt()
            }
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

