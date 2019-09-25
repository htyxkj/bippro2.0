<template>
    <div style="background-color:#f6f6f6"> 

        <div style="height: 100%;overflow: auto;">
            <div class="blank" v-if="shortcutMenu && shortcutMenu.length>0"> 
                <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" class="title"> 
                    快捷菜单
                </md-layout> 
                <md-layout md-gutter >
                    <md-layout  v-for="(item,index) in shortcutMenu" :key="index" md-flex-small="25" md-flex-medium="25" class="title2" v-if="item.menuattr !=4" >
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
                </md-layout>
            </div>
         
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
        }
    },
    async mounted(){ 
    },
    async created(){
        window.sessionStorage.setItem('isLoginType', 4); 
        var lid = window.sessionStorage.getItem('isLogin');
        if(lid && lid !=  'false' ){
            if(this.menuList.length<=0){
                this.menuList = JSON.parse(window.sessionStorage.getItem('menulist')); 
            }
            if(this.shortcutMenu.length<=0){
                this.shortcutMenu = JSON.parse(window.sessionStorage.getItem("shortcutMenu"));
            }
            let user = JSON.parse(window.sessionStorage.getItem('user'));
            if(!this.shortcutMenu || (this.shortcutMenu && this.shortcutMenu.length<=0)){
                this.getshortcutMenu(user.userCode)
            }
            this.getDateStr();
        }else{  
            this.loading=1; 
            this.secret = this.$route.query.secret;
            this.loginRemote(this.secret);
        }  
    },
    methods: {
        async url(url){
            this.$emit('appletsLogin');
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
                this.getshortcutMenu(userI.userCode)
                this.getDateStr();  
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
        async getshortcutMenu(userCode){
            console.log(userCode) 
            var logindata = {
                apiId: global.APIID_SHORTCUTMENU,
                dbid: global.DBID,
                usercode: userCode,
            }
            try{
                var res = await this.getDataByAPINew(logindata);
                console.log(res)
                if(res.data.id ==0){
                    let m = res.data.data.menu;
                    let mjson = JSON.parse(m); 
                    this.shortcutMenu = [];
                    let menu = mjson.menuid.split(";");
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
                }
            }catch(e){
                console.log(e)
                this.$notify.danger({content: '系统连接错误！！'});
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
        }
    },
    watch: { 

    }
}
</script> 
<style lang="scss" scoped>
  .title{font-size: 0.18rem;font-weight: 30}
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
</style>