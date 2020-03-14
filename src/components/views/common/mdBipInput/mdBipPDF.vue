<template>
  <md-dialog ref="PDFdialog" class="md-refs-dialog">
      <md-toolbar> 
        <md-layout md-gutter md-flex="100" md-row>
          <md-layout md-flex-xsmall="90" :md-flex="true" style=" margin-top: .12rem;">
            <h1 class="md-title">{{title}}</h1> 
          </md-layout>
          <md-layout md-flex-xsmall="0" :md-flex="true">
          </md-layout>
          <md-layout md-flex-xsmall="10" md-flex-small="10" md-flex-medium="10" md-flex-large="10" >
            <md-button class="md-icon-button" @click.native="close()">
              <md-icon>close</md-icon>
            </md-button>   
          </md-layout>
        </md-layout> 
      </md-toolbar>
      <md-dialog-content class="no-padding">
        <iframe style="width:100%;height:100%" :src="src"></iframe>
      </md-dialog-content>
      <md-dialog-actions> 
        <span class="flex"></span>
        <md-button class="md-accent md-raised" @click.native="close()">确定</md-button> 
      </md-dialog-actions>
    </md-dialog>
</template>

<script>
export default {
  components:{
  }, 
  data(){
    return{
      src:"",
      title:"",
    } 
  },
  mounted(){
    // this.doQuery();
  },
  methods:{
    async open(src,title){ 
      src = encodeURIComponent(src);
      src = global.BIPAPIURL+"/pdf/web/viewer.html?file="+src
      this.src = src;
      this.title = title;
      this.$refs['PDFdialog'].open() 
    },
    close(){ 
      this.$refs['PDFdialog'].close();
    }, 
  },
  watch:{ 
  },
 
};
</script>
<style scoped>
.my-search{
  padding: 0px;
  margin: 0px;
  border-bottom: 1px solid #ffffff;
  margin-bottom: 5px;
  padding-left: 10px;
}
</style>