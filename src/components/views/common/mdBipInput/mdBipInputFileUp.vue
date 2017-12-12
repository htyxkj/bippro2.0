<template>
    <md-input-container>
    <md-dialog md-open-from="#upfile" md-close-to="#upfile" ref="fDia">
    <div :class="ISPC()?classA:classB">
    <md-dialog-content class="contentC">
        <md-input-container>
        <md-file v-model="placeholder" :id="id" placeholder="选择文件" :accept="accept"  @selected="selectFile" ref="file"></md-file>
        </md-input-container>
        <div v-if="selFile">已选择{{num}}个文件</div>
        <div v-else>可以上传图片或者文件，总大小不能超过5M</div>
        <md-layout md-gutter="8" :class="ISPC()?imgClassA:imgClassB">
            <md-layout md-flex-xsmall="50" md-flex-small="33" md-flex-medium="25" md-flex-large="25" v-for="(file,index) in srcs" :key="index" md-column class="myimg">
                <md-layout class="iClass">
                    <md-image :md-src="file.src"></md-image>
                </md-layout>
                <md-layout>
                   <span class="md-subheading">{{file.name}}</span>
                   <md-button class="md-accent cancelClass" @click="delImg(index)"><md-icon>cancel</md-icon></md-button>
                </md-layout>
            </md-layout>
        </md-layout>
    </md-dialog-content>
    <md-dialog-actions class="actionC">
         <md-button class="md-primary md-raised" @click="save">上传文件</md-button>
        <md-button class="md-accent md-raised" @click="clear()">清空列表</md-button>
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
      imgClassB: "imgClassB"
    };
  },
  methods: {
    //清空列表
    clear() {
      this.myFiles = [];
      this.selFiles = [];
      this.selFile = false;
      this.placeholder = null;
      this.srcs = [];
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
      this.num = this.selFiles.length;
      if (this.selFiles.length == 0) {
        this.clear();
      } else {
        this.placeholder = this.selFiles[this.selFiles.length - 1][0].name;
      }
    },
    selectFile(e) {
      for (var i = 0; i < e.target.files.length; i++) {
        var file = e.target.files.item(i);
				var name = file.name;
				var index = _.findIndex(this.selFiles, fs =>{
					// console.log(fs,file);
					return fs.name == name;
				});
				if(index===-1){
					this.selFiles.push(file);
				}else{
					this.$notify.danger({content: '不要选择重复的文件!', placement: "mid-center" });
					return ;
				}
        if (name.substring(0, name.lastIndexOf(".")).length > 4) {
          name =
            name.substring(0, 3) +
            "..." +
            name.substring(name.lastIndexOf(".") + 1);
        }
        if (!/^image\/.*$/i.test(file.type)) {
          var kzm = name.substring(name.lastIndexOf(".") + 1);
          var _srcs = {};
          if (kzm == "doc" || kzm == "docx") {
            _srcs = {
              src: require("@/components/../img/uploadImg/word.png"),
              name: name
            };
          } else if (kzm == "xls" || kzm == "xlsx") {
            _srcs = {
              src: require("@/components/../img/uploadImg/excel.png"),
              name: name
            };
          } else if (kzm == "pdf") {
            _srcs = {
              src: require("@/components/../img/uploadImg/pdf.png"),
              name: name
            };
          } else if (kzm == "txt") {
            _srcs = {
              src: require("@/components/../img/uploadImg/txt.png"),
              name: name
            };
          } else if (kzm == "zip" || kzm == "rar") {
            _srcs = {
              src: require("@/components/../img/uploadImg/zip.png"),
              name: name
            };
          } else if (kzm == "html") {
            _srcs = {
              src: require("@/components/../img/uploadImg/html.png"),
              name: name
            };
          } else if (kzm == "ppt" || kzm == "pptx") {
            _srcs = {
              src: require("@/components/../img/uploadImg/ppt.png"),
              name: name
            };
          } else {
            _srcs = {
              src: require("@/components/../img/uploadImg/noFound.png"),
              name: name
            };
          }
          this.srcs.push(_srcs);
          continue; //不是图片 就跳出这一次循环
        }
        //实例化FileReader API
        var freader = new FileReader();
        freader.readAsDataURL(file);
        var that = this;

        freader.onload = function(e) {
          var _srcs = { src: e.target.result, name: name };
          that.srcs.push(_srcs);
        };
      }
    },
    async save() {
      //   var files = this.selFiles[0]
      if (this.selFiles.length < 1) {
        this.$notify.danger({ content: "请选择要上传的文件！" });
        this.clear();
        return;
      }
      var files = [];
      for (let i = 0; i < this.selFiles.length; i++) {
        files = this.selFiles[i];
        if (files.length < 1) {
          this.$notify.danger({ content: "请选择要上传的文件！" });
          this.clear();
          return;
        }

        var sumSize = 0;
        for (let i = 0; i < files.length; i++) {
          sumSize = sumSize + files[i].size;
          if (sumSize > 5 * 1024 * 1024) {
            this.$notify.danger({ content: "文件大小超过限制！" });
            return;
          }
        }
        var arg = {
          data: {}
        };
        for (let i = 0; i < files.length; i++) {
          arg.data["file-" + i] = files[i];
        }
        var res = await this.upLoad(arg);
        if(res.data.id==0){
					this.$notify.success({content: '上传成功！', placement: "mid-center" });
				}else{
					this.$notify.danger({content: '上传失败！', placement: "mid-center" });
				}
      }
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
.md-layout {
  margin: 0;
}
.md-button.md-icon-button {
  height: 0;
}
.md-dialog-content:first-child {
  padding-top: 0;
}
.md-input-container input {
  font-weight: 700;
}
.classA {
  min-height: 2.1rem;
  max-width: 6rem;
  max-height: 5rem;
  min-width: 6rem;
}
.classB {
  min-height: 2.5rem;
  max-width: 6rem;
  max-height: 6rem;
}
.actionC {
  position: absolute;
  bottom: 0.1rem;
  right: 0.1rem;
}
.contentC {
  margin-bottom: 0.7rem;
  padding-bottom: 0;
}
.myimg {
  position: relative;
  width: 50% !important;
  height: 50% !important;
}
.imgClassA {
  overflow: auto;
  max-height: 3rem;
}
.imgClassB {
  overflow: auto;
  max-height: 2.5rem;
}
.iClass {
  max-height: 1rem !important;
  min-height: 1rem !important;
  max-width: 1.1rem !important;
}
.cancelClass {
  margin: 0;
  padding: 0;
  min-width: 0.24rem;
  min-height: 0.24rem;
  position: absolute;
  right: 0.1rem;
}
.md-subheading {
  line-height: 0.38rem;
}
</style>



