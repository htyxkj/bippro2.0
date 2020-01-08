<template>
    <div style="background-color:#f6f6f6"> 
        <div style="height: 100%;overflow: auto;background-color: white;">
            <md-tabs md-fixed :md-dynamic-height="false" class="myMobileMTTabs">
                <md-tab md-label="待办" class="oneTab" :style="bdj ==false?'height: 100%':'padding:0px;height: 100%'"> <!--  md-icon="work"  -->
                    <template v-if="!bdj"> 
                        <template v-if="taskValues.length>0">
                            <template v-for="(row,index1) in taskValues">
                                <md-card  style="margin-bottom: 20px;box-shadow: rgba(226, 226, 226, 0.54) 0px 0px 10px;">
                                    <md-card-expand>
                                        <md-card-header> 
                                            <md-layout v-for="(item,index2) in taskLayCel.cels" :key="item.id"> 
                                                <md-layout  :md-numeric="item.type===3" v-if="item.isShow"  style="border-bottom: 1px solid #DDDDDD;"  md-gutter  md-flex ="100" :md-gutter="16">
                                                    <md-layout md-flex ="35" class="title11" >{{item.labelString}}</md-layout>
                                                    <md-layout md-flex ="65">
                                                    <md-bip-ref :inputValue="row[item.id]" :bipRefId="item" :md-numeric="item.type === 3" :modal="row"></md-bip-ref>
                                                    </md-layout>
                                                </md-layout>
                                            </md-layout>
                                            <md-layout  md-gutter  md-flex ="100" :md-gutter="16"> 
                                                <md-layout md-flex ="100" md-align="center">
                                                    <button type="button" class="small-btn" style="width:100%;background-color:#278FEF;color:white;" @click="rowClick(row,0)">{{$t('bipmsg.btnView')}}</button>
                                                </md-layout>
                                            </md-layout>
                                        </md-card-header> 
                                    </md-card-expand>
                                </md-card>
                            </template>
                            <md-table-pagination style="background-color: white;" :md-size="taskPageInfo.size"
                                :md-total="taskPageInfo.total" :md-page="taskPageInfo.page" :md-label="$t('commInfo.Per')"
                                md-separator="/" :md-page-options="[10,20, 30, 50]" @pagination="onTablePagination" >
                            </md-table-pagination> 
                        </template>
                        <template v-else>
                            <div style="text-align: center;">
                                <img style="width:65%" src="@/img/wxApplets/notask.png"/>
                            </div>
                            <div style="text-align: center;color:#888888;font-size: 16px;">
                                暂无任务
                            </div>
                        </template>
                    </template>
                    <template v-if="bdj">
                        <md-bip-task-applet v-if="ds_m" :dsm="ds_m" :dsext="ds_ext" :opera="opera" @gotask="gotask(0)"></md-bip-task-applet>
                    </template>
                </md-tab> 
                <md-tab md-label="已办" class="oneTab" :style="doBdj ==false?'height: 100%;padding-top: 0px;':'padding:0px;height: 100%'"> <!--  md-icon="work"  -->
                    <template v-if="!doBdj"> 
                        <md-layout>
                            <md-layout md-flex ="65" style="font-size: 20px;line-height: normal;">查询条件</md-layout>
                            <md-layout md-flex ="35">
                                <button type="button" class="small-btn" style="width:100%;background-color:#278FEF;color:white;" @click="showTaskDoTj = !showTaskDoTj">
                                    <template v-if="!showTaskDoTj">
                                        显示
                                    </template>
                                    <template v-else>
                                        隐藏
                                    </template>
                                </button>
                            </md-layout>
                        </md-layout>
                        <md-layout v-if="taskDoTj && showTaskDoTj">
                            <md-bip-input :dsm="taskDoTj" v-for="cell in taskDoTj.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="taskDoTj.currRecord" :btj="false" class="bip-input"></md-bip-input>
                            <button type="button" class="small-btn" style="width:100%;background-color:#278FEF;color:white;" @click="getTask_DO">查找</button>
                        </md-layout>
                        
                        <template v-if="taskDoValues.length>0">
                            <template v-for="(row,index1) in taskDoValues">
                                <md-card  style="margin-bottom: 20px;box-shadow: rgba(226, 226, 226, 0.54) 0px 0px 10px;">
                                    <md-card-expand>
                                        <md-card-header> 
                                            <md-layout v-for="(item,index2) in taskDoCel.cels" :key="item.id"> 
                                                <md-layout  :md-numeric="item.type===3" v-if="item.isShow"  style="border-bottom: 1px solid #DDDDDD;"  md-gutter  md-flex ="100" :md-gutter="16">
                                                    <md-layout md-flex ="35" class="title11" >{{item.labelString}}</md-layout>
                                                    <md-layout md-flex ="65">
                                                    <md-bip-ref :inputValue="row[item.id]" :bipRefId="item" :md-numeric="item.type === 3" :modal="row"></md-bip-ref>
                                                    </md-layout>
                                                </md-layout>
                                            </md-layout>
                                            <md-layout  md-gutter  md-flex ="100" :md-gutter="16"> 
                                                <md-layout md-flex ="100" md-align="center">
                                                    <button type="button" class="small-btn" style="width:100%;background-color:#278FEF;color:white;" @click="rowClick(row,1)">{{$t('bipmsg.btnView')}}</button>
                                                </md-layout>
                                            </md-layout>
                                        </md-card-header> 
                                    </md-card-expand>
                                </md-card>
                            </template>
                            <md-table-pagination style="background-color: white;" :md-size="taskDoPageInfo.size"
                                :md-total="taskDoPageInfo.total" :md-page="taskDoPageInfo.page" :md-label="$t('commInfo.Per')"
                                md-separator="/" :md-page-options="[10,20, 30, 50]" @pagination="taskDoPageChange" >
                            </md-table-pagination> 
                        </template>
                        <template v-else>
                            <div style="text-align: center;">
                                <img style="width:65%" src="@/img/wxApplets/notask.png"/>
                            </div>
                            <div style="text-align: center;color:#888888;font-size: 16px;">
                                暂无任务
                            </div>
                        </template>
                    </template>
                    <template v-if="doBdj">
                        <md-bip-task-applet v-if="ds_m" :dsm="ds_m" :dsext="ds_ext" :opera="opera" @gotask="gotask(1)"></md-bip-task-applet>
                    </template>
                </md-tab> 
                <md-tab md-label="消息" class="oneTab"> <!--  md-icon="notifications_none" -->
                    <template v-if="msgs && msgs.length>0">
                        <template v-if="!msgDetails">
                            <template v-for="(row,index) in msgs">
                                <md-layout>
                                    <md-card  style="margin-bottom: 20px;    box-shadow: rgba(226, 226, 226, 0.54) 0px 0px 10px;">
                                        <md-card-expand>
                                            <md-card-header> 
                                                <md-layout  md-gutter  md-flex ="100" :md-gutter="16"> 
                                                    <md-layout md-flex ="35" class="title11" >{{$t('bipmsg.head.sid')}}</md-layout>
                                                    <md-layout md-flex ="65">
                                                        {{(msgPageInfo.page-1)*msgPageInfo.size+index+1}}
                                                    </md-layout>
                                                </md-layout>
                                                <md-layout  md-gutter  md-flex ="100" :md-gutter="16"> 
                                                    <md-layout md-flex ="35" class="title11" >{{$t('bipmsg.head.title')}}</md-layout>
                                                    <md-layout md-flex ="65">
                                                        {{row.title}}
                                                    </md-layout>
                                                </md-layout>
                                                <md-layout  md-gutter  md-flex ="100" :md-gutter="16"> 
                                                    <md-layout md-flex ="35" class="title11" >{{$t('bipmsg.head.time')}}</md-layout>
                                                    <md-layout md-flex ="65">
                                                        {{row.dmake}}
                                                    </md-layout>
                                                </md-layout>
                                                <md-layout  md-gutter  md-flex ="100" :md-gutter="16"> 
                                                    <md-layout md-flex ="35" class="title11" >{{$t('bipmsg.head.state')}}</md-layout>
                                                    <md-layout md-flex ="65">
                                                        {{getStatus(row.brd)}}
                                                    </md-layout>
                                                </md-layout>
                                                <md-layout  md-gutter  md-flex ="100" :md-gutter="16"> 
                                                    <md-layout md-flex ="100" md-align="center">
                                                        <button type="button" class="small-btn" @click="view(index)">{{$t('bipmsg.btnView')}}</button>
                                                        <button type="button" class="small-btn md-btn" @click="del(index)">{{$t('bipmsg.btnDel')}}</button>
                                                    </md-layout>
                                                </md-layout>
                                            </md-card-header> 
                                        </md-card-expand>
                                    </md-card>                            
                                </md-layout>
                            </template>                
                            <md-table-pagination style="background-color: white;" :md-size="msgPageInfo.size" :md-total="msgPageInfo.total" :md-page="msgPageInfo.page" :md-label="$t('commInfo.Per')" md-separator="/" :md-page-options="[5, 10,15, 25, 50]" @pagination="onPagination" class="flex"></md-table-pagination>
                        </template>
                        <template v-else>
                            <md-layout style="border-bottom: 1px solid #DDDDDD;"  md-gutter  md-flex ="100" :md-gutter="16">
                                <md-layout md-flex ="35" class="title11" >标题</md-layout>
                                <md-layout md-flex ="65">
                                    {{msgs[msgIndex].title}}
                                </md-layout>
                            </md-layout>
                            <md-layout style="border-bottom: 1px solid #DDDDDD;"  md-gutter  md-flex ="100" :md-gutter="16">
                                <md-layout md-flex ="35" class="title11" >时间</md-layout>
                                <md-layout md-flex ="65">
                                    {{msgs[msgIndex].dmake}}
                                </md-layout>
                            </md-layout>
                            <md-layout style="border-bottom: 1px solid #DDDDDD;"  md-gutter  md-flex ="100" :md-gutter="16">
                                <md-layout md-flex ="35" class="title11" >状态</md-layout>
                                <md-layout md-flex ="65">
                                    {{getStatus(msgs[msgIndex].brd)}}
                                </md-layout>
                            </md-layout>
                            <md-layout md-gutter  md-flex ="100" :md-gutter="16">
                                <md-layout md-flex ="35" class="title11" >内容</md-layout>    
                            </md-layout>
                            <md-layout md-gutter  md-flex ="100" :md-gutter="16"> 
                                <textarea class="area-inner" readonly v-model="msgs[msgIndex].content"></textarea>
                            </md-layout>
                            <md-layout md-gutter md-flex ="100" :md-gutter="16">
                                <md-layout md-flex ="50" md-align="end" style="padding:0px;">
                                    <md-button class="md-raised md-primary" style="width:100%" @click="upStat(msgIndex)">已读</md-button>
                                </md-layout>
                                <md-layout md-flex ="50" style="padding:0px;">
                                    <md-button class="md-raised" style="width:100%" @click="msgDetails = !msgDetails">取消</md-button>
                                </md-layout>
                            </md-layout>
                        </template>
                    </template>
                    <template v-else>
                        <div style="text-align: center;">
                            <img style="width:65%" src="@/img/wxApplets/nomsg.png"/>
                        </div>
                        <div style="text-align: center;color:#888888;font-size: 16px;">
                            暂无消息
                        </div>
                    </template>
                </md-tab>
            </md-tabs>
        </div>
        <md-loading :loading="loading"></md-loading>
    </div>
</template>
<script>
import Operation from "@/components/views/operation/operation";
import CDataSet from '@/components/views/classes/CDataSet';
import BillState from '@/components/views/classes/billState';
import Stomp from "stompjs";
const BIPTASK = "biptask";
export default { 
    data() {
        return {
            loading:0,
            words:'',
            msgs:[],
            msgPageInfo: {
                size: 10,
                page: 1,
                total: 0
            },


            taskLayCel: {},
            taskValues: [],
            taskPageInfo: {
                size: 20,
                page: 1,
                total: 0
            },
            showTaskDoTj:false,
            taskDoTj:null,
            taskDoCel:{},
            taskDoValues:[],
            taskDoPageInfo: {
                size: 20,
                page: 1,
                total: 0
            },
            opera: {},
            ds_m:{},
            ds_ext:[],
            menuList: JSON.parse(window.sessionStorage.getItem("menulist")),
            mparams:null,
            bdj: false,
            doBdj:false,
            userCode:JSON.parse(window.sessionStorage.getItem("user")).userCode,
            taskCli:null,
            isconnt: false,
            msgDetails:false,
            msgIndex:0,
        }
    },
    async mounted(){
        await this.getTaskDoTJ();
        this.getMsg();
        this.getTask_DO();
    },
    created() {
        this.fetchTaskData();
        // this.connectQ();
    },
    beforeDestroy(){
        // if(this.isconnt){
        //     this.disconnect();
        // }
    },
    methods: { 
    /********************* 我的消息开始 ****************/
        async getMsg(){
            var data1={
                snkey : JSON.parse(window.sessionStorage.getItem('snkey')),
                apiId : global.APIID_TA_MSG,
                tskim:global.APIID_TM_MSG_DTL,
                page:this.msgPageInfo.page,
                size:this.msgPageInfo.size
            };
            var res = await this.getDataByAPINew(data1);
            if(res.data.id==0){
                this.msgs = res.data.data.page.celData;
                this.msgPageInfo.page = res.data.data.page.currentPage;
                this.msgPageInfo.total = res.data.data.page.totalItem;
            }
        },
        view(index) {
            this.msgDetails = true;
            this.msgIndex = index;
            // var that =this
            // this.$msgDialog.open({ msgTitle: this.msgs[index].title,msgTM:this.msgs[index].dmake, msgStatus: this.getStatus(this.msgs[index].brd),msgContent:this.msgs[index].content,upStatus(){that.upStat(index)} })
        },
        //修改状态
        async upStat(index){
            // this.msgs[index].status = '已读'
            this.msgDetails = !this.msgDetails;
            var data1={
                snkey : JSON.parse(window.sessionStorage.getItem('snkey')),
                apiId : global.APIID_TA_MSG,
                tskim:global.APIID_TM_MSG_UPD,
                iid:this.msgs[index].iid,
                state:2
            };
            var res = await this.getDataByAPINew(data1);
            // console.log(res,'1111');
            if(res.data.id==0){
                this.msgs[index].brd = 2;
            }
            //更新数据状态
        },
        async del(index) {
            //删除
            var data1={
                snkey : JSON.parse(window.sessionStorage.getItem('snkey')),
                apiId : global.APIID_TA_MSG,
                tskim:global.APIID_TM_MSG_UPD,
                iid:this.msgs[index].iid,
                state:3
            };
            var res = await this.getDataByAPINew(data1);
            if(res.data.id==0){
                this.getMsg();
            }
        },
        onPagination(page) {
            if(this.msgPageInfo.size!=page.size){
                this.msgPageInfo.page = 1;
            }else{
                this.msgPageInfo.page = page.page;
            }
            this.msgPageInfo.size  = page.size;
            this.getMsg();
        },
        getStatus(id){
            if(id===1 || id==0){
                return this.$t('bipmsg.btnUnRead');
            }else{
                return this.$t('bipmsg.btnRead');
            }
        },
    /********************* 我的消息结束 ****************/

    /********************* 我的任务开始 ****************/
        gotask(type){
            if(type == 0)
            this.bdj = false;
            if(type == 1)
            this.doBdj = false;
        },
        disconnect() {
            this.taskCli.disconnect();
        },
        // connectQ: function() {
        //     console.log("//初始化mqtt客户端，并连接mqtt服务")
        //     //初始化mqtt客户端，并连接mqtt服务
        //     var ws = new WebSocket(global.MQTT_SERVICE);
        //     this.taskCli = Stomp.over(ws);
        //     var headers = {
        //         login: global.MQTT_USERNAME, //用户名
        //         passcode: global.MQTT_PASSWORD, //密码
        //         host: global.MQTT_HOST // 虚拟空间
        //     };
        //     this.taskCli.connect(headers, this.onConnected, this.onFailed);
        // },
        // onConnected: function(frame) {
        //     this.isconnt = true;
        //     // console.log("Connected: " + frame);
        //     //订阅频道
        //     var topic ="/exchange/" +BIPTASK +"/" + BIPTASK +"." +global.DBID +"." +this.userCode;
        //     this.taskCli.subscribe(topic, this.responseCallback);
        // },
        // responseCallback: function(frame) {
        //     if(!this.bdj)
        //         this.fetchTaskData();
        // },
        async fetchTaskData() {
            var data1 = {
                dbid: global.DBID,
                usercode: this.userCode,
                apiId: global.APIID_CELLPARAM,
                pcell: "SYRW",
                pdata: "",
                bebill: 1,
                currentPage: this.taskPageInfo.page,
                pageSize: this.taskPageInfo.size,
                cellid: ""
            };
            var res = await this.getDataByAPINew(data1);
            console.log(res);
            if (res.data.id == 0) {
                this.taskLayCel = await this.makeCellCL(res.data.data.layCels);
                this.taskValues = res.data.data.pages.celData;
                this.taskPageInfo.page = res.data.data.pages.currentPage;
                this.taskPageInfo.total = res.data.data.pages.totalItem;
                this.taskPageInfo.size = res.data.data.pages.pageSize;
            }
        },
        async rowClick(row,type) {
            // console.log(row);
            row.brd = 1;
            var pflow = row.buid;
            var data1 = {
                dbid: global.DBID,
                usercode: this.userCode,
                apiId: "buid",
                buid: pflow
            };
            var bb = await this.getDataByAPINewSync(data1);
            if (bb.data.id == 0) this.opera = new Operation(bb.data.data.opt);
            if (this.opera) {
                var menuid = this.opera.pmenuid;
                // var bb = this.getMenuById(this.menuList, menuid);
                // // console.log(bb);
                // // this.bdj = true;
                // if(bb)
                await this.fetchParams(pflow,menuid);
                // else
                // this.mparams = null;
                console.log(this.mparams)
                if(this.mparams){
                    await this.getCell();
                    var pdata = {};
                    pdata[this.opera.pkfld] = row.buno;
                    await this.fetchUIData(pdata);
                    if(this.ds_m.cdata.length>0){
                        if(type == 0){
                            this.bdj = true;
                        }else if(type ==1){
                            this.doBdj = true;
                        }
                    }else{
                        this.$notify.warning({content: '未找到原单！'});
                    }
                }
            }
        },
        async fetchUIData (pdata) {
            this.loading++;
            var data1 = {
                'dbid': global.DBID,
                'usercode': this.userCode,
                'apiId': global.APIID_FINDCELLDATA,
                'pcell': this.ds_m.pcell,
                'pdata': JSON.stringify(pdata),
                'bebill':  1,
                'currentPage': 1,
                'pageSize': 1,
                'cellid': ''
            }
            // console.log(data1);
            var res = await this.getDataByAPINewSync(data1);
            if(res.data.id==0){
                if(this.ds_m.cdata.length>0){
                this.ds_m.clearData();
                }
                _.forEach(res.data.data.pages.celData,row=>{
                row.sys_stated = BillState.HISTORY;
                this.ds_m.addRow(row);
                });
            }
            this.loading--;
        },
        setRowColor(_index) {
            _index = _index % 2;
            if (_index !== 0) {
                return true;
            }
            return false;
        },
        onTablePagination(page) {
            this.taskPageInfo.size = page.size;
            this.taskPageInfo.page = page.page;
            this.fetchTaskData();
        },
        getMenuById(menus, id) {
            var menu = null;
            for (let i = 0; i < menus.length; i++) {
                var item = menus[i];
                // console.log(item);
                if (item.menuId == id) {
                menu = item;
                } else {
                if (item.haveChild) {
                    menu = this.getMenuById(item.childMenu, id);
                }
                }
                if (menu) {
                break;
                }
            }
            return menu;
        },
        async fetchParams(pbuid,pmenuid) {
            var data1 = {
                dbid: global.DBID,
                usercode: this.userCode,
                apiId: global.APIID_MPARAMS,
                pbuid: pbuid,
                pmenuid: pmenuid
            };
            if (pbuid && pmenuid) {
                //var bb = await this.getDataByAPINew(data1,this.getCallBack,this.getCallError);
                var res = await this.getDataByAPINewSync(data1);
                // console.log(res);
                if (res.data.id == 0) {
                this.mparams = res.data.data.mparams;
                } else {
                // console.log(res);
                this.$notify.warning({
                    content: res.data.message,
                    placement: "mid-center"
                });
                }
            }
        },
        async getCell(){
            var pcell = this.mparams.pcell;
            var data1 = {
            'dbid': global.DBID,
            'usercode': this.userCode,
            'apiId': global.APIID_CELLPARAMS,
            'pcell': pcell
            }
            var res = await this.getDataByAPINewSync(data1);
            var data = res.data;
            if(data.id===0){
                var cells = data.data.layCels;
                const celL = cells.length;
                if(celL==1){
                var cells0 = cells[0];
                cells0 = await this.makeCellCL(cells0);
                this.ds_m = new CDataSet(cells0);
                this.ds_m.setPcell(pcell);
                }else{
                var cells0 = await this.makeCellCL(cells[0]);
                this.ds_m = new CDataSet(cells0);
                this.ds_m.setPcell(pcell);
                for(var i=0;i<celL-2;i++){
                    var cellsi = await this.makeCellCL(cells[i+1]);
                    var ds = new CDataSet(cellsi);
                    this.ds_ext[i] = ds;
                }
                }
            }else{
                this.$notify.warning({content: data.message,placement:'mid-center'});
            }
        },
    /********************* 我的任务结束 ****************/

    /********************* 我的已办开始 ****************/
        
        async getTask_DO(){
            let pdata = this.taskDoTj.currRecord;
            pdata = JSON.stringify(pdata)
            var data1 = {
                dbid: global.DBID,
                usercode: this.userCode,
                apiId: global.APIID_CELLPARAM,
                pcell: "INSSPLIST",
                pdata: pdata,
                bebill: 1,
                currentPage: this.taskDoPageInfo.page,
                pageSize: this.taskDoPageInfo.size,
                cellid: ""
            };
            var res = await this.getDataByAPINew(data1);
            console.log(res);
            if (res.data.id == 0) {
                this.taskDoCel = await this.makeCellCL(res.data.data.layCels);
                this.taskDoValues = res.data.data.pages.celData;
                this.taskDoPageInfo.page = res.data.data.pages.currentPage;
                this.taskDoPageInfo.total = res.data.data.pages.totalItem;
                this.taskDoPageInfo.size = res.data.data.pages.pageSize;
            }
            // let data2 = {  
            //     dbid: global.DBID,
            //     usercode: this.userCode,
            //     apiId: global.APIID_AIDO, 
            //     page:1,
            //     assistid: 'V_INSTASK_DO', //辅助名称
            //     currentPage:this.taskDoPageInfo.currentPage,  //页数
            //     pageSize: this.taskDoPageInfo.pageSize,//每页条数
            //     cont: ""
            // };
            // let cont = "~frusr = '"+this.userCode+"'"
            // data2.cont = cont;
            // this.getDataByAPINewSync(data2).then((res)=>{ 
            //     console.log(res)
            //     if(res.data){
            //         this.taskDoPageInfo.size=res.data.size
            //         this.taskDoPageInfo.total=res.data.total
            //     }
            //     if(res.data.values){
            //         this.taskDoValues = res.data.values;
            //     }
            // });
        },
        taskDoPageChange(page) {
            if(this.taskDoPageInfo.size!=page.size){
                this.taskDoPageInfo.page = 1;
            }else{
                this.taskDoPageInfo.page = page.page;
            }
            this.taskDoPageInfo.size  = page.size;
            this.getTask_DO();
        },
        async getTaskDoTJ(){
            var data1 = {
            'dbid': global.DBID,
            'usercode': this.userCode,
            'apiId': global.APIID_CELLPARAMS,
            'pcell': 'INSSPLISTTJ'
            }
            var res = await this.getDataByAPINewSync(data1);
            var data = res.data;
            if(data.id===0){
                var cells = data.data.layCels;
                const celL = cells.length;
                if(celL==1){
                    var cells0 = cells[0];
                    cells0 = await this.makeCellCL(cells0);
                    this.taskDoTj = new CDataSet(cells0);
                    this.taskDoTj.createRecord();
                }
            }
        }
    /********************* 我的已办结束 ****************/

    },
    watch: { 

    }
}
</script> 
<style lang="scss">
.myMobileMTTabs{
    height:100%;
    .md-tabs-content{
        height: 100% !important;
    }
}
</style>
<style lang="scss" scoped>
.md-card .md-card-content:last-child {
  padding-bottom: 0rem; 
}
.title11{
  color: #828282
}   
.small-btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #bfcbd9;
  color: #1f2d3d;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  padding: 7px 9px;
  font-size: 12px;
  border-radius: 4px;
}

.md-btn {
  color: #fff;
  background-color: #ff4949;
  border-color: #ff4949;
  margin-left: 10px;
}
.area-inner {
    max-height: 3.2rem;
    height: 1.2rem;
    width: 100%;
}
</style>