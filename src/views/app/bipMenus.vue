<template>
  <md-sidenav class="md-left md-app-menu has-extend" ref="mainSidenav">
    <md-toolbar>
      <img src="../../img/bip.png" alt="People">
      <md-subheader class="md-title">Bip系统平台</md-subheader>
    </md-toolbar>
    <md-list class="bip-menulist md-dense">
      <div>
      <md-list-item>
        <router-link exact to="/index">
          <md-icon v-colors="{color:'red-700-0.8'}">dashboard</md-icon>
          <span>首页</span>
        </router-link>
      </md-list-item>
      </div>
      <bip-menu v-for="mm in menus" :key="mm.menuId" v-if="mm.menuId !=='5003'" :menuItem="mm"></bip-menu>
      <div>
      <md-list-item>
        <router-link exact to="/ktz">
          <md-icon v-colors="{color:'green-700-0.8'}">dashboard</md-icon>
          <span>申请单统计表</span>
        </router-link>
      </md-list-item>
      <md-list-item>
        <router-link exact to="/task">
          <md-icon v-colors="{color:'red-700-0.8'}">send</md-icon>
          <span>{{$t('biptask.title')}}</span>
        </router-link>
      </md-list-item>
      <md-list-item>
        <router-link exact to="/msg">
          <md-icon v-colors="{color:'green-700-0.8'}">message_bulleted</md-icon>
          <span>{{$t('bipmsg.title')}}</span>
        </router-link>
      </md-list-item>

      </div>
    </md-list>
  </md-sidenav>
</template>

<script>
import BipMenuItem from './bipMenuItem'
export default {
  name: 'bip-menus',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      menus: []
    }
  },
  mounted() {
    this.menus = JSON.parse(window.sessionStorage.getItem('menulist'));
  },
  components: { 'bip-menu': BipMenuItem },
  methods: {
    toggle() {
      this.$refs.mainSidenav.toggle();
      this.$emit('toggle');
    }
  }
}
</script>

<style lang="scss" scoped>
.bip-menulist.md-dense{
  overflow: auto;
}
.md-list{
display: inherit;
}
.md-title{
  color: #fff;
  font-family: "Lantinghei SC", "Open Sans", Arial, "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
}
</style>


