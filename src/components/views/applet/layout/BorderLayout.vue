<template>
<div class="bip-border-lay">
    <template v-if="btop">
        <template v-if="!laycfg[0].bcells">
            <bip-comm-lay :layout="laycfg[0].comp" :dsm="dsm"></bip-comm-lay >
        </template>
        <template v-else>
            <md-layout>
                <lay-cell :laycell="laycfg[0].comp" :dsm="dsm"></lay-cell>
            </md-layout>
        </template>
    </template>
    <template v-if="bcenter"> 
        <template v-if="bleft">
            <!-- <md-layout :span="wleft"> -->
                <template v-if="!laycfg[3].bcells">
                    <bip-comm-lay :layout="laycfg[3].comp" :dsm="dsm"></bip-comm-lay >
                </template>
                <template v-else>
                    <md-layout>
                        <lay-cell :laycell="laycfg[3].comp" :dsm="dsm"></lay-cell>
                    </md-layout>
                </template>
            <!-- </md-layout> -->
        </template>
        <template v-if="bcenter">
            <template v-if="!laycfg[wcenterIndex].bcells">
                <bip-comm-lay :layout="laycfg[wcenterIndex].comp" :dsm="dsm"></bip-comm-lay >
            </template>
            <template v-else>
                <md-layout :span="wcenter">
                    <lay-cell :laycell="laycfg[wcenterIndex].comp" :dsm="dsm"></lay-cell>
                </md-layout>
            </template>
        </template>
        <template v-if="bright">
            <!-- <md-layout :span="wright"> -->
                <template v-if="!laycfg[4].bcells">
                    <bip-comm-lay :layout="laycfg[4].comp" :dsm="dsm"></bip-comm-lay >
                </template>
                <template v-else>
                    <md-layout>
                        <lay-cell :laycell="laycfg[4].comp" :dsm="dsm"></lay-cell>
                    </md-layout>
                </template>
        </template> 
    </template>
    <template v-if="bbuttom"> 
        <template v-if="!laycfg[2].bcells">
            <bip-comm-lay :layout="laycfg[2].comp" :dsm="dsm"></bip-comm-lay >
        </template>
        <template v-else>
            <md-layout>
                <lay-cell :laycell="laycfg[2].comp" :dsm="dsm"></lay-cell>
            </md-layout>
        </template>  
    </template>
</div>

</template>
<script> 
export default {
  data() {
    return {
        btop:false,
        bcenter:false,
        len:0,
        wcenter:24,
        bleft:false,
        bbuttom:false,
        wleft:0,
        wright:0,
        wcenterIndex:0,
        bright:false,
    };
  },
  props: {laycfg:Array,dsm :Object},
  methods: { 
    initInfo(){
        // console.log("borderLayout")
        if(this.laycfg){
            this.len = this.laycfg.length
            this.wcenter = 24
            if(this.len==1){
                this.btop = false
                this.bcenter = true
                this.wcenter = 24
                this.wleft = this.wright = 0
                this.wcenterIndex = 0
            }else{
                this.wcenterIndex = 1
                this.btop = this.len>0
                this.bcenter = this.len>1
                this.bbuttom = this.len>2
                this.bleft = this.len>3
                this.bright = this.len>4
                if(this.bright&&this.bleft){
                    this.wleft = 4
                    this.wcenter = 16
                    this.wright = 4
                }else if(this.bright){
                    this.wcenter = 20
                    this.wright = 4
                }else if(this.bleft){
                    this.wleft = 4;
                    this.wcenter = 20;
                }
            }
        }
    }
  },
  computed: { 
  }, 
  created(){
    this.initInfo();
  },
  async mounted() {  
  },
  watch: { 
  }
};
</script>
