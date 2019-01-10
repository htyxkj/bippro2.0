<template>
  <div class="ueditor">
    <script :id=id type="text/plain" ></script>
  </div>
</template>
<script> 
import comm from './modal.js';
  export default {
    mixins:[comm],
    name: 'UE',
    data () {
      return {
        editor: null,
        toolbars:[['Paragraph','RowSpacing','FontFamily','FontSize']],
        config: {
            initialFrameWidth: '100%',
            initialFrameHeight: 230
        },
      }
    },
    props: { 
      id: {
        type: String
      },
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor(this.id, _this.config); // 初始化UE 
      this.editor.toolbars=this.toolbars;
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.modal[_this.cell.id]); // 确保UE加载完成后，放入内容。
      });
      this.editor.addListener('blur',function(editor){ _this.onBlur();});
      console.log("上传这堆错误不用理会，上传接口需自行开发配置");
      
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      },
      getUEContentTxt() { // 获取纯文本内容方法
        return this.editor.getContentTxt()
      },    
      onBlur(){ 
        this.modal[this.cell.id]=this.editor.getContent();
        if(this.oldValue != this.modal[this.cell.id]){
            var data = {};
            data.cellId = this.cell.id;
            data.value = this.editor.getContent();
            data.oldValue = this.oldValue;
            data.multiple = false;
            // this.oldValue = this.modal[this.cell.id];
            // console.log('datachange');
            this.$emit('change',data);
        }
     },
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
<style scoped>
.ueditor{
    z-index:1;
}
</style>

