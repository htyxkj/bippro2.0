<template>
    <div class="contentBar">
        <div :class="contentA">
            <div class="content-area">
                <h3>飞机飞行数据同步</h3>
                <div class="c-area">
                    <md-layout md-row md-gutter="16">
                    <md-layout md-flex="15" md-flex-xsmall="30">
                        <label class="area-label">任务标识</label>
                    </md-layout>
                    <md-layout md-flex="85" md-flex-small="85"> 
                        <md-bip-input-ref  :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-ref>
                    </md-layout>
                    </md-layout>
                </div>
                <div class="c-area"> 
                    <md-layout md-row md-gutter="16">
                        <md-layout md-flex="15" md-flex-xsmall="30">
                            <label class="area-label">账户标识</label>
                        </md-layout>
                        <md-layout md-flex="85" md-flex-xsmall="70">
                            <md-input-container>
                                <label for="plane">账户标识</label> 
                                <md-input :required="true" v-model="planeVal"></md-input>
                            </md-input-container> 
                        </md-layout>
                    </md-layout>  
                </div>
                <div class="c-area">
                    <md-layout md-row md-gutter="16">
                        <md-layout md-flex="15" md-flex-xsmall="30">
                            <label class="area-label">起始时间</label>
                        </md-layout>
                        <md-layout md-flex="85" md-flex-xsmall="70">
                            <md-input-container>
                            <label for="plane">起始时间</label> 
                            <!-- <md-date :btime="true" v-model="startTime"></md-date> -->
                            <md-bip-date v-model="startTime" :value="startTime" :isReport="false" :cell="sTCell" :required="sTCell.isReq" :disabled="false" ></md-bip-date> 
                            </md-input-container>
                        </md-layout>
                    </md-layout>
                </div>
                <div class="c-area">
                    <md-layout md-row md-gutter="16">
                        <md-layout md-flex="15" md-flex-xsmall="30">
                            <label class="area-label">结束时间</label>
                        </md-layout>
                        <md-layout md-flex="85" md-flex-xsmall="70">
                            <md-input-container>
                            <label for="plane">结束时间</label> 
                            <!-- <md-date :btime="true" v-model="endTime"></md-date> -->
                            <md-bip-date v-model="endTime" :value="endTime" :isReport="false" :cell="sTCell" :required="sTCell.isReq" :disabled="false" ></md-bip-date> 
                            </md-input-container>
                        </md-layout>
                    </md-layout>
                </div>
                <div class="mybtn">
                    <md-button class="md-primary md-raised" style="margin-right: 20px;" @click="Synchronize('Synchronize')">同步</md-button>
                    <md-button class="md-primary md-raised" style="margin-left:20px" @click="Synchronize('delete')">删除数据</md-button>
                </div>
                <md-loading :loading="loading"></md-loading>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
    data(){
        return{ 
            startTime:'',
            endTime:'',
            planeno:'',
            planeVal:'',
            taskno:'',
            contentA:'contentA',
            contentB:'contentB',
            loading:0,
            tasks:[],
            cmcCode : '',//JSON.parse(window.sessionStorage.getItem('user')).deptInfo.cmcCode,
            snkey :JSON.parse(window.sessionStorage.getItem('snkey')),
            modal:{
                sid:'',
            },
            cell:{
                editName:"TKMSG",
                editType:0,
                id:"sid",
                index:0,
                isReq:true,
                labelString:"任务标识",
                refValue:"{&TKMSG}",
            },
            param:{
                apiId: "assisto",
                dbid: `${global.DBID}`,
                usercode: JSON.parse(window.sessionStorage.getItem('user')).userCode, 
                page:1,
                assistid: null,
                cont:null,
            },
            //开始时间
            sTCell:{   
                editName: "DATETIME", 
                id: "startTime", 
                isReq: true, 
            }, 
            //结束时间
            eTCell:{  
                editName: "DATETIME", 
                id: "endTime", 
                isReq: true, 
            }, 
        }
    },  
    methods: {
        dataChange(data){
            this.taskno=data.value[data.cellId]
            this.startTime = data.value['bgtime'];
            this.endTime = data.value['edtime'];
        },
        Synchronize(operating){
            if(this.taskno==null||this.taskno==''){
                 this.$notify.warning({content:'任务标识不能为空'})
                 return;
            }
            if(this.startTime==null||this.startTime==''){
                 this.$notify.warning({content:'起始时间不能为空'})
                 return;
            }
            if(this.endTime==null||this.endTime==''){
                 this.$notify.warning({content:'结束时间不能为空'})
                 return;
            }

            this.loading = 1
            let snkey = JSON.parse(window.sessionStorage.getItem('snkey'))
            let params={snkey:snkey,stateTime:this.startTime,endTime:this.endTime,taskNo:this.taskno,usernumber:this.planeno,operating:operating}
            axios.post(`${global.BIPAPIURL}SynchronizeServlet`,qs.stringify(params))
            .then(res=>{
                if(parseInt(res.data.key) == 0){
                    this.$notify.success({content:res.data.msg}) 
                }else{
                    this.$notify.danger({content:res.data.msg})
                }
                this.loading=0
            })
            .catch(err=>{
                this.loading=0
                this.$notify.danger({content:'同步出错！'})
                console.log(err)
            }) 
        },   
        //获取任务对应的 用户标识
        getAirId(){
            let taskno = this.taskno
            let param = this.param;
            param.assistid="GETUSERTASK";
            param.cont="~t.sid ='"+taskno+"'";
            axios.post(global.BIPAPIURL+global.API_COM, qs.stringify(param)).then(res => {
                this.planeno=res.data.values[0].usrcode;
                this.planeVal=res.data.values[0].usrname;
            });
        }, 
    },
    
    created(){ 
        let usrCode = JSON.parse(window.sessionStorage.getItem('user')).userCode
        if(usrCode == 'admin'){
        this.cmcCode =2;
        }else{
        this.cmcCode = usrCode.substring(0,6)
        }
    },
    watch:{
        'taskno':function(){
            this.getAirId() 
        }, 
    }
}
</script>
 
<style lang="scss" scoped>
.contentBar{
    width:100%;
    background-color: #f0f3f4;
    overflow: hidden;
    .contentA{
        width: 11rem;
        margin: .1rem auto;
        height:100%;
        border:1px solid #d1dbe5;
        border-radius: 4px;
        background-color: #fff;
        overflow: hidden;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
        .content-area{
            h3{
                text-align: center;
            }
            width: 90%;
            margin:0 auto;
        }
    }
    .contentB{
        height:100%;
        border:1px solid #d1dbe5;
        border-radius: 4px;
        background-color: #fff;
        overflow: hidden;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
        .content-area{
            h3{
                text-align: center;
            }
            width: 90%;
            margin:0 auto;
        }
    }
}
.c-area{
    position: relative;
}
.area-label{
    position: absolute;
    top: 45%;
    bottom: 55%;
}
.mybtn{
    text-align: center;
}
.md-button.md-icon-button{
  height:.24rem !important;
  line-height: .24rem;
}
.md-button{
  margin:0;
}

</style>