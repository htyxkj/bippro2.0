<template>
<!-- <transition name="fade"> -->
  <div v-show="blink" >
    <md-sidenav class="md-right md-bill-i" ref="sbill"   @close="close" >  
        <md-layout style="background-color: rgb(33, 150, 243);color: rgb(255, 255, 255);min-height: .55rem;padding: 0px;margin: 0px;line-height: .55rem;font-size: 0.18rem;">
          <md-layout md-flex="90" md-align="center" style="padding: 0px;margin: 0px;">{{menuTitle}}</md-layout>
          <md-layout md-flex="10" md-align="center" > 
            <md-button class="md-icon-button" @click="blink_close"  >
              <md-icon>close</md-icon>
            </md-button>  
          </md-layout>
        </md-layout> 
        <div class="layout-fill flex md-part layout-column">
          <md-bip-bi v-if="mparams" :mdTitle="menuTitle" :mparams="mparams"></md-bip-bi>    
        </div>
    </md-sidenav>
    <md-loading :loading="loading"></md-loading>
  </div>
<!-- </transition> -->
</template>
<script>
import CDataSet from "../classes/CDataSet";
import Operation from "../operation/operation";
import menuPattr from "../classes/menuPattr";
import BillState from '../classes/billState';
export default {
  data() {
    return { 
      mparams: null, 
      menuTitle:"",
      blink:false,
      loading:0,
    };
  },
  methods: {
    async open(mparams,menuName) { 
      this.menuTitle = menuName; 
      this.mparams = mparams;
      this.blink=true;
      this.loading++;  
      this.$refs["sbill"].open();  
      this.loading--;
    }, 
    blink_close(){
      this.close();
    },
    close(){  
      this.blink=false; 
    },
  }, 
};
</script>
<style  scope>
  /* .fade-enter-active, .fade-leave-active {
    transition: opacity 5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }  */
</style>
