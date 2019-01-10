<template>
  <div>
      <md-loading :loading="loading"></md-loading>
  </div>
</template>
<script>
import qs from 'qs'
import axios from 'axios'
import Login from '../views/Login';
export default { 
    components:{'app-login':Login},
    data() {
        return {
            loading:0,
        }
    },
    async mounted(){
        
    },
    async created(){
        this.loading=1;
        let usercode = this.$route.query.userCode
        let secret = this.$route.query.secret;
        let pbuid = this.$route.query.pbuid;
        let pmenuid = this.$route.query.pmenuid;
        let title = this.$route.query.title;
        let timestamp = this.$route.query.timestamp;
        let cc =  await  this.loginRemote(usercode,secret,timestamp)
        // location.reload();//刷新 
        if (cc.data.id === 0) {
            console.log("单点登录成功！")
            this.loading=0;
            this.$emit('blankLogin');
            if(pbuid == 'index'){
                await this.$router.push(`/index?othersys=1`) 
            }else{
                await this.$router.push(`/layoutui?pbuid=${pbuid}&pmenuid=${pmenuid}&title=${title}&othersys=1`) 
            }
        }else{
            await this.$router.push(`/`)
        }
    },
    methods: {
        loginSuccess(res) {
            if (res.data.id === 0) {
                var userI = res.data.data.user;
                var mlist = res.data.data.menulist;
                var snkey = res.data.data.snkey;
                window.sessionStorage.setItem('user', JSON.stringify(userI));
                window.sessionStorage.setItem('menulist', JSON.stringify(mlist));
                window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
                this.$emit('emitLogin');
                // this.$notify.success({content: '成功登陆'}) ;
            } else {
                this.$notify.danger({content: res.data.message})
            }
        },
        async loginRemote(usercode,secret,timestamp) {
            var logindata = {
                apiId: global.APIID_SINGLELOGIN,
                dbid: global.DBID,
                usercode: usercode,
                timestamp:timestamp,
                secret: secret
            }
            try{
                var res = await this.getDataByAPINew(logindata);
                this.loginSuccess(res);
                return res;
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
