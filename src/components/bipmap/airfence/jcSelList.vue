<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button @click.native="getJcMsg()">查询</md-button>
      </md-part-toolbar-group> 
      <md-part-toolbar-group>
        <md-button @click.native="saveImg()">保存</md-button>
      </md-part-toolbar-group>  
      <md-part-toolbar-group>
        <md-button @click.native="taskMap()">全图</md-button>
      </md-part-toolbar-group>             
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>架次统计表</md-part-toolbar-crumb>
        <md-part-toolbar-crumb>列表</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    
    <md-part-body>
      
      <md-content class="flex layout-column">

        <div class="jctj">
            <md-layout md-gutter>
              <md-layout md-flex="100" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
                 <md-bip-input-ref  :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-ref>
              </md-layout>  
              <md-layout md-flex="50" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
                  <md-bip-input-fileUp :cell="rwcell" :modal="rwmodal" :ref="rwcell.id" @change="dataChange"></md-bip-input-fileUp>
              </md-layout> 
              <md-layout md-flex="50" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
                <!-- <md-input-container>
                  <label>开始时间</label>  -->
                  <md-bip-date v-model="modaleimt.startTime" :value="modaleimt.startTime" :modal="modaleimt" :isReport="false" :cell="sTCell" :required="sTCell.isReq" :disabled="false" ></md-bip-date> 
                <!-- </md-input-container> -->
              </md-layout>
              <md-layout md-flex="50" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
                <!-- <md-input-container>
                  <label for="plane">结束时间</label> -->
                  <md-bip-date v-model="modaleimt.endTime" :value="modaleimt.endTime" :modal="modaleimt" :isReport="false" :cell="eTCell" :required="eTCell.isReq" :disabled="false" ></md-bip-date> 
                <!-- </md-input-container> -->
              </md-layout>  
               
            </md-layout>
          </div>
        <md-layout class="flex">
          <md-table-card style="margin:0 0px">
            <md-table class="flex">
              <md-table-header>
                <md-table-row > 
                  <md-table-head style="text-align:center" md-numeric>显示</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>任务编号</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>序号</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>飞机编号</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>终端编号</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>通航公司</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>起始时间</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>结束时间</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>平均海拔(m)</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>喷洒时长</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>平均航速(km/h)</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>喷洒里程(km)</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>喷洒面积(亩)</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>平均流量(m³/h)</md-table-head>
                  <md-table-head style="text-align:center" md-numeric>总流量(m³)</md-table-head>
                </md-table-row>
              </md-table-header>
              <md-table-body> 
                <md-table-row v-for="(row, index) in ffList" :key="index">
                  <md-table-cell style="text-align:center" md-numeric>
                    <md-button @click.native="getMap(`${index}`)">
                      <md-icon>language</md-icon> 
                      </md-button>
                  </md-table-cell>
                  <md-table-cell style="text-align:center;width:50px" md-numeric>
                    <md-bip-child-input-file :cell="fjcell[index]" :modal="fjmodal[index]" :ref="fjcell.id" @change="dataChange"></md-bip-child-input-file>
                  </md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{taskno}}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.jcCid }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.asid }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.airid }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.asidscm}}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.statTime }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.endTime }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.avgHigh }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.sumTimeStr }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.avgSpeed }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.sumDis }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.sumArea }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.avgFlow }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.sumFlow }}</md-table-cell>
              </md-table-row>
              </md-table-body>
            </md-table>
          </md-table-card>
        </md-layout>
      </md-content>
    </md-part-body>
    <md-loading :loading="loading"></md-loading> 
  </md-part>
</template>

<script>
import axios from 'axios'
import qs from 'qs'

export default {
  data(){
    return{
      taskno:'',
      // startTime:'',
      // endTime:'',
      modaleimt:{startTime:'',endTime:''},
      loading:0,
      ffList:[],
      cmcCode : '',
      snkey :JSON.parse(window.sessionStorage.getItem('snkey')),
      modal:{
        sid:'',
      },
      cell:{
        editName:"TKID",
        editType:0,
        id:"sid",
        index:0,
        isReq:true,
        labelString:"任务标识",
        refValue:"{&TKID}", 
      },
      rwcell:{
        c_par:{
          obj_id:"3503", 
          cels:[
            {id:"fj_root"}
          ]
        },
        id:"fj_name",
        isShow:true,
        labelString:"附件名称",
      },
      rwmodal:{
        fj_name:"",
        fj_root:"",
        sid:"",
        sbuid:"3503",
      },
      fjcell:[],
      fjmodal:[],
      multiple:true,
      mdSelection:true,
      selectedRows:[],
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
        labelString:'开始时间'
      }, 
      //结束时间
      eTCell:{  
        editName: "DATETIME", 
        id: "endTime", 
        isReq: true, 
        labelString:'结束时间'
      }, 
    }
  },

  methods:{
    saveImg(){
      this.loading=1;
      let fjmodal = encodeURI(JSON.stringify(this.fjmodal))
      let params ={snkey:this.snkey,method:217,jcimg:fjmodal}
      axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
      .then(res=>{ 
        if(res.data.key == 0){
              this.$notify.success({content:res.data.msg}) 
          }else{
              this.$notify.danger({content:'保存失败!'})
          }
          this.loading=0;
      })
      .catch(error=>{
          console.log(error)
      })
      let rw=[];
      this.rwmodal.sid=this.taskno;
      rw.push(this.rwmodal)
      let rwmodal = encodeURI(JSON.stringify(rw))
      let _params ={snkey:this.snkey,method:217,jcimg:rwmodal}
      axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(_params))
      .then(res=>{ 
        if(res.data.key == 0){
              this.$notify.success({content:res.data.msg}) 
          }else{
              this.$notify.danger({content:'保存失败!'})
          }
          this.loading=0;
      })
      .catch(error=>{
          console.log(error)
      })
    },
    dataChange(data){ 
      this.mdSelection=true;
      this.multiple = true;
      this.taskno=data.value[data.cellId] 
    },
    //获取任务对应的时间段
    getTimeInterval(){
      let taskno = this.taskno
      this.param.assistid="GETTASKTIME";
      this.param.cont="~sid ='"+taskno+"'";
      let _this = this;
      axios.post(global.BIPAPIURL+global.API_COM, qs.stringify(this.param)).then(res => {
        _this.modaleimt.startTime = res.data.values[0].bgtime;
        _this.modaleimt.endTime = res.data.values[0].edtime; 
      });
      
    },
    //查询任务对应的 附件信息
    getTaskFJ(){
      let taskno = this.taskno
      let params ={snkey:this.snkey,method:218,taskNo:taskno}
      axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
      .then(res=>{ 
        console.log(res.data)
        this.rwmodal.fj_root = res.data['fj_root']
        this.rwmodal.fj_name = res.data['fj_name']
      })
      .catch(error=>{
          console.log(error)
      })
    },
    //根据任务查询 架次信息
    getJcMsg(){
      let _this = this;
      if(_this.taskno==''){
        _this.$notify.danger({content:'请选择查询任务！'})
        return;
      }

      _this.loading = 1 
      let taskno = _this.taskno
      let startTime = _this.modaleimt.startTime;
      let endTime = _this.modaleimt.endTime;
      let params ={snkey:_this.snkey,method:216,taskNo:taskno,startTime:startTime,endTime:endTime}
      axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
      .then(res=>{
        _this.ffList = res.data;
        this.getfjclee();
        _this.loading = 0 
      })
      .catch(error=>{
          console.log(error)
      })
    },
    getfjclee(){
      this.fjcell=[];
      this.fjmodal=[];
      for(var i=0; i<this.ffList.length;i++){
        let jc = this.ffList[i];
        let cell ={ 
          c_par:{
            obj_id:"3627", 
            cels:[
              {id:"fj_root"}
            ]
          },
          id:"fj_name",
          isShow:true,
          labelString:"附件名称",
        }
        let modal={
          fj_name:jc.fj_name,
          fj_root:jc.fj_root,
          id:jc.id,
          sbuid:"3627",
        }; 
        this.fjcell.push(cell);
        this.fjmodal.push(modal);
      } 
    },
    getMap(i){
      // window.open('http://'+`${global.BIPAPIURL}`+'JCMap');
      var b = require('js-base64').Base64;
      //str = b.decode(str);  
      let jc = this.ffList[i];
      let task = b.encode(this.taskno);
      let user = b.encode(jc.airid);
      let stTime = b.encode(jc.statTime);
      let endTime = b.encode(jc.endTime);
      window.open(`${global.BIPAPIURL}`+'JCMap'+ `?task=${task}&user=${user}&stTime=${stTime}&endTime=${endTime}`);
    },
    taskMap(){
      let jc = this.ffList[0];
      var b = require('js-base64').Base64; 
      let task = b.encode(this.taskno);
      let user = b.encode(jc.airid);
      let stTime = b.encode(this.modaleimt.startTime);
      let endTime = b.encode(this.modaleimt.endTime);
      window.open(`${global.BIPAPIURL}`+'JCMap'+ `?task=${task}&user=${user}&stTime=${stTime}&endTime=${endTime}`);
    }
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
      this.getTimeInterval() 
      this.getTaskFJ()
    },
    fjmodal:function(){ 
    }
  }
}
</script>

<style lang="scss" scoped>
  .jctj{
    margin: 5px 10px;
    padding: 0 10px;
  }
  .md-card{
    margin: 0 20px;
    padding: 0 10px;
  }
  .title{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-family: 'microsoft yahei';
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
  md-table-head{
    text-align: center;
  }

</style>
