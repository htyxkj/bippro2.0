<template>
<md-layout md-felx ="100" v-if="laycfg">
    <template v-if="cfgUp">
        <template v-if="!cfgUp.bcells">
            <bip-comm-lay :layout="cfgUp.comp" :dsm="dsm"></bip-comm-lay >
        </template>
        <template v-else> 
                <lay-cell :laycell="cfgUp.comp" :dsm="dsm"></lay-cell> 
        </template>
    </template>
    <template v-if="cfgDown">
        <template v-if="!cfgDown.bcells">
            <bip-comm-lay :layout="cfgDown.comp" :dsm="dsm"></bip-comm-lay >
        </template>
        <template v-else> 
            <lay-cell :laycell="cfgDown.comp" :dsm="dsm"></lay-cell> 
        </template>
    </template>
</md-layout>
    
</template>
<script> 
export default {
  data() {
    return {
        cfgUp:null,
        cfgDown:null,
    };
  },
  props: {laycfg:Array,dsm :Object},
  methods: { 
  },
  computed: { 
  },
  created(){
        if(this.laycfg){
            this.cfgUp = this.laycfg[0]
            this.cfgDown = this.laycfg[1]
        }
  },
  async mounted() {  
  },
  watch: { 
  }
};
</script>
