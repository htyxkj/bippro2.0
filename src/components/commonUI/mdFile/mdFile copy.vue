<template>
  <div class="md-file" @click="openPicker">
    <md-input
      readonly
      v-model="filename"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled"  
      ref="textInput">
    </md-input>

    <md-icon>attach_file</md-icon> 
    <!-- <template v-if="fj_type =='camera'">
      <template v-if="systemVersion =='Android' ||  systemVersion=='PC'">
        <div class="vd" id="android_video_div" v-if="showVideo" > 
          <video id="video" autoplay playsinline></video>
          <canvas id="canvas" width="480" height="320"></canvas>
          <md-button @click.native="shooting()"  >ff</md-button>
        </div>
      </template>
      <template v-else>
        <input type="file" :id="id" :name="name" :disabled="disabled" :multiple="multiple" :accept="accept" @change="onFileSelected" ref="fileInput" capture="camera"> 
      </template>
    </template>
    <template v-else> -->
      <input type="file" :id="id" :name="name" :disabled="disabled" :multiple="multiple" :accept="accept" @change="onFileSelected" ref="fileInput"> 
    <!-- </template> -->
  </div>
</template>

<script>
  import getClosestVueParent from '../../core/utils/getClosestVueParent';
  import camera from './camera.js';
  export default {
    mixins:[camera],
    props: {
      value: String,
      id: String,
      name: String,
      disabled: Boolean,
      required: Boolean,
      placeholder: String,
      accept: String,
      multiple: Boolean,
      fj_type:String,
    },
    data() {
      return {
        filename: this.value,
        systemVersion:'',
        deviceId:'',
        currentStream:null,
        showVideo:false,
        video:null,
      };
    },
    watch: {
      value() {
        this.filename = this.value;
        if(this.value==null){
          var file = document.getElementById(this.id);
          file.value = '';
        }
      }
    },
    methods: {
      getMultipleName(files) { 
        let names = []; 
        [...files].forEach((file) => {
          names.push(file.name);
        }); 
        return names.join(', ');
      },
      openPicker() {  
        if (!this.disabled) {
          if(this.$refs.fileInput)
          this.$refs.fileInput.click();
          this.$refs.textInput.$el.focus();
          this.showVideo=true;
          // setTimeout(() => {
          //   this.createCamera();            
          // }, 200);
        }
      },
      onFileSelected($event) {  
        let newFiles = [];
        const files = $event.target.files || $event.dataTransfer.files;

        if (files) {
          if (files.length > 1) {
            this.filename = this.getMultipleName(files);
          } else if (files.length === 1) {
            // this.filename = files[0].name ;

            let newD = new Date().getTime(); 
              for(var i=0;i<files.length;i++){
                let fileD = new Date(files[i].lastModifiedDate).getTime(); 
                if(newD-fileD<=10000){ 
                  this.filename = newD+'_'+files[i].name ;
                  files[i].newName = this.filename;
                  var file = new File([files[i]], this.filename , {type: files[i].type});
                  newFiles.push(file);
                }else{
                  newFiles.push(files[i]);
                }
              }
          } else {
            this.filename = null;
          }
        } else {
          this.filename = $event.target.value.split('\\').pop();
        }
        this.$emit('selected',newFiles);
        // this.$emit('selected', files || $event.target.value);
        this.$emit('input', this.filename);
        // var test = this.$refs.fileInput
        // test.value = ''; 	
      },
      brover() {
        var browser = {
          versions: function () {
            var u = navigator.userAgent
            var app = navigator.appVersion
            return {         //移动终端浏览器版本信息
              trident: u.indexOf('Trident') > -1, //IE内核
              presto: u.indexOf('Presto') > -1, //opera内核
              webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
              gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
              mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
              ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
              android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
              iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
              iPad: u.indexOf('iPad') > -1, //是否iPad
              webApp: u.indexOf('Safari') == -1//是否web应该程序，没有头部与底部
            }
          }(),
          language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
        if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
          var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
          if (ua.match(/MicroMessenger/i) === "micromessenger") {
            //判断是否在微信打开
            this.systemVersion = "wechat"; 
            if (browser.versions.android) {
              this.systemVersion = "wehatAndroid";//安卓端微信 
            } else if (browser.versions.ios) {
              this.systemVersion = "wechatIOS";//ios端微信 
            }
            // 判断是ios还是安卓
          } else if (browser.versions.android) {
            this.systemVersion = "Android";//安卓
          } else if (browser.versions.ios) {
            this.systemVersion = "ios";//ios
          } else {
            this.systemVersion = "wp";//WP
          }
        } else {
          this.systemVersion = "PC";//PC
        }
      },
      //创建安卓相机，只能拍照不能选择文件或相册中照片
      async createCamera(){
        if(this.fj_type == 'camera'  ){ //  && this.systemVersion =='Android'
          // var box=document.getElementById("android_video_div");  
          // var newNode=box.cloneNode(true); 
          // box.remove()
          // var body = document.body; 
          // body.insertBefore(newNode,body.firstChild);  

          await navigator.mediaDevices.enumerateDevices().then(this.gotDevices); 
          if (typeof this.currentStream !== 'undefined' && this.currentStream !=null) {
            this.stopMediaTracks(this.currentStream);
          }
          const videoConstraints = {}; 
          videoConstraints.deviceId = { exact: this.deviceId }; 
          const constraints = {
            video: videoConstraints,
            audio: false, 
          }; 
          this.video = document.getElementById('video');
          navigator.mediaDevices
            .getUserMedia(constraints)
            .then(stream => { 
              this.currentStream = stream;
              this.video.srcObject = stream; 
            })
            .then().catch(error => { 
              alert("调用相机出现问题！");
              console.error(error);
            });
        }
      },
      gotDevices(mediaDevices) {  
        let cc = 0;
        mediaDevices.forEach(mediaDevice => {
          if (mediaDevice.kind === 'videoinput') { 
            if(cc ==1)
              this.deviceId =  mediaDevice.deviceId;
            cc++ 
          }
        });
      },
      stopMediaTracks(stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      },
      shooting(){
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        context.drawImage(this.video,0,0);
      }
    },
    mounted() { 
      // this.brover(); 
      this.parentContainer = getClosestVueParent(this.$parent, 'md-input-container'); 
      if (!this.parentContainer) {
        this.$destroy(); 
        throw new Error('You should wrap the md-file in a md-input-container');
      }

      this.parentContainer.hasFile = true;
    },
    beforeDestroy() {
      this.parentContainer.hasFile = false;
    }
  };
</script>
<style scoped>
.vd{
  float: left;
  height: 100%;
  width: 100%;
  /* border: 1px red solid; */
  background-color: black;
  z-index: 999999;
  position: absolute;
}
video {
  width: 100%;
  height: 100%;
  min-height: 100%;
  /* display: block; */
  margin: 0 0;
  padding: 0 0 ;
}
</style>
