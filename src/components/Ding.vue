<template>
    <div style="background-color:#f6f6f6"> 
        <div>
            <div v-if="ddApp.length>0" class="blank1"> 
                <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" class="title"> 
                    应用
                </md-layout> 
                <md-layout md-gutter >
                    <md-layout  v-for="(item,index) in ddApp" :key="index" md-flex-small="25" md-flex-medium="25" class="title2" >
                        <div v-on:click="ddurl('dingtalk://dingtalkclient/action/switchtab?index=2&name=work&scene=1&corpid='+item.d_corpid+'&agentid='+item.d_applyid)" style="margin:0px;padding:0px;width:100%">
                            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100">   
                                <md-icon  v-colors="item.iconcc">{{item.menuIcon}}</md-icon> 
                            </md-layout>
                            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" class="title3" md-align="center"> 
                                <span v-if="item.wapno =='01'">审批中心</span>
                                <span v-else-if="item.wapno =='03'">消息中心</span>
                                <span v-else-if="item.wapno =='04'">公告通知</span>
                            </md-layout>
                        </div>
                    </md-layout> 
                </md-layout> 
            </div>


            <div v-for="mu in menuList" :key="mu.menuId" class="blank"> 
                <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" class="title"> 
                    {{mu.menuName}}
                </md-layout> 
                <md-layout md-gutter >
                    <md-layout  v-for="(item,index) in mu.childMenu" :key="index" md-flex-small="25" md-flex-medium="25" class="title2" >
                        <div v-on:click="url('/layoutui?'+item.command+'&title='+item.menuName)" style="margin:0px;padding:0px;width:100%">
                            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100">   
                                <md-icon  v-colors="item.iconcc">{{item.menuIcon}}</md-icon> 
                            </md-layout>
                            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" class="title3" md-align="center"> 
                                <span>{{item.menuName}}</span>
                            </md-layout>
                        </div>
                    </md-layout> 
                </md-layout> 
            </div>
        </div>
        <md-loading :loading="loading"></md-loading>
    </div>
</template>
<script>
import qs from 'qs'
import axios from 'axios'
import Login from '../views/Login';
import dd from '../../static/dingding/dingtalk.open.js';
const ICONS = ['menu', 'dashboard', 'verified_user', 'videogame_asset','assessment','invert_colors', 'cloud_download']
const ICONCOLOR=[{color:'red-700-0.8'},{color:'green'},{color:'indigo'},{color:'blue-700-0.8'},{color:'lime'},{color:'teal'},,{color:'green-600-0.5'}]

export default { 
    components:{'app-login':Login},
    data() {
        return {
            loading:0,
            menuList:[],
            ddApp:[],
            code:'',
            corpId:'',
            appkey:'',
            appId:'',
            agentId:'',
        }
    },
    async mounted(){
        
    },
    async created(){ 
        var lid = window.sessionStorage.getItem('isLogin');
        if(lid){
            console.log("已登录") 
            if(this.menuList.length<=0){
                this.menuList = JSON.parse(window.sessionStorage.getItem('menulist'));
            }
            if(this.ddApp.length<=0){
                let dapp = window.sessionStorage.getItem('ddApp');
                if(dapp)
                this.ddApp = JSON.parse(dapp);
            }
        }else{ 
            this.loading=1; 
            this.corpId =this.$route.query.corpId   //企业唯一码 
            this.appkey = this.$route.query.appkey  //应用唯一码
            this.appId = this.$route.query.appId;   //默认00
            this.agentId = this.$route.query.agentId;//应用id
            let _this =this;
            await dd.ready(function() {
        	    dd.runtime.permission.requestAuthCode({
        	        corpId: _this.corpId,
        	        onSuccess: function(info) {  
                        _this.loginRemote(info.code)
                    },
        	        onFail : function(err) { }
        	    });
            }); 
        }
    },
    methods: {
        async url(url){
            this.$emit('dingLogin');
            await this.$router.push(url)
        },
        ddurl(url){
            window.location.href=url;
            // this.$router.push(url)
        },
        async loginSuccess(res) {
            this.loading=0;
            if (res.data.id === 0) {
                console.log("钉钉登录成功！") 
                var userI = res.data.data.user;
                var mlist = res.data.data.menulist;
                var snkey = res.data.data.snkey; 
                this.menuList = JSON.parse(JSON.stringify(mlist));
                let aa=[];
                if(this.menuList)
                for(var i =0;i<this.menuList.length;i++){
                    if(this.menuList[i].haveChild == true){
                        for(var j =0;j<this.menuList[i].childMenu.length;j++){
                            var bb = Math.ceil(Math.random() * (ICONS.length-1));
                            this.menuList[i].childMenu[j].iconcc= ICONCOLOR[bb]
                            this.menuList[i].childMenu[j].menuIcon=ICONS[bb] 
                        }
                        aa.push(this.menuList[i]);
                    }
                }
                this.menuList = aa;
                window.sessionStorage.setItem('user', JSON.stringify(userI));
                window.sessionStorage.setItem('menulist', JSON.stringify(this.menuList));
                window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
                window.sessionStorage.setItem('isLogin', true); 
                await this.getDApp();
            } else {
                // await this.$router.push(`/`)
                this.$notify.danger({content: res.data.message})
            }
        },
        async loginRemote(code) { 
            var logindata = {
                apiId: global.APIID_OUTLOGIN,
                dbid: global.DBID,
                code: code,
                corpId:this.corpId,
                appkey:this.appkey,
                appId:this.appId,
                ding:1, 
                ioutsys:3,
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
        //获取钉钉应用
        async getDApp(){
            var param={
                apiId: "assisto",
                dbid: `${global.DBID}`,
                usercode: JSON.parse(window.sessionStorage.getItem('user')).userCode, 
                page:1,
                pagesize:999999,
                assistid: "DDAPP",
                cont:null,
            };  
            let _this =this;
            let  str = await axios.post(`${global.BIPAPIURL}`+`${global.API_COM }`,qs.stringify(param)) .then(res=>{ 
                // console.log(res.data.values)
                if(res.data.values){
                    _this.ddApp = res.data.values;
                    for(var  i =0; i< _this.ddApp.length ;i++){
                        var bb = Math.ceil(Math.random() * (ICONS.length-2));
                        _this.ddApp[i].iconcc= ICONCOLOR[bb]
                        _this.ddApp[i].menuIcon=ICONS[bb] 
                    }  
                }
            }) .catch(err=>{
                console.log(err)
            })
            window.sessionStorage.setItem('ddApp', JSON.stringify(this.ddApp));
        }
    },
    watch: { 

    }
}
</script> 
<style lang="scss" scoped>
  .title{font-size: 0.18rem;font-weight: 30}
  .title2{font-size: 0.13rem;margin-top: 0.15rem}
//   .title3{}
  .blank{background-color: white;margin-top: 10px;padding-left: 15px;padding-top:10px;padding-right: 15px;}
  .blank1{background-color: white;padding-left: 10px;padding-top:10px;padding-right: 15px;}
</style>