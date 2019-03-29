<template>
  <div>
    <md-dialog md-open-from="#upfile" md-close-to="#upfile" ref="fDia">  
      <md-dialog-title style="padding:0px;    margin: 0px;">
        <md-layout  md-align="end">
          <md-button class="md-icon-button md-clear-input" @click="closeDialog('fDia')">
            <md-icon>close</md-icon>
            <md-tooltip md-direction="left">关闭</md-tooltip>
          </md-button> 
        </md-layout>
      </md-dialog-title>
      <md-dialog-content :class="ISPC()?classA:classB">  
        <md-layout md-gutter="8" v-for="(file,index) in srcs" :key="index" style=" padding: 0 10px;" >
          <md-layout md-row md-gutter md-flex="10" class="md-vertical-align-center" style="    padding-top: 3px;">
            {{index+1}}.
          </md-layout>
          <md-layout md-row md-gutter md-flex="15" class="md-vertical-align-center">
            <md-image style="height:25px;width:25px;" :md-src="file.src" ></md-image>
          </md-layout>
          <md-layout md-row md-gutter md-flex="35" class="md-vertical-align-center" style="color:#999;padding-top: 3px;">
            {{file.name}}
            <md-tooltip v-if="selFiles"> {{selFiles[index].name}} </md-tooltip> 
          </md-layout>
          <!-- 3 --> 
          <md-layout  md-row md-gutter md-flex="40" class="md-vertical-align-center">
            <md-layout md-flex="60" class="md-align-end md-vertical-align-center" style="margin:0px;padding:0px;"> 
              <a @click="download(index)">
                <img style="width:30px;height:30px" :src="require('@/components/../img/uploadImg/download.png')"/>
              </a> 
            </md-layout>
            <md-layout md-flex="40" class="md-align-end md-vertical-align-center" style="margin:0px;padding:0px;">  
              <a @click="openImg(file.opensrc,file.qname)" v-if="file.img">
                <img style="width:30px;height:30px" :src="require('@/components/../img/uploadImg/open.png')"/>
              </a>
            </md-layout>
          </md-layout> 
        </md-layout> 
      </md-dialog-content> 
    </md-dialog>
    <md-dialog ref="dlgImg">  
      <md-dialog-title style="padding-top:.1rem;padding-right:.06rem">
        <md-layout  md-align="end" style="margin:0px">
          <md-button class="md-icon-button md-clear-input" @click="closeImgDialog('fDia')">
            <md-icon>close</md-icon>
          </md-button> 
        </md-layout>
        <md-layout style="margin:0px;word-break: break-word;">
          {{ dlgImgNAME }}
        </md-layout>
      </md-dialog-title> 
      <md-dialog-content>
        <viewer :images="imgs">
            <img v-for="src in imgs"  :src="src.url" :key="src.title">
        </viewer> 
      </md-dialog-content>  
    </md-dialog>  
    <div class="md-input-ref layout layout-row"> 
      <md-layout md-flex="95" class="margin0" style="min-height:24px">
        {{modal[cell.id]}}
      </md-layout>
      <md-layout md-flex="5" md-align-end class="margin0" style="min-height:24px">
        <md-button class="md-icon-button md-ref-filter " @click="openDialog()" style="margin:0px">
          <md-icon  style="margin:0px;;height:24px">cloud_download</md-icon>
          <md-tooltip md-direction="left">附件下载</md-tooltip>
        </md-button>
      </md-layout>
    </div>   
  </div>  
</template>

<script>
import axios from "axios";
import comm from './modal.js';


export default {
  data() {
    return {
      upmsg: "附件上传",
      placeholder: null,
      num: "",
      selFile: false,
      accept: "*",
      myFiles: [],
      selFiles: [],
      id: "fileup",
      srcs: [],
      classA: "classA",
      classB: "classB",
      imgClassA: "imgClassA", 
      progress:[0],
      btndis:true,
      bfjRoot:false,
      upLoadFils:[],
      upLoadDid:'',
      imgs:[],
      dlgImgNAME:'',
      isSave:false,//是否上传过
    };
  },
  mixins:[comm],
  watch:{
    'srcs':function(){
        if(this.srcs.length==0){
            this.btndis = true
        }else{
            this.btndis = false
        }
    }
  },
  methods: {
    //下载文件
    async download(index){
      // console.log(index,this.selFiles[index]);
      var name = this.selFiles[index].name;
      var snkey = JSON.parse(window.sessionStorage.getItem('snkey'));
      var fjroot = this.bfjRoot?this.modal.fj_root:'';
      var updid =  global.APIID_FILEDOWN;
     window.location.href = global.BIPAPIURL+global.API_UPD+'?snkey='+snkey+'&fjroot='+fjroot+'&updid='+updid+'&fjname='+name;
    }, 
    //图片预览
    openImg(fileUrl,fileName){ 
      this.dlgImgNAME=fileName;
      this.imgs=[];
      let img = {url:fileUrl,title:fileName}
      this.imgs.push(img);  
      this.$refs.dlgImg.open();
    }, 
    closeImgDialog(){
      this.$refs.dlgImg.close();
    },
    //清空列表
    clear() {  
      this.myFiles = [];
      this.selFiles = [];
      this.selFile = false;
      this.placeholder = null;
			this.srcs = [];
      this.progress = [];
      this.upLoadFils = []; 
    }, 
    selectFile(e){ 
      for (var i = 0; i < e.target.files.length; i++) {
        var file = e.target.files.item(i);  
        var name = e.target.files[i].name;
        var iid = _.findIndex(this.selFiles,(item)=>{
          return item.name === name;
        });
        if(iid>=0){
          return ;
        }
        var size = this.getSize(e.target.files[i].size)
        // if(name.substring(0,name.lastIndexOf('.')).length>4){
        //     name = name.substring(0,3)+'...'+name.substring(name.lastIndexOf('.')+1)
        // }
        this.selFiles.push(file);
        if (!(/^image\/.*$/i.test(file.type))) {  
            // var kzm = name.substring(name.lastIndexOf('.')+1);
            var _srcs = this.getFileIcon(name);
            _srcs.size = size;
            this.srcs.push(_srcs);
            continue; //不是图片 就跳出这一次循环  
        }  
        //实例化FileReader API  
        var freader = new FileReader();
        freader.readAsDataURL(file);
        var that = this;
        freader.onload = function(e) {
            var _srcs = {'src':e.target.result,'name':name,'size':size}
            that.srcs.push(_srcs)
        };
      }
    },  
		setProgress(index,data){
			this.$set(this.progress,index,data);
		},
    openDialog() {
      this.initFile();
      this.$refs.fDia.open();
    },
    closeDialog() {
      this.$refs.fDia.close();
    },
    async initFile(){
      this.clear();
      this.upLoadDid = this.bfjRoot?this.modal.fj_root:'';
      var vls = this.modal[this.cell.id];
      if(!vls)
        return ;
      var params = {
        snkey: JSON.parse(window.sessionStorage.getItem('snkey')),
        fjroot: this.upLoadDid,
        fjname: vls,
        updid: global.APIID_FILEINFO
      }; 
      var res = await this.getFileByAPINewSync(params);
      if(res.data.id==0){
        this.selFiles = res.data.data.files;
      }
      var fis = vls.split(';');
      _.forEach(fis,(name,index)=>{
        var _srcs = this.getFileIcon(name);  
        _srcs.size = this.getSize(this.selFiles[index].size);  

        _srcs.img = false;
        var kzm = name.substring(name.lastIndexOf('.')+1);
        if(kzm == 'jpg' || kzm == 'png' || kzm == 'gif' || kzm == 'jpeg'  ){
          var snkey = JSON.parse(window.sessionStorage.getItem('snkey'));
          var fjroot = this.bfjRoot?this.modal.fj_root:'';
          var updid =  global.APIID_FILEDOWN;
          _srcs.opensrc = global.BIPAPIURL+global.API_UPD+'?snkey='+snkey+'&fjroot='+fjroot+'&updid='+updid+'&fjname='+name;
          _srcs.img = true;
        }
        this.srcs.push(_srcs);
        this.upLoadFils.push(name);
        this.progress[index]=100;
      });
    }
  },
  mounted(){ 
    if(this.cell){
      if(this.cell.c_par){
        var ii = _.findIndex(this.cell.c_par.cels,item=>{
          return item.id === 'fj_root';
        }) 
        if(ii>=0){
          this.bfjRoot = true;
        }else{
          this.bfjRoot = false;
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
/* .md-layout{margin:0;} */
.md-button.md-icon-button{height: 0;}
.md-dialog-content:first-child{padding-top: 0;}
.md-dialog-content{    padding: 0 .1rem .24rem;}
.md-input-container input{font-weight: 700;}
.classA{max-width:7rem;min-width:6.5rem;min-height:4rem;padding-top: .2rem;}/**/
 
/* .actionC{position: absolute;bottom:.1rem;right: .1rem} */
.actionC{
  padding-bottom: 0.13rem; 
  .md-button{
    margin-left: .05rem;
    padding: 0px;
    margin-right: .01rem;
    min-width: .57rem;
  }
}

.contentC{margin-bottom: .7rem;padding-bottom: 0;}
.myimg{position: relative;width:10% !important;height: 10% !important;}
.imgClassA{overflow-y: auto;max-height: 4rem;overflow-x:hidden; }
@media screen and (min-width:300px) and (max-width:321px){
    .classB{max-height: 5rem;    min-width: 1rem;}
}
@media screen and (min-width:321px) and (max-width:361px){
    .classB{max-height: 5rem;     min-width: 1rem;}
}
@media screen and (min-width:362px) and (max-width:380px){
    .classB{max-height: 5rem;     min-width: 1rem;}
}
@media screen and (min-width:381px) and (max-width:412px){
    .classB{max-height: 6rem;     min-width: 1rem;}
}
@media screen and (min-width:413px){
    .classB{max-height: 6rem;    min-width: 1rem;}
}  
.iconClass{padding-bottom: .2rem;color:#22bf22; } 
.mybtn{min-width: .4rem;min-height: .3rem;font-size: .12rem;line-height: .3rem;padding: 0; margin: 0px}
.md-gutter-8 .md-column > .md-layout{padding-bottom: 0;}
.cancelClass{position: absolute;bottom: .15rem;margin-left: .18rem;} 
.colClass{max-height: .6rem;line-height: .5rem;font-size: 14px;} 
.margin0{
  margin: 0px;
}
</style>



