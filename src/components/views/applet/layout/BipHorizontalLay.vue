<template>
<md-layout md-gutter="8" v-if="laycfg" md-row md-flex="100">
    <md-layout v-if="cfgL" :md-flex="cfgL.width">
        <template v-if="!cfgL.bcells">
            <bip-comm-lay :layout="cfgL.comp" :dsm="dsm" :sth="sth"></bip-comm-lay>
        </template>
        <template v-else> 
            <lay-cell :laycell="cfgL.comp" :dsm="dsm" :sth="sth"></lay-cell> 
        </template>
    </md-layout>
    <md-layout v-if="cfgR" :md-flex="cfgR.width">
        <template v-if="!cfgR.bcells">
            <bip-comm-lay :layout="cfgR.comp" :dsm="dsm" :sth="sth"></bip-comm-lay>
        </template>
        <template v-else> 
            <lay-cell :laycell="cfgR.comp" :dsm="dsm" :sth="sth"></lay-cell> 
        </template>
    </md-layout>
</md-layout>
    
</template>
<script> 
export default {
  data() {
    return {
        cfgL:null,
        cfgR:null,
    };
  },
  props:  {laycfg:Array,dsm :Object,sth:Object},
  methods: { 
  },
  computed: { 
  }, 
  created(){
        if(this.laycfg){
            this.cfgL = this.laycfg[0]
            this.cfgR = this.laycfg[1]
            this.cfgL.width=30;
            this.cfgR.width=70;
            let jsL = false;
            if(this.cfgL.comp.layId.indexOf("*")>0){
                let cc = this.cfgL.comp.layId.split("*")[0];
                if(cc<1)
                    this.cfgL.width = cc*100; 
            }
            if(this.cfgR.comp.layId)
            if(this.cfgR.comp.layId.indexOf("*")>0){
                let cc = this.cfgR.comp.layId.split("*")[0];
                if(cc<1)
                    this.cfgR.width = cc*100; 
            }
        }
  },
  async mounted() {  
  },
  watch: { 
  }
};
</script>
