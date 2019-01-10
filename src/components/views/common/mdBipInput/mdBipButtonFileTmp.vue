<template>
    <md-input-container>
    <md-dialog md-open-from="#upfile" md-close-to="#upfile" ref="fDia">
    <div :class="ISPC()?classA:classB">
    <md-dialog-content class="contentC">  
        <!-- content -->
        <md-layout :class="ISPC()?imgClassA:imgClassB">
            <!-- row -->
        <md-layout md-gutter="8" v-for="(file,index) in srcs" :key="index" class="itemClass">
            <!-- 编号 -->
            <md-layout md-column md-gutter class="colClass" md-flex="5" md-flex-xsmall="10" md-flex-small="10">
                <md-layout>
                    {{index+1}}.
                </md-layout>
            </md-layout>
            <!-- 1 -->
            <md-layout md-column md-gutter class="colClass" md-flex="10" md-hide-small md-hide-xsmall >
              <md-layout><md-image :md-src="file.src"></md-image></md-layout>
            </md-layout>
            <!-- 2 -->
            <md-layout md-column md-gutter md-flex="50" md-flex-xsmall="45" md-flex-small="45" md-flex-medium="50">
                <md-layout md-flex="25">
                     <md-layout md-column md-gutter md-flex="60" md-flex-xsmall="100" md-flex-small="100">
                      <span class="md-subheading">{{file.name}}</span>
                      <md-tooltip v-if="selFiles">{{selFiles[index].name}}</md-tooltip>
                    </md-layout>
                    <md-layout md-column md-gutter md-flex="20" md-flex-offset="20" md-hide-small md-hide-xsmall>
                        <span class="md-subheading">{{file.size}}</span>
                    </md-layout>
                </md-layout>
                <md-layout>
                    <md-layout md-flex="80" md-column md-gutter md-flex-xsmall="100" md-flex-small="100">
                      <md-progress :md-progress="progress[index]"></md-progress>
                    </md-layout>
                    <md-layout md-column md-gutter md-flex="20" md-flex-offset="20" md-hide-small md-hide-xsmall>
                      <md-button v-if="!(progress[index]==100)" class="md-accent md-icon-button md-dense cancelClass" @click="delImg(index)">
                        <md-icon>cancel</md-icon>
                      </md-button>
                      <md-icon v-else class="iconClass">check_circle</md-icon>
                    </md-layout>
                </md-layout>
            </md-layout> 
            <!-- 4 -->
            <md-layout md-column md-gutter md-flex="10">
              <md-layout>
                    <md-button class="md-primary md-raised mybtn" @click="download(index)" :disabled="!(progress[index]==100)">下载</md-button>
                </md-layout>
            </md-layout>
        </md-layout>
        </md-layout>
    </md-dialog-content>
    <md-dialog-actions class="actionC">   
      <md-button class="md-raised" @click="closeDialog('fDia')">取消</md-button>
    </md-dialog-actions>
    </div>
    </md-dialog>
      <md-input :placeholder="cell.labelString" readonly v-model="modal[cell.id]"></md-input>
      <md-button class="md-icon-button md-clear-input" id="upfile" @click="openDialog()">
        <md-icon>cloud_download</md-icon>
        <md-tooltip md-direction="left">附件下载</md-tooltip>
      </md-button>
    </md-input-container>
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
      accept: "*",
      myFiles: [],
      selFiles: [],
      id: "fileup",
      srcs: [],
      classA: "classA",
      classB: "classB",
      imgClassA: "imgClassA",
			imgClassB: "imgClassB",
      progress:[0],
      btndis:true,
      bfjRoot:false,
      upLoadFils:[],
      upLoadDid:''
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
    //清空列表
    clear() {
      this.myFiles = [];
      this.selFiles = []; 
      this.placeholder = null;
			this.srcs = [];
      this.progress = [];
      this.upLoadFils = []; 
    },
    delImg(index) {
      console.log(this.selFiles);
      this.srcs.splice(index, 1);
			this.selFiles.splice(index, 1);
			this.progress.splice(index, 1);
      this.num = this.selFiles.length;
      if (this.selFiles.length == 0) {
        this.clear();
      } else {
        this.placeholder = this.selFiles[this.selFiles.length - 1][0].name;
      }
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

<style scoped>
/* .md-layout{margin:0;} */
.md-button.md-icon-button{height: 0;}
.md-dialog-content:first-child{padding-top: 0;}
.md-input-container input{font-weight: 700;}
.classA{min-height:5rem;max-width:6rem;max-height: 5rem;min-width:6rem;}

.actionC{position: absolute;bottom:.1rem;right: .1rem}
.contentC{margin-bottom: .7rem;padding-bottom: 0;}
.myimg{position: relative;width:10% !important;height: 10% !important;}
.imgClassA{overflow-y: auto;max-height: 3rem;overflow-x:hidden; }
@media screen and (min-width:300px) and (max-width:321px){
    .classB{min-height:5rem;max-height: 5rem;}
    .imgClassB{
        overflow-y: auto;max-height: 2.3rem;overflow-x: hidden;
    }
}
@media screen and (min-width:321px) and (max-width:361px){
    .classB{min-height:5rem;max-height: 5rem;}
    .imgClassB{
        overflow-y: auto;max-height: 2.8rem;overflow-x: hidden;
    }
}
@media screen and (min-width:362px) and (max-width:380px){
    .classB{min-height:5rem;max-height: 5rem;}
    .imgClassB{
        overflow-y: auto;max-height: 3.3rem;overflow-x: hidden;
    }
}
@media screen and (min-width:381px) and (max-width:412px){
    .classB{min-height:6rem;max-height: 6rem;}
    .imgClassB{
        overflow-y: auto;max-height: 3.8rem;overflow-x: hidden;
    }
}
@media screen and (min-width:413px){
    .classB{min-height:6rem;max-height: 6rem;}
    .imgClassB{
        overflow-y: auto;max-height: 4rem;overflow-x: hidden;
    }
}
.iClass{max-height: 1rem !important;min-height: 1rem !important;max-width: 1.1rem !important;}
.itemClass{max-height: .6rem;position: relative;width: 100%;margin-top: .4rem}
.iconClass{padding-bottom: .2rem;color:#22bf22; }
/* .cancelClass{margin:0;padding: 0;min-width: .24rem;min-height: .24rem;} */
.mybtn{min-width: .4rem;min-height: .3rem;font-size: .12rem;line-height: .3rem;padding: 0;}
.md-gutter-8 .md-column > .md-layout{padding-bottom: 0;}
.cancelClass{position: absolute;bottom: .15rem;margin-left: .18rem;}
.checkClass{position: absolute;bottom: .15rem;margin-left: .18rem;color:#22bf22;}
.colClass{max-height: .6rem;line-height: .5rem;}
/* .md-input{width: auto;} */
</style>



