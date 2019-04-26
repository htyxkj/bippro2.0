<template>
    <md-input-container>
    <md-dialog md-open-from="#upfile" md-close-to="#upfile" ref="fDia"> 
      <md-dialog-title class="file_title"> 
          <md-input-container style="width:100%">
            <md-file v-model="placeholder" :id="id" placeholder="选择文件" :accept="accept"  @selected="selectFile" ref="file" multiple></md-file>
          </md-input-container>
          <div v-if="selFile">已选择{{num}}个文件</div>
          <div v-else>可以上传图片或者文件</div>
      </md-dialog-title>
      <!-- <div :class="ISPC()?classA:classB"> -->
      <md-dialog-content :class="ISPC()?classA:classB"> 
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
                  <md-layout><md-image style="height:100%" :md-src="file.src"></md-image></md-layout>
                </md-layout>
                <!-- 2 -->
                <md-layout md-column md-gutter md-flex="50" md-flex-xsmall="40" md-flex-small="45" md-flex-medium="50">
                    <md-layout md-flex="25">
                        <md-layout md-column md-gutter md-flex="60" md-flex-xsmall="100" md-flex-small="100">
                          <span class="md-subheading">{{file.name}}</span>
                          <md-tooltip v-if="selFiles"> {{selFiles[index].name}} 
                          </md-tooltip>
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
                <!-- 3 -->
                <md-layout md-column md-gutter md-flex="10" md-flex-xsmall="15" md-flex-small="15" md-align="center">
                  <md-button class="md-accent md-raised mybtn" @click="delFile(index)" :disabled="!(progress[index]==100)">删除</md-button>
                </md-layout>
                <!-- 4 -->
                <md-layout md-column md-gutter md-flex="10"  md-flex-xsmall="15" md-flex-small="15" md-align="center">
                  <md-button class="md-primary md-raised mybtn" @click="download(index)" :disabled="!(progress[index]==100)">下载</md-button>
                </md-layout>
                <!-- 5 --> 
                <md-layout md-column md-gutter md-flex="10" md-flex-xsmall="15" md-flex-small="15"  md-align="center" v-if="file.img ==true">
                  <md-button class="md-primary md-raised mybtn" @click="openImg(file.src,file.qname)" :disabled="!(progress[index]==100)">打开</md-button>
                </md-layout>
            </md-layout>
          </md-layout>
      </md-dialog-content>
      <md-dialog-actions class="actionC">
        <md-button class="md-primary md-raised" @click="ok()">确定</md-button>
        <md-button class="md-primary md-raised" @click="save" :disabled="btndis">上传文件</md-button>
        <md-button class="md-accent md-raised" @click="clear()" :disabled="btndis">清空列表</md-button>
        <md-button class="md-raised" @click="closeDialog('fDia')">取消</md-button>
      </md-dialog-actions>
      <!-- </div> -->
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
      <md-input readonly v-model="modal[cell.id]" :required="cell.isReq"></md-input> 
      <md-button class="md-icon-button md-ref-filter" id="upfile" @click="openDialog()">
        <md-icon>insert_drive_file</md-icon>
      </md-button>
    </div>

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
      selFile: false,
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
      upLoadDid:'', 
      dlgImgNAME:'',
      isSave:false,//是否上传过
      imgs:[],
      saveList:[],//上传过的文件下标
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
    //删除
    async delFile(index){
      var name = this.selFiles[index].name;
      let fjroot = '';
      if(this.bfjRoot){
        if(this.modal.fj_root){
          fjroot = this.modal.fj_root;
        }else{
          fjroot = this.upLoadDid;
        }
      }else{
        fjroot='';
      } 

      var params = {
        snkey: JSON.parse(window.sessionStorage.getItem('snkey')),
        fjroot: fjroot,
        fjname: name,
        updid: global.APIID_FILEDEL
      };
      var fl = this.selFiles[index];
      if(fl.size>0){
        var res = await this.getFileByAPINewSync(params);
        if(res.data.id==0){
          this.removeIndex(index);
        }
      }else{
        this.removeIndex(index);
      }
    },
    removeIndex(index){
      this.srcs.splice(index, 1);
      this.selFiles.splice(index, 1);
      this.progress.splice(index, 1);
      this.myFiles.splice(index, 1);
      this.upLoadFils.splice(index, 1);
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
    //确定完成输入
    ok(){
      var fjroot = this.upLoadDid;//附件地址
      var fjname = "";
      if(this.upLoadFils.length>0){
        _.forEach(this.upLoadFils,flv=>{
          if(this.bfjRoot){
            fjname+=flv+';';
          }else{
            fjname+=fjroot+'/'+flv+';'
          }
        });
        fjname = fjname.substring(0,fjname.length-1);
        // console.log(fjname);
        this.$set(this.modal,this.cell.id,fjname);
        this.$set(this.modal,'fj_root',fjroot);
      }else{
        this.$set(this.modal,this.cell.id,'');
        this.$set(this.modal,'fj_root','');
      }
      var sta = this.modal.sys_stated;
      sta = sta | 2;
      // console.log(sta,'state');
      this.$set(this.modal,'sys_stated',sta);
      this.$refs.fDia.close();
      this.isSave = false;
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
    save() { 
      if (this.selFiles.length < 1) {
        this.$notify.danger({ content: "请选择要上传的文件！" });
        this.clear();
        return;
      }
      //设置上传路径
      var fjroot = this.upLoadDid;//附件地址 
      this.$set(this.modal,'fj_root',fjroot);
      this.btndis = true;
      this.saveList = [];
      // var files = null;
      for (let i = 0; i < this.selFiles.length; i++) {
        if(this.progress[i]===100)
          continue;
        var file = this.selFiles[i];
        var arg = {
          data: {'file':file}
        };
        // console.log(arg,i);
				this.upLoadSliceF(arg,i);
      }
      if(this.selFiles.length ==0){
        this.btndis = false;
      }
      this.isSave=true;
		},
		upLoadSliceF(arg,_idx){ 
      let dfconfig = {
        headers: {
        'Content-Type': 'multipart/form-data'
        },
        params:{
					snkey:JSON.parse(window.sessionStorage.getItem('snkey')),
        }
      };
      var file = arg.data.file,name = file.name,size = file.size;
      var succeed = 0;
      var shardSize = 2 * 1024 * 1024,    //以2MB为一个分片
      shardCount = Math.ceil(size / shardSize);  //总片数
      var fkey = this.makePath();
      const url = global.BIPAPIURL+global.API_UPD;
      for(var i = 0;i < shardCount;i++){
        var start = i * shardSize,end = Math.min(size, start + shardSize);
        var form = new FormData();
        var config  = dfconfig;
        config.params.name = name;
        config.params.total = shardCount;//总片数
        config.params.fkey = fkey;//当前是第几片
        config.params.fid = _idx;//当前是第几片
        config.params.fjkey = this.cell.c_par.obj_id;
        config.params.updid = global.APIID_FILEUP;
        form.append("index", i);
        form.append("total",shardCount);
        form.append("fjroot",this.upLoadDid);
				form.append("data", file.slice(start,end));  //slice方法用于切出文件的一部分
        axios.post(url,form,config).then((res)=>{
          // console.log(res);
          if(res.data.id==-1){
            this.saveList.push(_idx);
            this.$notify.danger({ content: "上传失败！", placement: "mid-center" });
            this.btndis = false;
          }else{
            succeed++;
            var pro = res.data.data.pros;
            var id = res.data.data.fid;
            this.setProgress(id,pro);
            if(res.data.id==0){ 
              this.saveList.push(_idx); 
              if(this.saveList.length == this.selFiles.length){
                this.btndis = false;
              }
              this.$notify.success({ content: "上传完成！", placement: "mid-center" });
              this.upLoadFils[id] = res.data.data.fname;
              this.upLoadDid = res.data.data.fj_root;
            }
          }
        });
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
      if(!this.upLoadDid)
        this.upLoadDid=null;
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
          _srcs.src = global.BIPAPIURL+global.API_UPD+'?snkey='+snkey+'&fjroot='+fjroot+'&updid='+updid+'&fjname='+name;
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
.classA{max-width:7rem;min-width:6.5rem;min-height:4rem;}/**/
 
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
    .classB{min-height:2rem;max-height: 5rem;    min-width: 1rem;}
    .imgClassB{
        overflow-y: auto;overflow-x: hidden;
    }
}
@media screen and (min-width:321px) and (max-width:361px){
    .classB{min-height:2rem;max-height: 5rem;     min-width: 1rem;}
    .imgClassB{
        overflow-y: auto;overflow-x: hidden;
    }
}
@media screen and (min-width:362px) and (max-width:380px){
    .classB{min-height:2rem;max-height: 5rem;     min-width: 1rem;}
    .imgClassB{
        overflow-y: auto;overflow-x: hidden;
    }
}
@media screen and (min-width:381px) and (max-width:412px){
    .classB{min-height:2rem;max-height: 6rem;     min-width: 1rem;}
    .imgClassB{
        overflow-y: auto;overflow-x: hidden;
    }
}
@media screen and (min-width:413px){
    .classB{min-height:2rem;max-height: 6rem;    min-width: 1rem;}
    .imgClassB{
        overflow-y: auto;overflow-x: hidden;
    }
}
.iClass{max-height: 1rem !important;min-height: 1rem !important;max-width: 1.1rem !important;}
.itemClass{max-height: .6rem;position: relative;width: 100%;}
.iconClass{padding-bottom: .2rem;color:#22bf22; }
/* .cancelClass{margin:0;padding: 0;min-width: .24rem;min-height: .24rem;} */
.mybtn{min-width: .4rem;min-height: .3rem;font-size: .12rem;line-height: .3rem;padding: 0; margin: 0px}
.md-gutter-8 .md-column > .md-layout{padding-bottom: 0;}
.cancelClass{position: absolute;bottom: .15rem;margin-left: .18rem;}
.checkClass{position: absolute;bottom: .15rem;margin-left: .18rem;color:#22bf22;}
.colClass{max-height: .6rem;line-height: .5rem;}
.file_title{    margin-bottom: .02rem;padding: .1rem .1rem 0;    font-size: 14px;}
 
</style>



