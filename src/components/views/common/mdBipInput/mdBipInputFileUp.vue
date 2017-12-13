<template>
    <md-input-container>
    <md-dialog md-open-from="#upfile" md-close-to="#upfile" ref="fDia">
    <div :class="ISPC()?classA:classB">
    <md-dialog-content class="contentC">
        <md-input-container>
        <md-file v-model="placeholder" :id="id" placeholder="选择文件" :accept="accept"  @selected="selectFile" ref="file" multiple></md-file>
        </md-input-container>
        <div v-if="selFile">已选择{{num}}个文件</div>
        <div v-else>可以上传图片或者文件</div>
        <md-layout md-gutter="8" v-for="(file,index) in srcs" :key="index" class="itemClass">
            <!-- 1 -->
            <md-layout md-column md-gutter class="colClass" md-flex="10">
                <md-layout><md-image :md-src="file.src"></md-image></md-layout>
            </md-layout>
            <!-- 2 -->
            <md-layout md-column md-gutter md-flex="70" md-flex-xsmall="50" md-flex-small="50" md-flex-medium="70">
                <md-layout md-flex="25">
                    <md-layout md-column md-gutter md-flex="65">
                        <span class="md-subheading">{{file.name}}</span>
                        <md-tooltip v-if="selFiles">{{selFiles[index].name}}</md-tooltip>
                    </md-layout>
                    <md-layout md-column md-gutter md-flex="15" md-flex-offset="15">
                        <span class="md-subheading">{{file.size}}</span>
                    </md-layout>
                </md-layout>
                <md-layout>
                    <md-layout md-flex="80" md-column md-gutter>
                        <md-progress :md-progress="progress[index]"></md-progress>
                    </md-layout>
                    <md-layout md-column md-gutter md-flex="20" md-flex-offset="20">
                        <md-button v-if="!(progress[index]==100)" class="md-accent md-icon-button md-dense cancelClass" @click="delImg(index)">
                            <md-icon>cancel</md-icon>
                        </md-button>
                        <md-icon v-else class="iconClass">check_circle</md-icon>
                    </md-layout>
                </md-layout>
            </md-layout>
            <!-- 3 -->
            <md-layout md-column md-gutter md-flex="10">
                <md-layout>
                    <md-button class="md-primary md-raised mybtn" @click="download" :disabled="!(progress[index]==100)">下载</md-button>
                </md-layout>
            </md-layout>
            <!-- 4 -->
            <md-layout md-column md-gutter md-flex="10">
                <md-layout>
                    <md-button class="md-primary md-raised mybtn" @click="view" :disabled="!(progress[index]==100)">预览</md-button>
                </md-layout>
            </md-layout>
        </md-layout>
    </md-dialog-content>
    <md-dialog-actions class="actionC">
         <md-button class="md-primary md-raised" @click="save" :disabled="btndis">上传文件</md-button>
        <md-button class="md-accent md-raised" @click="clear()" :disabled="btndis">清空列表</md-button>
        <md-button class="md-raised" @click="closeDialog('fDia')">取消</md-button>
    </md-dialog-actions>
    </div>
    </md-dialog>
      <md-input :placeholder="upmsg" readonly></md-input>
      <md-button class="md-icon-button md-clear-input" id="upfile" @click="openDialog()"><md-icon>insert_drive_file</md-icon></md-button>
    </md-input-container>
</template>

<script>
import axios from "axios";
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
    };
  },
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
    download(){
    },
    //预览文件
    view(){

    },
    //清空列表
    clear() {
      this.myFiles = [];
      this.selFiles = [];
      this.selFile = false;
      this.placeholder = null;
			this.srcs = [];
      this.progress = [];      
    },
    getSize(size) {
      size =
        size > 1024
          ? size / 1024 > 1024
            ? size / (1024 * 1024) > 1024
              ? (size / (1024 * 1024 * 1024)).toFixed(2) + "GB"
              : (size / (1024 * 1024)).toFixed(2) + "MB"
            : (size / 1024).toFixed(2) + "KB"
          : size.toFixed(2) + "B";
      return size;
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
        if(name.substring(0,name.lastIndexOf('.')).length>4){
            name = name.substring(0,3)+'...'+name.substring(name.lastIndexOf('.')+1)
        }
        this.selFiles.push(file);
        if (!(/^image\/.*$/i.test(file.type))) {  
            var kzm = name.substring(name.lastIndexOf('.')+1);
            var _srcs = {};
            if(kzm=='doc' || kzm =='docx'){
                _srcs = {'src':require('@/components/../img/uploadImg/word.png'),'name':name};
            }else if(kzm=='xls' || kzm=='xlsx'){
                _srcs = {'src':require('@/components/../img/uploadImg/excel.png'),'name':name};
            }else if(kzm == 'pdf'){
                _srcs = {'src':require('@/components/../img/uploadImg/pdf.png'),'name':name};
            }else if(kzm == 'txt'){
                _srcs = {'src':require('@/components/../img/uploadImg/txt.png'),'name':name};
            }else if(kzm == 'zip' || kzm =='rar'){
                _srcs = {'src':require('@/components/../img/uploadImg/zip.png'),'name':name};
            }else if(kzm =='html'){
                _srcs = {'src':require('@/components/../img/uploadImg/html.png'),'name':name};
            }else if(kzm == 'ppt' || kzm=='pptx'){
                _srcs = {'src':require('@/components/../img/uploadImg/ppt.png'),'name':name};
            }else{
                _srcs = {'src':require('@/components/../img/uploadImg/noFound.png'),'name':name};
            }
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
        config.params.index = i;//当前是第几片
        config.params.fkey = fkey;//当前是第几片
        config.params.fid = _idx;//当前是第几片
        form.append("index", i);
        form.append("total",shardCount);
				form.append("data", file.slice(start,end));  //slice方法用于切出文件的一部分
        // this.upLoadSlice(form,config);
        axios.post(url,form,config).then((res)=>{
          console.log(res);
          if(res.data.id==-1){
            this.$notify.danger({ content: "上传失败！", placement: "mid-center" });
          }else{
            succeed++;
            var pro = res.data.data.pros;
            var id = res.data.data.fid;
            this.setProgress(id,pro);
            if(res.data.id==0){
              this.$notify.danger({ content: "上传完成！", placement: "mid-center" });
            }
          }
          console.log(res);
        });
        // console.log(i,'fdsfds');
      }
      
		},
		setProgress(index,data){
			this.$set(this.progress,index,data);
		},
    openDialog() {
      this.$refs.fDia.open();
    },
    closeDialog() {
      this.$refs.fDia.close();
    }
  }
};
</script>

<style scoped>
/* .md-layout{margin:0;} */
.md-button.md-icon-button{height: 0;}
.md-dialog-content:first-child{padding-top: 0;}
.md-input-container input{font-weight: 700;}
.classA{min-height:2.1rem;max-width:6rem;max-height: 5rem;min-width:6rem;}
.classB{min-height:2.5rem;max-width:6rem;max-height: 6rem;}
.actionC{position: absolute;bottom:.1rem;right: .1rem}
.contentC{margin-bottom: .7rem;padding-bottom: 0;}
.myimg{position: relative;width:10% !important;height: 10% !important;}
.imgClassA{overflow: auto;max-height: 3rem;}
.imgClassB{overflow: auto;max-height: 2.5rem;}
.iClass{max-height: 1rem !important;min-height: 1rem !important;max-width: 1.1rem !important;}
/* .cancelClass{margin:0;padding: 0;min-width: .24rem;min-height: .24rem;position: absolute;right: .1rem;} */
/* .myicon{margin:0;position: absolute;right: .1rem;bottom:.15rem;color:#22bf22;} */

.itemClass{max-height: .6rem;position: relative;}
.iconClass{padding-bottom: .2rem;color:#22bf22; }
/* .cancelClass{margin:0;padding: 0;min-width: .24rem;min-height: .24rem;} */
.mybtn{min-width: .4rem;min-height: .3rem;font-size: .12rem;line-height: .3rem;padding: 0;}
.md-gutter-8 .md-column > .md-layout{padding-bottom: 0;}
.cancelClass{position: absolute;bottom: .15rem;margin-left: .2rem;}
/* .colClass{max-width: .5rem;} */
</style>



