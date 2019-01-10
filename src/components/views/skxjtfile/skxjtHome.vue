<template> 
  <div class="body">


    <md-layout md-gutter>
      <md-layout md-column md-gutter>
        <md-layout md-flex="20" class="title">文书档案：</md-layout>
        <md-layout></md-layout>
      </md-layout>
      <md-layout md-column md-gutter class="img"><!-- v-on:click="open(url[0])" -->
        <md-layout md-flex="100"><img src="../../../img/skxjtfile/home/1.png" /></md-layout>  
      </md-layout>
      <md-layout md-column md-gutter class="img"><!-- v-on:click="open(url[1])" -->
        <md-layout md-flex="100"><img src="../../../img/skxjtfile/home/2.png"/></md-layout> 
      </md-layout> 
    </md-layout>


    <md-layout md-gutter>
      <md-layout md-column md-gutter>
        <md-layout md-flex="20" class="title">科技档案：</md-layout>
        <md-layout></md-layout>
      </md-layout>
      <md-layout md-column md-gutter class="img">
        <md-layout md-flex="100"><img src="../../../img/skxjtfile/home/3.png" v-on:click="open(url[2])" /></md-layout>  
      </md-layout>
      <md-layout md-column md-gutter class="img">
        <md-layout md-flex="100"><img src="../../../img/skxjtfile/home/4.png" v-on:click="open(url[3])" /></md-layout> 
      </md-layout> 
      <md-layout md-column md-gutter class="img">
        <md-layout md-flex="100"><img src="../../../img/skxjtfile/home/5.png" v-on:click="open(url[4])" /></md-layout>  
      </md-layout>
      <md-layout md-column md-gutter class="img">
        <md-layout md-flex="100"><img src="../../../img/skxjtfile/home/6.png" v-on:click="open(url[5])" /></md-layout> 
      </md-layout> 
      <md-layout md-column md-gutter class="img">
        <md-layout md-flex="100"><img src="../../../img/skxjtfile/home/7.png" v-on:click="open(url[6])" /></md-layout>  
      </md-layout> 
    </md-layout>


    <md-layout md-gutter>
      <md-layout md-column md-gutter>
        <md-layout md-flex="20" class="title">实物档案：</md-layout>
        <md-layout></md-layout>
      </md-layout> 
      <md-layout md-column md-gutter class="img">
        <md-layout md-flex="100"><img src="../../../img/skxjtfile/home/8.png" v-on:click="open(url[7])"/></md-layout>  
      </md-layout> 
    </md-layout>


    <md-layout md-gutter>
      <md-layout md-column md-gutter>
        <md-layout md-flex="20" class="title">图书资料：</md-layout>
        <md-layout></md-layout>
      </md-layout>

      <md-layout md-column md-gutter class="img">
        <md-layout md-flex="100"><img src="../../../img/skxjtfile/home/9.png" v-on:click="open(url[8])" /></md-layout>  
      </md-layout>
      <md-layout md-column md-gutter class="img">
        <md-layout md-flex="100"><img src="../../../img/skxjtfile/home/10.png" v-on:click="open(url[9])" /></md-layout> 
      </md-layout> 
      <md-layout md-column md-gutter class="img">
        <md-layout md-flex="100"><img src="../../../img/skxjtfile/home/11.png" v-on:click="open(url[10])" /></md-layout> 
      </md-layout> 
    </md-layout>

  </div>
</template>
<script> 

export default {
  data() {
    return {
       url:[
         'layoutui?pbuid=2333&pmenuid=2333&title=文书案卷检索',
         'layoutui?pbuid=2336&pmenuid=2336&title=文书卷内检索',
         'layoutui?pbuid=2315&pmenuid=2315&title=基建档案检索',
         'layoutui?pbuid=2318&pmenuid=2318&title=设备档案检索',
         'layoutui?pbuid=2321&pmenuid=2321&title=科研档案检索',
         'layoutui?pbuid=2324&pmenuid=2324&title=试验档案检索',
         'layoutui?pbuid=2340&pmenuid=2340&title=科档卷内检索',
         'layoutui?pbuid=2327&pmenuid=2327&title=实物档案检索',
         'layoutui?pbuid=2308&pmenuid=2308&title=图书案卷检索',
         'layoutui?pbuid=2311&pmenuid=2311&title=标准案卷检索',
         'layoutui?pbuid=2330&pmenuid=2330&title=资料档案检索'
       ],
    }
  },
  created(){
     
  },
  methods: {
    async open(url){ 
       await this.$router.push(`/`+url+`&othersys=1`) 
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 16px;
  font-weight: bold;
}
.body{
  padding-left: .5rem;
  padding-top: .5rem;
}
.img{
  padding-left: 15px;
  height: 100px;
}

</style>
