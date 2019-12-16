<template>
    <div style="background-color: #F5F5F5;">
        <div style="height: 100%;overflow: auto;">
            <div class="top">
                <div class="imgDiv">
                    <img src="../../img/bip.png"/>
                </div> 
                <div style="width:100%;text-align:center;">{{user.userName}}</div>
            </div>
            <div class="center">
                <md-list style="padding: 0px;">
                    <md-list-item>
                        账户编码：{{user.userCode}}
                    </md-list-item>
                    <md-list-item style="border-top: 1px solid #DFDFDF;">
                        隶属部门：{{user.deptInfo.cmcName}}
                    </md-list-item>
                </md-list>
            </div>
            <div class="center">
                <md-list style="padding: 0px;">
                    <!-- <md-list-item>
                        <span>我的企业</span>
                        <md-list-expand>
                            <ul style="padding-left:.16rem;border-top: 1px solid #DFDFDF;">
                                <template  v-for="(item,index) in scm" >
                                    <li :key="index" class="scm"
                                    :style="item.orgcode.startsWith(user.deptInfo.cmcCode)?'color:#2384DD;':''"
                                    v-on:click ="switchScm(item.secret)">
                                        <img src="../../img/bip.png"/> 
                                        <span style="padding-left:.16rem;">{{item.orgname}}</span> 
                                    </li>
                                    <hr class="scmhr" />
                                </template>
                                <li class="scm" v-on:click="creageSCM" style="text-align: center;line-height: 40px;">
                                    <md-icon style="color:#2384DD">add</md-icon>添加企业
                                </li>
                            </ul> 
                        </md-list-expand>
                    </md-list-item> -->
                </md-list>
            </div>
            <!-- <div class="center">
                <md-list style="padding: 0px;">
                    <md-list-item @click.native="mySetting">
                        个人设置
                    </md-list-item>
                </md-list>
            </div> -->
            <div class="center">
                <md-list style="padding: 0px;">
                    <md-list-item @click.native="logout">
                        退出
                    </md-list-item>
                </md-list>
            </div>
            <!-- <div class="center">
                <md-list style="padding: 0px;">
                    <md-list-item @click.native="pay">
                        支付测试
                    </md-list-item>
                </md-list>
            </div> -->
        </div>
        <md-dialog ref="dialog"  class="md-refs-dialog">

        </md-dialog>
    </div>
</template>
<script>
import qs from 'qs'
import axios from 'axios'
import Login from '../../views/Login';
const ICONS = ['menu', 'dashboard', 'verified_user', 'videogame_asset','assessment','invert_colors', 'cloud_download']
const ICONCOLOR=[{color:'red-700-0.8'},{color:'green'},{color:'indigo'},{color:'blue-700-0.8'},{color:'lime'},{color:'teal'},,{color:'green-600-0.5'}]

export default { 
    components:{'app-login':Login}, 
    data() {
        return {
            user:null,
            scm:[],
        }
    },
    async mounted(){ 
    },
    async created(){
        this.user = JSON.parse(window.sessionStorage.getItem('user'));
        this.scm = JSON.parse(window.sessionStorage.getItem("AffiliatedCompany"));
        if(!this.scm || this.scm.length ==0){
            this.getUserAllScm(this.user.userCode)
        }
    },
    methods: {
        creageSCM(){
            wx.miniProgram.navigateTo({url: '/pages/registered/create/registered'})
        },
        switchScm(secret){
            wx.miniProgram.navigateTo({url: '/pages/web/web?secret=' + secret})
        },
        logout(){
            if (dd.env.platform !="notInDingTalk") {
                dd.biz.navigation.close({
                    onSuccess : function(result) {},
                    onFail : function(err) {}
                })
            }else{
                wx.miniProgram.navigateTo({url: '/pages/logout/logout'})
            }
        },
        pay(){
            let time = new Date().getTime();
            let tkid = 'TK'+time;
            let sid = 'ZF'+time;
            wx.miniProgram.navigateTo({url: '/pages/pay/pay?sid='+sid+'&tkid='+tkid+'&money=1'})
        },
        mySetting(){
            this.$refs['dialog'].open();
        },
        async getUserAllScm(userCode){
            var logindata = {
                apiId: global.APIID_USERALLSCM,
                dbid: global.DBID,
                usercode: userCode,
            }
            try{
                var res = await this.getDataByAPINew(logindata);
                console.log(res)
                if(res.data.id ==0){
                    this.scm = res.data.data.scm;
                    if(this.scm.length>0){
                        window.sessionStorage.setItem("AffiliatedCompany",JSON.stringify(this.scm));
                    } 
                }
            }catch(e){
                console.log(e)
                this.$notify.danger({content: '系统连接错误！！'});
            }
        },
    },
    watch: { 
    }
}
</script> 
<style lang="scss" scoped>
    .imgDiv{
        width: 100%;
        text-align: center;
        height: 70px;
        line-height: 70px;
        img{
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
    }
    .top{
        background-color: white;
        padding-bottom: 10px;
    }
    .center{
        margin-top: 10px
    }
    .scm{
        text-align:start;
        list-style:none;
        height:40px;
        margin: 10px 0px;
    } 
    .scmhr{
        margin: 0px;
        margin-left: .5rem;
    }
</style>