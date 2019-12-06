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
                            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" md-align="center"> 
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
                    <md-layout  v-for="(item,index) in mu.childMenu" :key="index" md-flex-small="25" md-flex-medium="25" class="title2" v-if="item.menuattr !=4" >
                        <div v-on:click="url('/layoutui?'+item.command+'&title='+item.menuName)" style="margin:0px;padding:0px;width:100%">
                            <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="100" style="position: relative;">   
                                <!-- <md-icon  v-colors="item.iconcc">{{item.menuIcon}}</md-icon>  -->
                                <img :src="dingMenuImg+'img/ding/'+item.menuId+'.png'" style="margin:auto;width: 30px;height: 30px;"/>
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
import Login from '../views/Login';
import dd from '../../static/dingding/dingtalk.open.js';
const ICONS = ['menu', 'dashboard', 'verified_user', 'videogame_asset','assessment','invert_colors', 'cloud_download']
const ICONCOLOR=[{color:'red-700-0.8'},{color:'green'},{color:'indigo'},{color:'blue-700-0.8'},{color:'lime'},{color:'teal'},,{color:'green-600-0.5'}]

export default { 
    mixins:[indexChart],
    components:{'app-login':Login},
    data() {
        return {
            loading:0,
            menuList:[],
            ddApp:[],
            code:'',
            corpId:'', 
            appId:'',
            agentId:'',
            ddCfg:{},  
            dingMenuImg :`${global.BIPAPIURL}`,
        }
    },
    async mounted(){ 
    },
    async created(){ 
        dd.ui.webViewBounce.disable()
        window.sessionStorage.setItem('isLoginType', 3); 
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
            if(this.ddApp.length<=0){
                let dapp = window.sessionStorage.getItem('ddApp');
                if(dapp)
                this.ddApp = JSON.parse(dapp);
            }  
            this.getNumberofBadges(); 
            this.getDDJSTicket(); 
            this.getDateStr();   
        }else{  
            this.loading=1; 
            this.corpId =this.$route.query.corpId   //企业唯一码  
            this.appId = this.$route.query.appId;   //默认00
            this.agentId = this.$route.query.agentId;//应用id
 
            let ddConfig = {corpId:this.corpId,agentId:this.agentId,bipAppid:this.appId};
            window.sessionStorage.setItem('ddConfig', JSON.stringify(ddConfig)); 
            let _this =this;
            await dd.ready(function() {
        	    dd.runtime.permission.requestAuthCode({
        	        corpId: _this.corpId,
        	        onSuccess: function(info) {  
                        _this.loginRemote(info.code)
                        _this.getDDJSTicket(); 
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
                // let aa=[];
                // if(this.menuList)
                // for(var i =0;i<this.menuList.length;i++){
                //     if(this.menuList[i].haveChild == true){
                //         for(var j =0;j<this.menuList[i].childMenu.length;j++){
                //             var bb = Math.ceil(Math.random() * (ICONS.length-1));
                //             this.menuList[i].childMenu[j].iconcc= ICONCOLOR[bb]
                //             this.menuList[i].childMenu[j].menuIcon=ICONS[bb] 
                //         }
                //         aa.push(this.menuList[i]);
                //     }
                // }
                // this.menuList = aa;
                window.sessionStorage.setItem('user', JSON.stringify(userI));
                window.sessionStorage.setItem('menulist', JSON.stringify(this.menuList));
                window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
                window.sessionStorage.setItem('isLogin', true); 
                await this.getDApp();  
                this.getDateStr();  
                this.getNumberofBadges(); 
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
                appId:this.appId,
                agentId:this.agentId,
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
        },
        async getDDJSTicket(){ 
            let ddConfig = JSON.parse(window.sessionStorage.getItem('ddConfig'));  
            if(!ddConfig)
                return;
            let url =encodeURIComponent(window.location.href); 
            
            this.corpId = ddConfig["corpId"];
            this.agentId = ddConfig["agentId"]; 
            let bipAppid = ddConfig["bipAppid"]; 
            var data = {
                apiId: global.APIID_DDJSAPI_TICKET,
                dbid: global.DBID, 
                url:url, 
                agentId:this.agentId, 
                corpId:this.corpId,
                bipAppid:bipAppid,
            }  
            var res = await this.getDataByAPINew(data);   
            if(res.data.id != undefined){ 
                if(res.data.id == 0){
                this.ddCfg = JSON.parse(res.data.message);  
                let _this= this;  
                dd.ready(function() { 
                    dd.runtime.permission.requestAuthCode({
                        corpId: _this.corpId,
                        onSuccess: function(info) { 
                            dd.config({
                                agentId: _this.agentId, // 必填，微应用ID
                                corpId: _this.corpId,//必填，企业ID
                                timeStamp:_this.ddCfg.timeStamp, // 必填，生成签名的时间戳
                                nonceStr: _this.ddCfg.nonceStr, // 必填，生成签名的随机串
                                signature: _this.ddCfg.DDJSTICKET, // 必填，签名
                                type:0,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
                                jsApiList : [
                                    'biz.map.locate',
                                    'biz.map.view',
                                ] // 必填，需要使用的jsapi列表，注意：不要带dd。
                            }); 
                        },
                        onFail : function(err) {
                            alert('dd error: ' +JSON.stringify(error));
                        }
                    });
                }); 
                dd.error(function(error){ 
                    alert('dd error: ' +JSON.stringify(error));
                });
                } 
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