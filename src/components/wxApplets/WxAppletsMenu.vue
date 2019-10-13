<template>
    <div style="background-color:#f6f6f6"> 
        <div style="height: 100%;overflow: auto;">
            <div v-for="mu in menuList" :key="mu.menuId" class="blank"> 
                <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" class="title"> 
                    {{mu.menuName}}
                </md-layout> 
                <hr style="width:100%;color:#EBEEF0;margin:0px" />
                <md-layout md-gutter >
                    <template v-for="(item,index) in mu.childMenu" >
                        <md-layout :key="index" md-flex-small="25" md-flex-medium="25" class="title2" v-if="item.menuattr !=4" >
                            <div v-on:click="url('/layoutui?'+item.command+'&title='+item.menuName)" style="margin:0px;padding:0px;width:100%">
                                <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" style="position: relative;">   
                                    <!-- <md-icon  v-colors="item.iconcc">{{item.menuIcon}}</md-icon>  -->
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
        </div>
        <md-loading :loading="loading"></md-loading>
    </div>
</template>
<script>
import qs from 'qs'
import axios from 'axios'
import Login from '../../views/Login';
import dd from '../../../static/dingding/dingtalk.open.js';
const ICONS = ['menu', 'dashboard', 'verified_user', 'videogame_asset','assessment','invert_colors', 'cloud_download']
const ICONCOLOR=[{color:'red-700-0.8'},{color:'green'},{color:'indigo'},{color:'blue-700-0.8'},{color:'lime'},{color:'teal'},,{color:'green-600-0.5'}]

export default { 
    components:{'app-login':Login}, 
    data() {
        return {
            loading:0,
            menuList:[],
            dingMenuImg :`${global.BIPAPIURL}`,
            secret:null,
        }
    },
    async mounted(){ 
    },
    async created(){
        window.sessionStorage.setItem('isLoginType', 4); 
        var lid = window.sessionStorage.getItem('isLogin');
        if(lid){
            if(this.menuList.length<=0){
                this.menuList = JSON.parse(window.sessionStorage.getItem('menulist')); 
                for(var i =0;i<this.menuList.length;i++){
                    if(this.menuList[i].haveChild == true){
                        for(var j =0;j<this.menuList[i].childMenu.length;j++){
                            const cc = this.menuList[i].childMenu[j];
                            this.$set(cc,'bgnum',0) 
                            this.menuList[i].childMenu[j] = cc;
                        }
                    }
                } 
            }
            this.getNumberofBadges();
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
                this.getDateStr();  
                this.getNumberofBadges(); 
            } else {
                this.$notify.danger({content: res.data.message})
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
        //菜单徽章  用来显示单据数量
        async getNumberofBadges(menuid){   
            if(this.menuList)
            for(var i =0;i<this.menuList.length;i++){
                if(this.menuList[i].haveChild == true){
                    for(var j =0;j<this.menuList[i].childMenu.length;j++){
                        let pbuid1 = this.menuList[i].childMenu[j].pbuid;
                        if(!pbuid1){
                            let command = this.menuList[i].childMenu[j].command;
                            if(command){
                                let pbuid0 = command.split("&");//pbuid=100301&pmenuid=800303
                                pbuid1 = pbuid0[0].split("=")[1]; 
                                let menuid =  pbuid0[1].split("=")[1] 
                                this.menuList[i].childMenu[j].pbuid = pbuid1;
                            }
                        }
                        if(pbuid1){
                            await this.getNum(pbuid1,i,j); 
                        }
                    }
                }
            }
        },
        async getNum(menuid,i,j){
            let _this = this;
            var data1 = {
            dbid: global.DBID,
            usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
            apiId: global.APIID_DLG,
            menuid: "BG."+menuid,
            };
            await this.getDataByAPINewSync(data1).then((res)=>{
                if(res.data.id !=-1){
                    let name = res.data.data.btn[0];
                    let data2 = {  
                        dbid: global.DBID,
                        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
                        apiId: global.APIID_AIDO, 
                        page:1,
                        assistid: name, 
                    };
                    this.getDataByAPINewSync(data2).then((res)=>{ 
                        if(res.data) {
                            _this.menuList[i].childMenu[j].bgnum = res.data.total; 
                        }
                    });
                }
            }); 
        }
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
</style>