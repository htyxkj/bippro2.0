import Vue from 'vue'
import Router from 'vue-router'
import Test from '@/components/Test'
import CommLayUI from '@/views/common/commonLayUI'
import Dashbord from '@/views/dashboard/Dashboard'

Vue.use(Router)

let basePro = window.location.pathname;
basePro = basePro.substring(0,basePro.lastIndexOf('/'));
// console.log(basePro);
export default new Router({
  mode: 'history',
  base:basePro,
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Dashbord
    },
    {
      path: '/index',
      name: 'Dashbord',
      component: Dashbord
    },
    {
      path: '/layoutui',
      name: '页面布局',
      component: CommLayUI
    },
    {
      path: '/test',
      name: '测试',
      component: Test
    }
  ]
})
