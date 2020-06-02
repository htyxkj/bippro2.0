<template>
  <md-part>
    <template v-if="bbb">
      <md-bip-bill-task-applet :dsm="dsm" :dsext="dsext" :opera="opera" @gotask="goTask" @gorow="gorow" :canUp="canUp" :canNext="canNext"></md-bip-bill-task-applet>
    </template>
    <template v-if="!bbb">
      <md-bip-mobile-task-applet ref="mobileTaskApplet" :dsm="dsm" :dsext="dsext" :opera="opera" @gotask="goTask" @gorow="gorow" :canUp="canUp" :canNext="canNext"></md-bip-mobile-task-applet>
    </template>
  </md-part>
</template>
<script>
export default {
  props: { dsm: Object, dsext: Array, opera: Object,canUp:Boolean,canNext:Boolean},
  data(){
    return {
      bbb:this.ISPC()
    }
  },
  methods:{
    goTask(){
      this.$emit('gotask');
    },
    gorow(state){
      this.$emit('gorow',state);
    },
    makeCheckParams(){
      let tapp = this.$refs['mobileTaskApplet']
      if(tapp){
          tapp.makeCheckParams();
      }
    }
  }
}
</script>

