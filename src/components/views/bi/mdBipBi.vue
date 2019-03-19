<template> 
  <div style="height:100%">
    <template v-if="pc" >
      <md-bip-pc-bi :mdTitle="mdTitle" :mparams="mparams" ></md-bip-pc-bi>
    </template>
    <template v-else >
      <md-bip-moblie-bi :mdTitle="mdTitle" :mparams="mparams" ></md-bip-moblie-bi>
    </template>
  </div>
</template> 
<script>
export default {
  props: ['mdTitle','mparams'],
  data(){
    return {
      pc: true,
    }
  },
  created(){  
    this.pc = this.ISPC();
  }
}
</script>