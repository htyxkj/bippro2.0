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
                <md-list>
                    <md-list-item>
                        账户编码：{{user.userCode}}
                    </md-list-item>
                    <md-list-item>
                        隶属部门：{{user.deptInfo.cmcName}}
                    </md-list-item>
                    <md-list-item>
                        <span>我的企业</span>
                        <md-list-expand>
                            <md-list>
                                <md-list-item class="md-inset" v-for="(item,index) in scm" :key="index" 
                                :style="item.orgcode== user.deptInfo.cmcCode?'color:red':''"
                                @click.native="switchScm(item.secret)">{{item.orgname}}</md-list-item>
                                <md-list-item class="md-inset" @click.native="creageSCM">创建企业/加入企业</md-list-item>
                            </md-list>
                        </md-list-expand>
                    </md-list-item>
                </md-list>
            </div>
        </div>
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
</style>