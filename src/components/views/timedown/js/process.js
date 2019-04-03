export default {
    mounted() { 
    },
    data() {
        return { 
            settings : {
                id:this.id,         // ID，canvas一定要有ID属性
                size: 130,            // 绘制圆形的最大尺寸，宽=高
                borderWidth: 4,       // 边框宽度
                borderColor:"#fff",   // 边框颜色
                outerColor:"#fff",    // 最外层底圆颜色
                scheduleColor:"#fff", // 进度条动画颜色
                fontColor: "#fff",    // 字体颜色
                ringColor: "#ffc720", // 进度条环形颜色
                innerColor: "#4e84e5",// 最内圆底色
                fontSize: 50,
                time: 50,
                endTime:'',
            },
            obj:null,
            timer:null,
            schedule:null,
            format:'', 
        }
    },
    methods:{ 
        init(opt) { 
            this.obj = document.getElementById(this.settings.id);
            this.obj.width = this.settings.size;
            this.obj.height = this.settings.size;
            this.ctx = this.obj.getContext("2d");
            this.extend(this.settings, opt);
            this.countdown();
            // this.startDown();
        },
        // 绘制底色
        drawBackground() {
            this.drawCircle(0, 360, 0, this.settings.outerColor);
        },
        // 绘制进度条动画背景
        drawProcess() {
            this.drawCircle(0, 360, 4, this.settings.ringColor);
        },
        // 绘制倒计时
        drawInner () {
            this.drawCircle(0, 360, 23, this.settings.innerColor);
            this.strokeBorder(this.settings.borderWidth);
        },
        // 绘制进度条动画
        drawAnimate() {
            // 旋转的角度
            let deg = Math.PI / 180;
            let v = this.schedule * 360,
                startAng = -90,
                endAng = -90 + v;

            this.ctx.beginPath();
            this.ctx.moveTo(this.settings.size / 2, this.settings.size / 2);
            this.ctx.arc(this.settings.size / 2, this.settings.size / 2, this.settings.size / 2 -3, startAng * deg, endAng * deg, false);
            this.ctx.fillStyle = this.settings.scheduleColor;
            this.ctx.fill();
            this.ctx.closePath();
        },
        // 绘制边框
        strokeBorder (borderWidth) {
            this.ctx.lineWidth = borderWidth;
            this.ctx.strokeStyle = this.settings.borderColor;
            this.ctx.stroke();
        },
        // 绘制文字
        strokeText (text) {
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.font = this.settings.fontSize+"px"+ " microsoft yahei";
            this.ctx.fillStyle = this.settings.fontColor;
            this.ctx.fillText(text, this.settings.size / 2, this.settings.size / 2);
        },
        // 绘制圆
        drawCircle(startAng, endAng, border, fillColor) {
            let deg = Math.PI / 180;
            this.ctx.beginPath();
            this.ctx.arc(this.settings.size / 2, this.settings.size / 2, this.settings.size / 2 -border, startAng * deg, endAng * deg, false);
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
            this.ctx.closePath();
        },
        // 进度条动画
        countdown() {
            let oldTime = +new Date();
            this.timer = setInterval(() => {
                let allMs = this.settings.time * 1000,// 如30*1000=30 000ms
                    currentTime = +new Date();
                // 步长=（当前的时间-过去的时间）/总秒数
                this.schedule = (currentTime - oldTime) / allMs; 

                this.drawAll(this.schedule);
                if (currentTime - oldTime >= allMs) {
                    // 重绘
                    this.drawBackground();
                    this.drawProcess();
                    this.drawAnimate();
                    this.drawInner();
                    this.strokeText(0);
                    clearInterval(this.timer);
                }
            }, 100);
        },

        startDown(){
            this.timer = setInterval(function(){
                let nowTime = new Date();
                let endTime = new Date(this.settings.endTime);
                let t = endTime.getTime() - nowTime.getTime();
                if(t>0){
                    let day = Math.floor(t/86400000);
                    let hour=Math.floor((t/3600000)%24);
                    let min=Math.floor((t/60000)%60);
                    let sec=Math.floor((t/1000)%60);
                    hour = hour < 10 ? "0" + hour : hour;
                    min = min < 10 ? "0" + min : min;
                    sec = sec < 10 ? "0" + sec : sec;
                    this.format = '';
                    if(day > 0){
                        format = `${day}天${hour}小时${min}分${sec}秒`;
                    } 
                    if(day <= 0 && hour > 0 ){
                        format = `${hour}小时${min}分${sec}秒`; 
                    }
                    if(day <= 0 && hour <= 0){
                        format =`${min}分${sec}秒`;
                    } 
                    // 步长=（当前的时间-过去的时间）/总秒数
                    this.schedule = (nowTime - endTime) / t;  
                    this.drawAll(this.schedule);
                }else{
                    clearInterval(this.timer);
                }
            });
        },

        // 绘制所有
        drawAll(schedule) {
            schedule = schedule >= 1 ? 1 : schedule;
            let text = parseInt(this.settings.time * (1 - schedule)) + 1;
            // 清除画布
            this.ctx.clearRect(0, 0, this.settings.size, this.settings.size);
            this.drawBackground();
            this.drawProcess();
            this.drawAnimate();
            this.drawInner();
            this.strokeText(text);
        },
        extend(obj1,obj2){
            for(let attr in obj2){
                obj1[attr] = obj2[attr];
            }
        }
    }
} 









 