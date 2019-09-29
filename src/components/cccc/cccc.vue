<template>
    <div style="background-color:#f6f6f6"> 
        cccc
    </div>
</template>
<script> 
import qs from 'qs'
import axios from 'axios' 
const ICONS = ['menu', 'dashboard', 'verified_user', 'videogame_asset','assessment','invert_colors', 'cloud_download']
const ICONCOLOR=[{color:'red-700-0.8'},{color:'green'},{color:'indigo'},{color:'blue-700-0.8'},{color:'lime'},{color:'teal'},,{color:'green-600-0.5'}]

export default {  
    data() {
        return { 
        }
    },
    async mounted(){

    },
    async created(){ 
        this.loginRemote();
    },
    methods: { 
        /// 登录方法
        async loginRemote() { 
            var logindata = {
                apiId: global.APIID_OUTLOGIN,
                dbid: global.DBID,
                usercode: 'admin',//用户名
                ioutsys:1,//
            }
            try{
                var res = await this.getDataByAPINew(logindata);
                // console.log(res)
                // this.save();//对象保存
                // this.getasid();//辅助查值
                // await this.getCell();
                // this.getCellData();//对象查询
                // this.upPwd();
                // this.getSMSCode();
                // this.checkCode();
                var userI = res.data.data.user;
                var mlist = res.data.data.menulist;
                var snkey = res.data.data.snkey;
                window.sessionStorage.setItem('user', JSON.stringify(userI));
                window.sessionStorage.setItem('menulist', JSON.stringify(mlist));
                window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
                this.getCL();
                console.log(JSON.parse(window.sessionStorage.getItem("user")))  // 获取用户信息
                return res;
            }catch(e){
                console.log(e)
                this.$notify.danger({content: '系统连接错误！！'});
            }
        },
        // 对象保存
        save(){
            let jsonstr = {cbm:'111111',cmc:'2222222222222222',ctype:1}; //对象字段信息
            ///主键  是按对象设置生成
            var data1 = {
                "dbid": `${global.DBID}`,
                "usercode":"admin",
                "apiId": "savedata", 
                "pcell": '5003',// 对象标识
                "jsonstr":JSON.stringify(jsonstr),
                "datatype":1,
            };
            
            let _this =this; 
            axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
                console.log(res.data)
                if(res.data.id==0){
                    _this.$notify.success({content:'保存成功'}) 
                }else{
                    _this.$notify.danger({content:'保存失败'})
                }
            }) .catch(err=>{
                console.log(err)
                _this.$notify.danger({content:'系统故障！'})
                _this.loading=0;
            })  
        },

        // 辅助调用  查询
        getasid(){
            let data2 = {  
                dbid: global.DBID,
                usercode: 'admin',
                apiId: global.APIID_AIDO, 
                page:1,
                assistid: 'CDICALL', //辅助名称
                currentPage:1,  //页数
                pageSize: 2,//每页条数
                cont: "100100002"
            };
            //(cbm like '%100100002%' or cmc like '%100100002%')    没有~做全局匹配   所有字段  like 这个值
            //  有~    就是  SQL语句
            //

            this.getDataByAPINewSync(data2).then((res)=>{ 
                    console.log(res)
            });
        },
        //查询对象
        async getCell(){
            var data1 = {
            'dbid': global.DBID,
            'usercode': 'admin',
            'apiId': global.APIID_CELLPARAMS,
            'pcell': '5003' //对象标识
            }
            var res = await this.getDataByAPINewSync(data1);
            var data = res.data;
            console.log(res)
            if(data.id===0){
                var cells = data.data.layCels; 
            }else{
                this.$notify.warning({content: data.message,placement:'mid-center'});
            }
        },
        // 调用对象查询   数据查询
        async getCellData(){
            let pdata={smake: "10001100001"}   //条件项
            var data1 = {
                'dbid': global.DBID,
                'usercode': 'admin',
                'apiId': global.APIID_FINDCELLDATA,
                'pcell':'5003',
                'pdata': JSON.stringify(pdata),
                'bebill':  1,
                'currentPage': 1,   //
                'pageSize': 200,   //
                'cellid': ''
            }
            // console.log(data1);
            var res = await this.getDataByAPINewSync(data1);
            console.log(res);
        },
        async upPwd(){
            var uppwddata = {
                apiId: global.APIID_UPMYPWD,
                dbid: global.DBID,
                usercode: 'admin',//需要修改密码的用户
                oldPwd: this.base64Encode("system1"),
                newPwd: this.base64Encode("system"),
            } 
            var res = await this.getDataByAPINew(uppwddata);
            console.log(res)
        },
        //发送验证码
        async  getSMSCode(){
            var returnobj = null;
            const url = "http://www.bip-soft.com:8080/ssms/xcode";
            let posParams = {tels:13051424475,title:'华泰益兴科技',fhxcode:0};
            //tels=13051424475&title=华泰益兴科技&fhxcode=0
            returnobj = await axios.post(url, qs.stringify(posParams))
                .then(res=>{
                console.log(res);
            })
            .catch(err=>{
                console.log(err)
            })
            console.log(returnobj)
            return returnobj;
        
        },
        //验证验证码
        async checkCode(){
            var returnobj = null;
            const url = "http://www.bip-soft.com:8080/ssms/ckxcode";
            let posParams = {tels:13051424475,xcode:10477};
            //tels=13051424475&title=华泰益兴科技&fhxcode=0
            returnobj = await axios.post(url, qs.stringify(posParams))
                .then(res=>{
                console.log(res);
            })
            .catch(err=>{
                console.log(err)
            })
            console.log(returnobj)
            return returnobj;
        
        },
        //获取常量数据
        async getCL(){
            var cc = await this.getCLByAPI(
                {
                    'assistid':'{$D.KND}',
                    'usercode':'admin',
                }
            );
            console.log(cc)
        }
    },
    watch: { 

    }
}
</script> 
<style lang="scss" scoped> 
</style>