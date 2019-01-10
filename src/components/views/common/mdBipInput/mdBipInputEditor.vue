<template>
  <div class="ueditor" :id=id ></div>
</template>
<script> 
//插件 API https://github.com/wangfupeng1988/wangEditor
import comm from './modal.js';
  export default {
    mixins:[comm], 
    data () {
      return { 
        value:'',
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
        editor.customConfig.uploadImgShowBase64 = true;//以base64保存图片文件
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
        editor.create()  
        editor.txt.html(_this.modal[_this.cell.id])
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
</style>

