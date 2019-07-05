<template>
  <div class="ueditor">
    <div class="title" v-if="!cell.unNull">{{cell.labelString}}</div>
    <div v-else class="title2">{{cell.labelString}}*</div>
    <div class="ueditor" :id="id" ></div>
  </div>
</template>
<script> 
//插件 API https://github.com/wangfupeng1988/wangEditor
import comm from './modal.js';
import axios from "axios";
  export default {
    mixins:[comm], 
    data () {
      return { 
        value:'',
        upLoadDid:"",
      }
    },
    props: { 
      id: {
        type: String
      },
    },
    mounted() {
      this.create();
    },
    methods: {
      create(){ 
        var _this = this;
        import('wangeditor').then((module) => {

        var E = module;//require('wangeditor');
        var editor = new E('#'+this.id) 
        // editor.customConfig.uploadImgShowBase64 = true;//以base64保存图片文件
        editor.customConfig.menus = [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'link',  // 插入链接
          'list',  // 列表
          'justify',  // 对齐方式
          'quote',  // 引用
          'emoticon',  // 表情
          'image',  // 插入图片
          'table',  // 表格
          // 'video',  // 插入视频
          // 'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ]
        //内容发生变化
        editor.customConfig.onchange = function (html) {
          // html 即编辑器中的内容 
          _this.saveValue(html);
        }
        editor.customConfig.customUploadImg = async function (files, insert) {
          // files 是 input 中选中的文件列表
          // insert 是获取图片 url 后，插入到编辑器的方法 上传代码返回结果之后，将图片插入到编辑器中
          let imgUrl = await _this.upLoadSliceF(files);
          insert(imgUrl)
        }

        editor.create();
        editor.txt.html(_this.modal[_this.cell.id]);
        });
      },
      
      saveValue(html){
        this.value=html;
        this.onBlur();
      },
      onBlur(){ 
        this.modal[this.cell.id]=this.value;
        if(this.oldValue != this.modal[this.cell.id]){
            var data = {};
            data.cellId = this.cell.id;
            data.value = this.value;
            data.oldValue = this.oldValue;
            data.multiple = false; 
            this.$emit('change',data);
        }
      },
      async upLoadSliceF(arg,_idx){ 
        let imgUrl = "";
        let dfconfig = {
          headers: {
          'Content-Type': 'multipart/form-data'
          },
          params:{
            snkey:JSON.parse(window.sessionStorage.getItem('snkey')),
          }
        };
        var file = arg[0],name = file.name,size = file.size;
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
          await axios.post(url,form,config).then((res)=>{
            // console.log(res);
            if(res.data.id==-1){ 
              this.$notify.danger({ content: "图片上传失败！", placement: "mid-center" }); 
            }else{
              succeed++;
              var pro = res.data.data.pros;
              var id = res.data.data.fid;
              // this.setProgress(id,pro);
              if(res.data.id==0){  
                this.upLoadDid = res.data.data.fj_root;
                var name = res.data.data.fname;
                var snkey = JSON.parse(window.sessionStorage.getItem('snkey'));
                var fjroot = this.upLoadDid;
                var updid =  global.APIID_FILEDOWN;
                imgUrl = global.BIPAPIURL+global.API_UPD+'?snkey='+snkey+'&fjroot='+fjroot+'&updid='+updid+'&fjname='+name;
                return imgUrl;
              }
            }
          });
        }
        return imgUrl;
      },
    },
    destroyed() {
      // this.editor.destroy();
    }
  }
</script>
<style scoped>
.ueditor{
    z-index:1;
    width:100%
}
.title{
  font-weight: 700;
  font-size: .16rem;
  color: #777777;
}
.title2{
  font-weight: 700;
  font-size: .16rem;
  color: rgba(179, 1, 19, 0.81);
}
</style>

