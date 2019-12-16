// import dd from '../../../../static/dingding/dingtalk.open.js';
export default {
    mounted() {
    },
    data() {
        return {
            menuList:[],
            ddApp:[],
            code:'',
            corpId:'', 
            appId:'',
            agentId:'',
            ddCfg:{},  
            dingMenuImg :`${global.BIPAPIURL}`,
            menuList:null,
            secret:null,
            route:null,
            appEmitLogin:null,
            appEmitNoLogin:null,
            jumpRoute:null,
        }
    },
    methods:{
        async mobileLogin(route,emitLogin,mobileNoLogin){
            this.route = route;
            this.appEmitNoLogin = mobileNoLogin;
            this.appEmitLogin = emitLogin;
            this.jumpRoute = this.route.query.jumpRoute;
            if (dd.env.platform !="notInDingTalk") {
                window.sessionStorage.setItem('isLoginPage', 2); 
                window.sessionStorage.setItem('isLoginType', 3); 
                await this.loginDD();
                return;
            }
            var ua = window.navigator.userAgent.toLowerCase();//获取判断用的对象
            let _this = this;
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                window.sessionStorage.setItem('isLoginPage', 3); 
                window.sessionStorage.setItem('isLoginType', 4); 
                wx.miniProgram.getEnv(function(res) {
                    if (res.miniprogram) {
                        _this.secret = _this.route.query.secret;
                        _this.loginWXRemote(_this.secret);
                    } else {
                        // 走不在小程序的逻辑
                        // alert("走不在小程序的逻辑2")
                    }
                }) 
            }else{
                // this.appEmitLogin();
                this.appEmitNoLogin();
            }
        },
        async loginDD(){
            dd.ui.webViewBounce.disable()
            var lid = window.sessionStorage.getItem('isLogin');
            if(lid){  
                console.log("登录成功！！")
            }else{
                this.corpId =this.route.query.corpId   //企业唯一码  
                this.appId = this.route.query.appId;   //默认00
                this.agentId = this.route.query.agentId;//应用id
                let ddConfig = {corpId:this.corpId,agentId:this.agentId,bipAppid:this.appId};
                window.sessionStorage.setItem('ddConfig', JSON.stringify(ddConfig)); 
                let _this =this;
                await dd.ready(function() {
                    dd.runtime.permission.requestAuthCode({
                        corpId: _this.corpId,
                        onSuccess: function(info) {
                            _this.loginDDRemote(info.code)
                            _this.getDDJSTicket(); 
                        },
                        onFail : function(err) { 
                            alert(JSON.stringify(err))
                            alert("系统错误，请联系管理员！")
                        }
                    });
                });
            }
        },
        async loginDDRemote(code) { 
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
            }catch(e){
                this.$notify.danger({content: '系统连接错误！！！'});
            }
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
                // //iOS 将左上角 返回按钮  改完关闭
                // dd.biz.navigation.setLeft({
                //     control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
                //     text: '关闭',//控制显示文本，空字符串表示显示默认文本
                //     onSuccess : function(result) {
                //         dd.biz.navigation.close({
                //             onSuccess : function(result) {},
                //             onFail : function(err) {}
                //         })
                //     },
                //     onFail : function(err) {
                //         alert(JSON.stringify(err));
                //     }
                // });
                // //安卓左上角返回按钮点击事件
                // document.addEventListener('backbutton', function(e) {
                //     // 在这里处理你的业务逻辑
                //     e.preventDefault(); //backbutton事件的默认行为是回退历史记录，如果你想阻止默认的回退行为，那么可以通过preventDefault()实现
                //     dd.biz.navigation.close({
                //         onSuccess : function(result) {},
                //         onFail : function(err) {}
                //     })
                // });
                dd.error(function(error){ 
                    alert('dd error: ' +JSON.stringify(error));
                });
                } 
            } 
        }, 
        async loginSuccess(res) {
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
                this.appEmitLogin(this.jumpRoute);
            } else {
                this.$notify.danger({content: res.data.message})
            }
        },


        async loginWXRemote(secret) { 
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
                this.$notify.danger({content: '系统连接错误！！'});
            }
        }, 
    }
}