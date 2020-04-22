/* jshint esversion: 6 */
import Vue from 'vue';
import Router from 'vue-router';

//单点登录
import Test from '@/components/Test';
//单点登录
import Blank from '@/components/Blank';
//钉钉
import Ding from '@/components/Ding';
//微信小程序
import WxApplets from '@/components/wxApplets/WxApplets';
import WxAppletsMessage from '@/components/wxApplets/WxAppletsMessage';
import WxAppletsMenu from '@/components/wxApplets/WxAppletsMenu';
import WxAppletsMe from '@/components/wxApplets/WxAppletsMe';


//三农  移动端注册  
import register from '@/views/register/register';
import agent from '@/views/register/agent';
import company from '@/views/register/company';
import check from '@/views/register/check';

//微信支付页面
const wxPay = () =>
    import ('@/components/wxPay/wxPay');

//系统基础路由
const Test1 = () =>
    import ('@/components/Test1');
const Dashboard = () =>
    import ('@/views/dashboard/Dashboard1'); //首页
const CommLayUI = () =>
    import ('@/views/common/commonLayUI');
const Task = () =>
    import ('@/views/base/bipTask');
const Message = () =>
    import ('@/views/base/bipMsg');
//end


//KTZ
const BipKTZ = () =>
    import ('@/components/views/ktzapp/BipKTZ');
//end

//车辆管理
const CarRealMap = () =>
    import ('@/components/bipmap/vehicle/CarRealMap');
const CarLocus = () =>
    import ('@/components/bipmap/vehicle/CarLocus');
const Adjust = () =>
    import ('@/components/bipmap/vehicle/AdjustMap');
const Fence = () =>
    import ('@/components/bipmap/vehicle/AlectricFence');

//end

//飞防管控
const BipMap = () => import ('@/components/bipmap/airfence/BipMap');//轨迹回放
const BipMapHJ = () => import ('@/components/bipmap/airfence/BipMapHJ');
const JCList = () => import ('@/components/bipmap/airfence/JCList');
const jcSelList = () => import ('@/components/bipmap/airfence/jcSelList');
const JCMap = () => import ('@/components/bipmap/airfence/JCMap');
const BipMapCurrent = () => import ('@/components/bipmap/airfence/BipMapCurrent');
const ExportData = () => import ('@/components/bipmap/airfence/Exportdata');
const Synchronize = () => import ('@/components/bipmap/airfence/Synchronize');
const BipMapWork = () => import ('@/components/bipmap/airfence/BipMapWork');
const PlayBack= () => import('@/components/bipmap/airfence/new/PlayBack')
const RealTimeTrack= () => import('@/components/bipmap/airfence/new/RealTimeTrack')
//end

//水科学院
const skxjtHome = () =>
    import ('@/components/views/skxjtfile/skxjtHome');
//end

//CRM 
const CRMWorkbench = () =>
    import ('@/components/views/crm/CRMWorkbench');

// const Blank = () => import('@/components/Blank') 
// const Ding = () => import('@/components/Ding')  



Vue.use(Router)

let basePro = window.location.pathname;
basePro = basePro.substring(0, basePro.lastIndexOf('/'));
export default new Router({
    mode: 'history',
    base: basePro,
    routes: [
        //系统 路由mobileWD
        {
            path: '/mobileWD',
            name: 'mobileWD',
            component: WxApplets
        },
        {
            path: '/',
            name: 'Index',
            // component: WxApplets
            component:RealTimeTrack//飞防
        },
        {
            path: '/index',
            name: 'Dashbord',
            // component: WxApplets,
            component:RealTimeTrack//飞防
        },
        {
            path: '/task',
            name: '任务',
            component: Task
        }, {
            path: '/msg',
            name: '任务',
            component: Message
        }, {
            path: '/blank',
            name: 'blank',
            component: Blank
        },
        {
            path: '/ding',
            name: 'ding',
            component: Ding,
            beforeEnter: (to, from, next) => {
                next();
            }
        },
        {
            path: '/register',
            name: 'register',
            component: register,
            beforeEnter: (to, from, next) => {
                next();
            }
        },
        {
            path: '/agent',
            name: 'agent',
            component: agent,
            beforeEnter: (to, from, next) => {
                next();
            }
        },
        {
            path: '/company',
            name: 'company',
            component: company,
            beforeEnter: (to, from, next) => {
                next();
            }
        },
        {
            path: '/check',
            name: 'check',
            component: check,
            beforeEnter: (to, from, next) => {
                next();
            }
        },



        //微信小程序
        {
            path: '/wxApplets',
            name: 'WxApplets',
            component: WxApplets,
            beforeEnter: (to, from, next) => {
                next();
            }
        },
        {
            path: '/wxAppletsMenu',
            name: 'WxAppletsMenu',
            component: WxAppletsMenu,
            beforeEnter: (to, from, next) => {
                next();
            }
        },
        {
            path: '/wxAppletsMsg',
            name: 'WxAppletsMessage',
            component: WxAppletsMessage,
            beforeEnter: (to, from, next) => {
                next();
            }
        },
        {
            path: '/wxAppletsMe',
            name: 'WxAppletsMe',
            component: WxAppletsMe,
            beforeEnter: (to, from, next) => {
                next();
            }
        }, {
            path: '/wxPay',
            name: 'wxPay',
            component: wxPay,
        }
        //end    
        ,
        {
            path: '/layoutui',
            name: '页面布局',
            component: CommLayUI
        },
        {
            path: '/test1',
            name: 'OrderList',
            component: Test1
        },
        //系统 结束

        //车辆管理
        {
            path: '/CarLocus',
            name: '汽车轨迹回放',
            component: CarLocus
        },
        {
            path: '/Adjust',
            name: '调度',
            component: Adjust
        },
        {
            path: '/Fence',
            name: '电子围栏',
            component: Fence
        },
        //end

        //KTZ
        {
            path: '/ktz',
            name: 'OrderList',
            component: BipKTZ
        },
        //end

        //飞防 start
        {
            path: '/Synchronize',
            name: '数据同步',
            component: Synchronize
        },
        {
            path: '/bipmap',
            name: 'BipMap',
            component: BipMap
        },
        {
            path: '/bipmaphj',
            name: '航迹查询',
            component: BipMapHJ
        },
        {
            path: '/jclist',
            name: '架次统计表',
            component: JCList
        },
        {
            path: '/jcmap',
            name: '架次航带图',
            component: JCMap
        },
        {
            path: '/jcSelList',
            name: '架次统计查询',
            component: jcSelList
        },
        {
            path: '/exportData',
            name: '数据导出',
            component: ExportData
        },
        {
            path: '/BipMapWork',
            name: '作业区查询(地图)',
            component: BipMapWork
        },
        {
            path: '/PlayBack',
            name: '轨迹回放(天地图)',
            component: PlayBack
        },
        {
            path: '/RealTimeTrack',
            name: '实时轨迹(天地图)',
            component: RealTimeTrack
        },
        //飞防 end
        //crm
        {
            path: '/CRMWorkbench',
            name: '工作台',
            component: CRMWorkbench
        },
        {
            path: '/Test',
            name: '工作台',
            component: Test
        },

    ]
})