<template>
  <div style="width:100%;padding-right:10px"> 
    <div class="md-input-container"  style="width:100%">
      <div style="width:20%">
        <label>{{cell.labelString}}</label>
      </div> 
      <div class="canvas"> 
        <img class="img" :src="imgVal" v-if="canvas_isimg" @click="write(cell.id+'canvas_dialog')"/>
        <img class="img" v-else @click="write(cell.id+'canvas_dialog')"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAABcCAYAAADH/8j0AAACuklEQVR4Xu3UQQ0AAAwCseHf9Gzco1NAysLOESBAICKwSA4xCBAgcAbJExAgkBEwSJkqBCFAwCD5AQIEMgIGKVOFIAQIGCQ/QIBARsAgZaoQhAABg+QHCBDICBikTBWCECBgkPwAAQIZAYOUqUIQAgQMkh8gQCAjYJAyVQhCgIBB8gMECGQEDFKmCkEIEDBIfoAAgYyAQcpUIQgBAgbJDxAgkBEwSJkqBCFAwCD5AQIEMgIGKVOFIAQIGCQ/QIBARsAgZaoQhAABg+QHCBDICBikTBWCECBgkPwAAQIZAYOUqUIQAgQMkh8gQCAjYJAyVQhCgIBB8gMECGQEDFKmCkEIEDBIfoAAgYyAQcpUIQgBAgbJDxAgkBEwSJkqBCFAwCD5AQIEMgIGKVOFIAQIGCQ/QIBARsAgZaoQhAABg+QHCBDICBikTBWCECBgkPwAAQIZAYOUqUIQAgQMkh8gQCAjYJAyVQhCgIBB8gMECGQEDFKmCkEIEDBIfoAAgYyAQcpUIQgBAgbJDxAgkBEwSJkqBCFAwCD5AQIEMgIGKVOFIAQIGCQ/QIBARsAgZaoQhAABg+QHCBDICBikTBWCECBgkPwAAQIZAYOUqUIQAgQMkh8gQCAjYJAyVQhCgIBB8gMECGQEDFKmCkEIEDBIfoAAgYyAQcpUIQgBAgbJDxAgkBEwSJkqBCFAwCD5AQIEMgIGKVOFIAQIGCQ/QIBARsAgZaoQhAABg+QHCBDICBikTBWCECBgkPwAAQIZAYOUqUIQAgQMkh8gQCAjYJAyVQhCgIBB8gMECGQEDFKmCkEIEDBIfoAAgYyAQcpUIQgBAgbJDxAgkBEwSJkqBCFAwCD5AQIEMgIGKVOFIAQIGCQ/QIBARsAgZaoQhAABg+QHCBDICBikTBWCECBgkPwAAQIZAYOUqUIQAgQe97UAXffUEn8AAAAASUVORK5CYII="/>
      </div>
      <slot></slot>   
    </div> 
    <template v-if="showDialog">
      <md-dialog :ref="cell.id+'canvas_dialog'" class="md-bip-dialog canvas-dialog">
        <md-dialog-title>{{cell.labelString}}</md-dialog-title>
          <md-dialog-content > 
            <img v-show="canvas_isimg" class="show_img" :src="imgVal"  />
            <div v-show="!canvas_isimg" :ref="cell.id+'canvasHW'">
              <canvas id="thecanvas" @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'  :ref="cell.id+'canvasF'"   @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"></canvas>
            </div>
          </md-dialog-content>
          <md-dialog-actions>
            <md-button class="md-primary" @click="cancel(cell.id+'canvas_dialog')">取消</md-button>
            <md-button class="md-primary" v-if="this.dsm.canEdit" @click="overwrite">重写</md-button>
            <md-button class="md-primary" v-if="this.dsm.canEdit" @click="save(cell.id+'canvas_dialog')">提交</md-button>
          </md-dialog-actions> 
      </md-dialog>
    </template>
  </div>
</template>

<script>
  import comm from './modal.js';
  import axios from "axios";
  export default {
      mixins:[comm],
      name: "signature",
      props: {
        dsm: { 
          default:null,
        }
      },
      data(){
        return{
          points:[],
          canvasTxt:null,
          startX:0,
          startY:0,
          moveY:0,
          moveX:0,
          endY:0,
          endX:0,
          w:null,
          h:null,
          isDown:false,
          src:'',
          canvas:null,
          canvas_isimg:false,
          imgVal:null,
          lt:null,
          showDialog:false,
        }
      },
      created(){

      },
      mounted(){
        this.imgVal = null;
        if(this.modal&&this.modal[this.cell.id]!=undefined){
          this.oldValue = this.modal[this.cell.id];
          this.upData = this.modal[this.cell.id];
        }
        if(this.oldValue!=null && this.oldValue !=''){
          this.canvas_isimg = true;
          this.imgVal = this.oldValue;
        }
      },
      components:{ 
      },
      computed: { 
        
      },
      methods:{ 
        //电脑设备事件
        mouseDown(ev){
          ev = ev || event;
          ev.preventDefault(); 
          if(1){
            let obj={
              x:ev.offsetX,
              y:ev.offsetY
            }; 
            this.startX=obj.x;
            this.startY=obj.y;
            this.canvasTxt.beginPath();
            this.canvasTxt.moveTo(this.startX, this.startY);
            this.canvasTxt.lineTo(obj.x, obj.y);
            this.canvasTxt.stroke();
            this.canvasTxt.closePath();
            this.points.push(obj);
            this.isDown=true;
          }
        },
        //移动设备事件 开始绘制
        touchStart(ev){ 
          this.canvasTxt.beginPath();
          var x = ev.changedTouches[0].pageX - this.lt.left;
          var y = ev.changedTouches[0].pageY - this.lt.top;
          this.canvasTxt.moveTo(x, y);
        },
        //电脑设备事件
        mouseMove(ev){
          ev = ev || event;
          ev.preventDefault();
          if(this.isDown){
            let obj={
              x:ev.offsetX,
              y:ev.offsetY
            };
            this.moveY=obj.y;
            this.moveX=obj.x;
            this.canvasTxt.beginPath();
            this.canvasTxt.moveTo(this.startX, this.startY);
            this.canvasTxt.lineTo(obj.x, obj.y);
            this.canvasTxt.stroke();
            this.canvasTxt.closePath();
            this.startY=obj.y;
            this.startX=obj.x;
            this.points.push(obj);
          }
        },
        //移动设备事件 绘制中
        touchMove(ev){ 
          var x = ev.changedTouches[0].pageX - this.lt.left;
          var y = ev.changedTouches[0].pageY - this.lt.top;
          this.canvasTxt.lineTo(x, y); 
          this.canvasTxt.stroke();
        },
        //电脑设备事件
        mouseUp(ev){
          ev = ev || event;
          ev.preventDefault();
          if(1){
            let obj={
              x:ev.offsetX,
              y:ev.offsetY
            };
            this.canvasTxt.beginPath();
            this.canvasTxt.moveTo(this.startX, this.startY);
            this.canvasTxt.lineTo(obj.x, obj.y);
            this.canvasTxt.stroke();
            this.canvasTxt.closePath();
            this.points.push(obj);
            this.points.push({x:-1,y:-1});
            this.isDown=false;
          }
        },
        //移动设备事件 结束绘制
        touchEnd(ev){ 
          this.canvasTxt.closePath();
        },
        //提交签名
        save(){ 
          var imgBase64 = this.canvas.toDataURL(); 
          this.modal[this.cell.id]=imgBase64;
          var refBackData = {
            cellId:this.cell.id,
            value:imgBase64,
            oldValue:this.oldValue,
            multiple:false
          };
          this.imgVal = imgBase64;
          this.$emit('change',refBackData);
          this.cancel(this.cell.id+'canvas_dialog');
          this.$set(this,'canvas_isimg',true);
          this.canvas_isimg=true;
        },
        //重写
        overwrite(){
          if(this.canvas_isimg){
            this.canvas_isimg = false;
            setTimeout(() => {
              this.canvas=this.$refs[this.cell.id+'canvasF'];
              this.canvas.height = this.$refs[this.cell.id+'canvasHW'].offsetHeight;
              this.canvas.width =this.$refs[this.cell.id+'canvasHW'].offsetWidth-10;
              this.canvasTxt=this.canvas.getContext("2d");
              this.canvasTxt.fillStyle = "#FFFFFF";
              this.canvasTxt.fillRect(0,0,this.canvas.width,this.canvas.height); 
              this.lt = this.getPosition(this.$refs[this.cell.id+'canvasHW'])
              this.overwrite();
             }, 300);
          }else{
              this.canvas_isimg = false;
              this.canvasTxt.clearRect(0, 0, this.canWidth, this.canHeight);
              this.points=[];
          }
        },
        //取消
        cancel(ref){ 
          this.$refs[ref].close(); 
        },
        //写
        write(ref){ 
          this.showDialog = true;
          setTimeout(() => {
            this.$refs[ref].open();
            if(this.modal[this.cell.id] != null && this.modal[this.cell.id] !=''){
                this.canvas_isimg = true;
            }else{
              this.canvas_isimg=false;
              setTimeout(() => {
                this.canvas=this.$refs[this.cell.id+'canvasF'];
                this.canvas.height = this.$refs[this.cell.id+'canvasHW'].offsetHeight;
                this.canvas.width =this.$refs[this.cell.id+'canvasHW'].offsetWidth-10;
                this.canvasTxt=this.canvas.getContext("2d");
                this.canvasTxt.fillStyle = "#FFFFFF";
                this.canvasTxt.fillRect(0,0,this.canvas.width,this.canvas.height); 
                this.lt = this.getPosition(this.$refs[this.cell.id+'canvasHW'])
              }, 300);
            }
          }, 200);
        },
        getPosition(obj){
          var l=0;
          var t=0;
          while(obj){
              l+=obj.offsetLeft;
              t+=obj.offsetTop;
              obj=obj.offsetParent;
          }
          return {left:l, top:t};
        }
      },
      watch: {
        modal(){
          this.imgVal=this.modal[this.cell.id];
          if(this.imgVal == ''){
            this.canvas_isimg=false;
          }
        } 
      },
    }
</script>

<style scoped lang="scss"> 
  canvas{
    border: 1px solid red;
  } 
  .canvas{
    max-width: 70%;
    text-align: center;

  }
  .img{ 
    border: 1px solid red;
    height: 30px; 
    width: 100%;
    // margin-left: 20%;
  }
  .show_img{
    border: 1px solid red;
    width: 100%;
    height: 100%;
  }
  .canvas-dialog{ 
    .md-dialog{
      max-width: 100%
    }
  }
</style> 