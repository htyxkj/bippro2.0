<template>
	<div class="progress-wrapper" :style="wrapStyle">
        <div class="progress" @mousedown.stop="mousedownHandler" @mouseover.stop="mouseoverHandler"
             @mousemove.stop="mousemoveHandler" @mouseup.stop="mouseupHandler" @mouseout.stop="mouseoutHandler" :style="pBarStyle">
            <div class="left" :style="leftStyle">
                <div class="ball" :style="ballStyle"></div>
            </div>
        </div>
        <md-tooltip md-direction="top">{{SuspensionTime}}</md-tooltip>
    </div>
</template>

<script>
    export default {
        name: 'ProgressBar',
        props: {
            leftBg: String,
            bgc: String,
            ballBgc: String,
            height: String,
            width: String,  
            percent: {
                type: Number,
                default: 0,
            }
        },
        data: function () {
            return {
                wrapStyle: {
                    'width': this.width,
                },
                pBarStyle: {
                    'backgroundColor': this.bgc,
                    'height': this.height,
                },
                leftStyle: {
                    'width': this.percent + '%',
                    'background': this.leftBg,
                    'height': this.height,
                },
                ballStyle: {
                    'backgroundColor': this.ballBgc,
                    'height': this.height,
                    'width': this.height,
                    // 'borderRadius': parseInt(this.height) / 2 + 'px',
                    // 'right': - parseInt(this.height) / 2 + 'px',
                },
                // 标记是否按下鼠标
                isMouseDownOnBall: false,
                // 鼠标进body时是否是mousedown
                isMouseDownOnBody: false,
                // 鼠标离开进度条时的clientX
                outProgressClientX: 0,
                // 主要用于防止一个页面内有多个本组件，MouseMove时互相影响而设置的字段
                isCurrentProgress: false,
                //时间点数  秒    早上4点到晚上22点
                pointNum:86400,
                //鼠标悬浮显示时间
                SuspensionTime:'',
            }
        },
        computed: {
            progressElement(){
                return this.$el.getElementsByClassName('progress')[0];
            },
        },
        methods: {
            mousedownHandler(e){ 
                if(e.which === 1){
                    this.isMouseDownOnBall = true;
                    this.isCurrentProgress = true;
                }
            },
            mousemoveHandler(e){
                //拖拽
                if(this.isMouseDownOnBall && this.isCurrentProgress){
                    let decimal = (e.clientX - this.$el.offsetLeft-15) / this.progressElement.clientWidth; 
                    let percent = decimal * 100; 
                    this.leftStyle.width = percent + '%';
                    this.$emit('pbar-drag', percent);
                }
                //悬停
                if(this.isMouseDownOnBall == false){
                    let decimal = (e.clientX - this.$el.offsetLeft-15) / this.progressElement.clientWidth; 
                    let percent = decimal * 100; 
                    let time = parseInt(this.pointNum*percent/100)
                    var t = new Date('2018-01-01 00:00:00');
                    var t_s = t.getTime();//转化为时间戳毫秒数
                    t.setTime(t_s+(time*1000)); 
                    this.SuspensionTime=this.formatDate(t,'hh:mm:ss'); 
                }
            },
            mouseupHandler(e){ 
                if(this.isMouseDownOnBall && this.isCurrentProgress){
                    let decimal = (e.clientX - this.$el.offsetLeft-15) / this.progressElement.clientWidth;
                    let percent = decimal * 100;
                    this.leftStyle.width = percent + '%';
                    this.$emit('pbar-seek', percent);
                    this.isMouseDownOnBall = false;
                    this.isCurrentProgress = false;
                }
            },
            mouseoverHandler(e){ 
                // 没有按左键进入进度条
                if(e.which === 0){
                    this.isMouseDownOnBall = false;
                }
            },
            mouseoutHandler(e){ 
                if(e.which === 1 && this.isCurrentProgress){
                    this.outProgressClientX = e.clientX;
                    this.isMouseDownOnBody = true;
                    this.bodyEventHandler();
                }
            },
            // body元素的事件监听器
            bodyEventHandler(){ 
                let body = document.getElementsByTagName('body')[0];
                body.addEventListener('mousemove', this.bodyMousemoveHandler);
                body.addEventListener('mouseup', (e) => {
                    this.isMouseDownOnBall = false;
                    this.isMouseDownOnBody = false;
                    this.outProgressClientX = 0;
                    this.isCurrentProgress = false;
                    body.removeEventListener('mousemove', this.bodyMousemoveHandler);
                })
            },
            // body元素的mousemove事件监听器
            bodyMousemoveHandler(e){ 
                e.preventDefault();
                if(e.which === 1 && this.isMouseDownOnBody === true){
                    let offsetX = e.clientX - this.outProgressClientX;
                    // 右移了
                    if(offsetX > 0){
                        // 在进度条右边界内
                        if(e.clientX < this.progressElement.clientWidth + this.$el.offsetLeft-15){
                            let decimal = (e.clientX - this.$el.offsetLeft-15) / this.progressElement.clientWidth;
                            let percent = decimal * 100;
                            this.leftStyle.width = percent + '%';
                            this.$emit('pbar-drag', percent)
                            // 超出右边界
                        }else{
                            this.leftStyle.width = '100%';
                            this.$emit('pbar-drag', 100);
                        }
                        // 左移了
                    }else if(offsetX < 0){
                        // 在进度条左边界内
                        if(e.clientX > this.$el.offsetLeft-15){
                            let decimal = (e.clientX - this.$el.offsetLeft-15) / this.progressElement.clientWidth;
                            let percent = decimal * 100;
                            this.leftStyle.width = percent + '%';
                            this.$emit('pbar-drag', percent)
                            // 超出左边界
                        }else{
                            this.leftStyle.width = '0%';
                            this.$emit('pbar-drag', 0);
                        }
                    }
                }
            },
            //日期格式化
            formatDate(date,fmt){
                if(/(y+)/.test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear()+'').substr(4-RegExp.$1.length));
                }
                let o = {
                    'M+': date.getMonth()+1,
                    'd+': date.getDate(),
                    'h+': date.getHours(),
                    'm+': date.getMinutes(),
                    's+': date.getSeconds()
                }
                for(let k in o){    
                    let str = o[k]+'';
                    if(new RegExp(`(${k})`).test(fmt)){
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1)?str:this.padLeftZero(str));
                    }
                }
                return fmt;
            },
            padLeftZero(str){
                return ('00'+str).substr(str.length);
            },
        },
        watch: {
            percent(cur, old){ 
                this.leftStyle.width = cur + '%';
            }
        }
    }
</script>

<style scoped>
    /* .progress-wrapper{
         width:100%; 
    } */
    .progress{
        width:100%;
        height:20px;
        background-color: #ccc;
        overflow: hidden;
        cursor: pointer;
        margin: 0px;
        padding: 0px;
    }
    .left{
        height:100%;
        width: 0%;
        background-color: greenyellow;
        position: relative;
    }
    .ball{
        height:100%;
        width:6px;
        -webkit-border-radius:10px;
        -moz-border-radius:10px;
        border-radius:10px;
        background-color: red;
        position: absolute;
        right: -4px;
    }
</style>
