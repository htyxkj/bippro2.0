<template>
    <div style="background-color:#f6f6f6"> 

        <div style="height: 100%;overflow: auto;">
            <div class="blank" v-if="shortcutMenu && shortcutMenu.length>0"> 
                <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" class="title"> 
                    &nbsp;&nbsp;快捷菜单
                </md-layout> 
                <hr style="width:100%;color:#EBEEF0;margin:0px" />
                <md-layout md-gutter >
                    <template v-for="(item,index) in shortcutMenu" >
                        <md-layout :key="index" md-flex-small="25" md-flex-medium="25" class="title2" v-if="item.menuattr !=4">
                                <div v-on:click="url('/layoutui?'+item.command+'&title='+item.menuName)" style="margin:0px;padding:0px;width:100%">
                                    <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" style="position: relative;">   
                                        <img :src="dingMenuImg+item.menuIcon" style="margin:auto;width: 30px;height: 30px;"/>
                                        <div class="textNum" v-show="item.bgnum >0">{{item.bgnum}}</div>
                                    </md-layout>
                                    <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" md-align="center"> 
                                        <span>{{item.menuName}}</span>
                                    </md-layout> 
                                </div>
                        </md-layout> 
                    </template>
                </md-layout>
            </div>

            <md-layout v-for="(item,index) in summaryCar" :key="index" md-flex-small="100" md-flex-medium="100" class="summaryCar">
                <md-layout md-flex-small="100" md-flex-medium="100" style="font-size: 16px;">
                    &nbsp;&nbsp;{{item.name}}
                </md-layout>
                <hr style="width:100%;color:#EBEEF0;margin:0px" />
                <md-layout v-for="(vl,vik) in item.value" :key="vik" md-flex="50" md-flex-xsmall="50" md-flex-small="50" :style="vik==0?'border-right: 1px solid #EBEEF0;':''" @click.native="summaryCarClick(vl.menuid)">   
                    <md-layout md-flex="100" md-align="center">
                        <span>{{vl.name}}</span>
                    </md-layout>
                    <md-layout md-flex="100" md-align="center"  style="font-size: 16px;color:red">
                        {{vl.value}}
                    </md-layout>
                </md-layout>
            </md-layout>

            <md-layout md-flex-small="100" md-flex="66" style="margin-top:0px">
                <md-card style="box-shadow: 0px 0px 0px;"> 
                    <md-card-media>
                        <md-layout v-for="(item,index) in layoutFigure" :key="index" md-flex="100" md-flex-xsmall="100">
                        <md-layout v-for="(item_a,index_a) in item" :key="index_a" :md-flex="item_a.width" md-flex-xsmall="100">
                            <md-chart style="max-height:350px;min-height:250px;" ref="pieChart" :options="item_a.options" :autoResize="true"></md-chart>
                        </md-layout> 
                        </md-layout>
                    </md-card-media>
                </md-card>
            </md-layout>
        </div>
        <md-loading :loading="loading"></md-loading>
    </div>
</template>
<script>
import indexChart from '@/views/dashboard/chartJS/indexChart.js'
import qs from 'qs'
import axios from 'axios'
import Login from '../../views/Login';
import dd from '../../../static/dingding/dingtalk.open.js';
const ICONS = ['menu', 'dashboard', 'verified_user', 'videogame_asset','assessment','invert_colors', 'cloud_download']
const ICONCOLOR=[{color:'red-700-0.8'},{color:'green'},{color:'indigo'},{color:'blue-700-0.8'},{color:'lime'},{color:'teal'},,{color:'green-600-0.5'}]

export default { 
    mixins:[indexChart],
    components:{'app-login':Login}, 
    data() {
        return {
            loading:0,
            menuList:[],
            shortcutMenu:[],
            dingMenuImg :`${global.BIPAPIURL}`,
            secret:null,
            summaryCar:[],
        }
    },
    async mounted(){ 
    },
    async created(){
        var lid = window.sessionStorage.getItem('isLogin');
        if(lid && lid !=  'false' ){
            if(this.menuList.length<=0){
                this.menuList = JSON.parse(window.sessionStorage.getItem('menulist')); 
            }
            if(this.shortcutMenu.length<=0){
                this.shortcutMenu = JSON.parse(window.sessionStorage.getItem("shortcutMenu"));
            }
            if(this.summaryCar.length<=0){
                let c = JSON.parse(window.sessionStorage.getItem("summaryCar"));
                if(c)
                    this.summaryCar=c;
            }
            let user = JSON.parse(window.sessionStorage.getItem('user'));
            if(!this.shortcutMenu || (this.shortcutMenu && this.shortcutMenu.length<=0)){
                this.getshortcutMenu(user.userCode,user.gwCode)
            }
            this.getDateStr();
        }else{  
            // alert("未登陆！")
            // this.loading=1; 
            // this.secret = this.$route.query.secret;
            // this.loginRemote(this.secret);
        }  
    },
    methods: {
        async url(url){
            await this.$router.push(url)
        },
        async loginSuccess(res) {
            this.loading=0;
            if (res.data.id === 0) {
                var userI = res.data.data.user;
                var mlist = res.data.data.menulist;
                var snkey = res.data.data.snkey; 
                let ml = JSON.parse(JSON.stringify(mlist)); 
                if(ml)
                    for(var i =0;i<ml.length;i++){
                        if(ml[i].haveChild == true){
                            for(var j =0;j<ml[i].childMenu.length;j++){
                                let pbuid1 = ml[i].childMenu[j].pbuid;
                                if(!pbuid1){
                                    let command = ml[i].childMenu[j].command;
                                    if(command){
                                        let pbuid0 = command.split("&");//pbuid=100301&pmenuid=800303
                                        pbuid1 = pbuid0[0].split("=")[1]; 
                                        let menuid =  pbuid0[1].split("=")[1] 
                                        ml[i].childMenu[j].pbuid = pbuid1;
                                        ml[i].childMenu[j].menuid = menuid;
                                    }
                                } 
                            }
                        }
                    }
                this.menuList = ml; 
                window.sessionStorage.setItem('user', JSON.stringify(userI));
                window.sessionStorage.setItem('menulist', JSON.stringify(this.menuList));
                window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
                window.sessionStorage.setItem('isLogin', true); 
                this.getshortcutMenu(userI.userCode,userI.gwCode)
                this.getDateStr();  
                this.$emit('appletsLogin');
            } else {
                this.$notify.danger({content: res.data.message})
                window.sessionStorage.clear();
                this.$router.push({path:'/',name:''})

            }
        },
        async loginRemote(secret) { 
            var logindata = {
                apiId: global.APIID_OUTLOGIN,
                dbid: global.DBID,
                wxAppLetsSecret: secret, 
                ioutsys:4,
            }
            try{
                var res = await this.getDataByAPINew(logindata);
                await this.loginSuccess(res);
                return res;
            }catch(e){
                console.log(e)
                this.$notify.danger({content: '系统连接错误！！'});
            }
        }, 
        async getshortcutMenu(userCode,gwCode){
            var logindata = {
                apiId: global.APIID_SHORTCUTMENU,
                dbid: global.DBID,
                usercode: userCode,
                gwCode:gwCode,
            }
            try{
                var res = await this.getDataByAPINew(logindata);
                this.summaryCar = [];
                if(res.data.id ==0){
                    let mydesk = res.data.data.mydesk;
                    for(var i=0;i<mydesk.length;i++){
                        let cc = JSON.stringify(mydesk[i]);
                        let djson = JSON.parse(cc);
                        if(djson.comtype == 'Menu'){
                            this.mkShortcutMenu(djson);
                        }else if(djson.comtype == 'Summary'){
                            await this.mkMyCar(djson,userCode);
                        }
                    }
                }
            }catch(e){
                console.log(e)
                this.$notify.danger({content: '系统连接错误！！'});
            }
        },
        //构建Car块
        async mkMyCar(mjson,userCode){
            let car = {name:mjson.sname,value:[]};
            let cont = mjson.cont;
            cont = cont.substring(1,cont.length-1);
            cont = cont.split(",")
            let v = [];
            for(var i=0;i<cont.length;i++){
                let refName = cont[i].split(";")[0];
                let menuid = cont[i].split(";")[1];
                let data2 = {  
                    dbid: global.DBID,
                    usercode: userCode,
                    apiId: global.APIID_AIDO, 
                    page:1,
                    assistid: refName, //辅助名称
                    currentPage:1,  //页数
                    pageSize: 2,//每页条数
                };
                await this.getDataByAPINewSync(data2).then((res)=>{ 
                    if(res.data.id && res.data.id ==-1){

                    }else{
                        let value = "0"
                        if(res.data.values){
                            value = res.data.values[0][res.data.allCols[1]]
                        }
                        let cc = {name:res.data.title,value:value,menuid:menuid}
                        car.value.push(cc);
                    }
                });
            }
            this.summaryCar.push(car);
            if(this.summaryCar.length>0){
                window.sessionStorage.setItem("summaryCar",JSON.stringify(this.summaryCar));
            } 
        },
        //构建自定义菜单
        mkShortcutMenu(mjson){
            this.shortcutMenu = [];
            let mid = JSON.parse(mjson.cont)
            let menu = mid.menuid.split(";");
            for(var i=0;i<this.menuList.length;i++){
                menu.forEach( (item) => {
                    let menu = this.findMenuById(item,this.menuList[i]);
                    if(menu){
                        this.shortcutMenu.push(menu);
                    }
                });
            }
            if(this.shortcutMenu.length>0){
                window.sessionStorage.setItem("shortcutMenu",JSON.stringify(this.shortcutMenu));
            } 
        },
        findMenuById(menuId,menu){
            if(menu.menuId==menuId){
                return menu
            }else{
                if(menu.haveChild){
                    for(let i = 0;i<menu.childMenu.length;i++){
                        let m1 = this.findMenuById(menuId,menu.childMenu[i])
                        if(m1!=null){
                            return m1;
                        }
                    }
                }
                return null;
            }
        },
        summaryCarClick(menuid){
            let menuList = JSON.parse(window.sessionStorage.getItem('menulist')); 
            let mm = this.getMenu(menuList,menuid);
            if (!mm) {
                this.$notify.info({
                content: "没有" + menuid + "菜单权限!"
                });
            }else{
                this.$router.push(`/layoutui?${mm.command}&title=${mm.menuName}&othersys=1`) 
            }
        },
        getMenu(menus,menuID){
            let mm;
            for (let i = 0; i < menus.length; i++) {
                let menu = menus[i];
                if (menu.menuId === menuID) {
                mm = menu;
                break;
                }
                if(menu.haveChild){
                mm = this.getMenu(menu.childMenu,menuID);
                if(mm)
                    break;
                }
            }
            return mm;
            },
    },
    watch: { 

    }
}
</script> 
<style lang="scss" scoped>
  .title{font-size: 16px;}
  .title2{font-size: 0.13rem;margin-top: 0.15rem} 
  .blank{background-color: white;margin-top: 10px;padding-left: 15px;padding-top:10px;padding-right: 15px;}
  .blank1{background-color: white;padding-left: 10px;padding-top:10px;padding-right: 15px;}
  .textNum{
    background-color: #ea362b;
    border-radius: 100px;
    width: 14px;
    height: 14px;
    text-align: center;
    line-height: 15px;
    font-size: 8px; 
    right: .2rem;
    top: -.04rem;
    color: white;
    position: absolute;
  }
    .summaryCar{
        background-color: white;
        padding:0px 10px 5px 10px;
        margin-bottom: 10px;
    }
</style>