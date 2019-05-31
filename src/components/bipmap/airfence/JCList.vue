<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button @click.native="search()">查询</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="save()">保存</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="merge()">合并</md-button>
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
              <md-layout md-flex="25" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
                <md-input-container>
                  <label for="plane">账户标识</label> 
                  <md-input :required="true" v-model="planeVal"></md-input>
                </md-input-container>
              </md-layout>

              <md-layout md-flex="25" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
                <md-input-container>
                  <label for="plane">器械标识</label> 
                  <md-input :required="true" v-model="qixieVal"></md-input>
                </md-input-container>
              </md-layout>

              <md-layout md-flex="25" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
                  <md-input-container>
                    <label for="plane">起始时间</label>
                    <!-- <md-date :btime="true" v-model="startTime"></md-date> -->
                    <md-bip-date v-model="startTime" :value="startTime" :isReport="false" :cell="sTCell" :required="sTCell.isReq" :disabled="false" ></md-bip-date> 
                  </md-input-container>
              </md-layout>
              <md-layout md-flex="25" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
                <md-input-container>
                  <label for="plane">结束时间</label>
                  <!-- <md-date :btime="true" v-model="endTime"></md-date> -->
                  <md-bip-date v-model="endTime" :value="endTime" :isReport="false" :cell="eTCell" :required="eTCell.isReq" :disabled="false" ></md-bip-date> 
                </md-input-container>
              </md-layout>
              <md-layout md-flex="25" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
                <md-input-container>
                  <label>喷洒宽幅(米)</label>
                  <md-input :required="true" v-model="kf"></md-input>
                </md-input-container>
              </md-layout>
              <md-layout md-flex="25" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
                <md-input-container>
                  <label>瞬时流量(低)</label>
                  <md-input :required="true" v-model="minll"></md-input>
                </md-input-container>
              </md-layout>
              <md-layout md-flex="25" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33">
                <md-input-container>
                  <label>瞬时流量(高)</label>
                  <md-input :required="true" v-model="maxll"></md-input>
                </md-input-container>
              </md-layout>
            </md-layout>
          </div>

        <md-layout class="flex">
          <md-table-card style="margin:0 0px">
            <md-table class="flex" :multiple="multiple"  @select="selectedRow" :md-selection="mdSelection">
              <md-table-header>
                <md-table-row> 
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
                <md-table-row v-for="(row, index) in ffList" :key="index"
                    :md-item="row"
                    :md-selection="mdSelection" md-auto-select>
                  <md-table-cell style="text-align:center" md-numeric>{{taskno}}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.jcCid }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ qixie }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{ row.airid }}</md-table-cell>
                  <md-table-cell style="text-align:center" md-numeric>{{qxSCM}}</md-table-cell>
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
      planeno:'',
      planeVal:'',
      taskno:'',
      tasks:[],
      startTime:'',
      endTime:'',
      cytime:0,
      kf:'',
      hb:'',
      minzyl:'',
      minll:'',
      maxll:'',
      loading:0,
      ffList:[],
      cmcCode : '',
      snkey :JSON.parse(window.sessionStorage.getItem('snkey')),
      qixieVal:'',
      qixie:'',
      qxSCM:'',
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
      }, 
      //结束时间
      eTCell:{ 
          editName: "DATETIME", 
          id: "endTime",
          isReq: true, 
      }, 
    }
  },
  roperty:{
    
  },
  methods:{
    dataChange(data){
      this.mdSelection=true;
      this.multiple = true;
      this.taskno=data.value[data.cellId]
      this.startTime = data.value['bgtime'];
      this.endTime = data.value['edtime'];
    },
    merge(){ 
      if(this.selectedRows.length<=0){
        this.$notify.danger({content:'请勾选需要合并的架次！'})
        return;
      }
      var flow=0,avgFlow=0,high=0,avgHigh=0,speed=0,avgSpeed='',endTime='',syl=0,getSYL='',jcCid='',statTime='',sumArea=0,sumDis=0,sumFlow=0,sumPoints=0,sumTime=0,sumPoints=0;
      let jcList = this.ffList
      var jc = this.selectedRows[0];//合并后架次

      for(var i = 0; i<this.selectedRows.length;i++){
        var _jcListOne =  this.selectedRows[i];
        if(i>=1 && _jcListOne.jcCid-this.selectedRows[i-1].jcCid!=1){
          this.$notify.danger({content:'请勾选连续架次！'})
          return;
        } 
        jcList[_jcListOne.jcCid-1]=null;
        if(i==this.selectedRows.length-1){
          jc.endTime = _jcListOne.endTime; 
        }
        //平均海拔(m)
        high += (parseFloat(_jcListOne.avgHigh)*parseFloat(_jcListOne.sumTime));
        //喷洒时长
        sumTime += parseFloat(_jcListOne.sumTime);
        //(总航速) 用来计算平均航速
        speed +=(parseFloat(_jcListOne.avgSpeed)*parseFloat(_jcListOne.sumTime));
        //喷洒里程(km)
        sumDis += parseFloat(_jcListOne.sumDis);
        //喷洒面积(亩)
        sumArea += parseFloat(_jcListOne.sumArea);
        //每亩药量
        syl += (parseFloat(_jcListOne.getSYL)*parseFloat(_jcListOne.sumArea));
        //平均流量
        flow +=(parseFloat(_jcListOne.avgFlow)*parseFloat(_jcListOne.sumTime));
        //总流量
        sumFlow += parseFloat(_jcListOne.sumFlow); 
        //有效喷洒点
        sumPoints += parseInt(_jcListOne.sumPoints);
      }
      avgHigh = high/sumTime;
      avgSpeed = speed/sumTime
      getSYL = syl/sumArea;
      avgFlow = flow/sumTime
      console.log("平均海拔(m)"+avgHigh+"--喷洒时长"+sumTime+"--平均总航速"+avgSpeed+"--喷洒里程"+sumDis+"--喷洒面积"+sumArea+"--每亩药量"+getSYL+"--平均流量"+avgFlow+"--总流量"+sumFlow)
      jc.avgHigh=avgHigh.toFixed(4);
      jc.sumTime = sumTime;
      jc.avgSpeed = avgSpeed.toFixed(4);
      jc.sumDis = sumDis.toFixed(4);
      jc.sumArea = sumArea;
      jc.getSYL = getSYL.toFixed(4);
      jc.avgFlow = avgFlow.toFixed(4);
      jc.sumFlow = sumFlow.toFixed(4);
      jc.sumPoints = sumPoints;
      var  second =  sumTime;
      var hours =parseInt(second / 3600);
      second =parseInt(second % 3600);
      var minutes =parseInt(second /60);
      second =parseInt(second % 60);
      
      jc.sumTimeStr = hours+"时"+minutes+"分"+second+"秒";
      this.ffList=[];
      var jcCid = 1;
      for(var j =0;j<=jcList.length;j++){
        let _jc =null;
        if(jc.jcCid==j+1){
          _jc=jc;
        }else{
          _jc = jcList[j];
        }
        if(_jc!=null){
          _jc.jcCid=jcCid
          this.ffList.push(_jc);
          jcCid++;
        }        
      }
      this.$notify.success({content:'合并成功！'})
    },
    selectedRow(items){
      this.selectedRows=[];
      var i=0
      for(var x in items){
        this.selectedRows[i] = items[x]
        i++;
      }
      
      items=[];
    },
    async search(){
      let params = {
        snkey:this.snkey,
        method:210,
        taskNo:this.taskno,
        userNumber:this.planeno,
        startTime:this.startTime,
        endTime:this.endTime,
        cyjg:this.cytime,
        kf:this.kf,
        minzyl:this.minzyl, 
        minll:this.minll,
        maxll:this.maxll
      }
      if(this.taskno==''){
        this.$notify.danger({content:'请选择查询任务！'})
        return ;
      } 
      this.loading = 1 
      await axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
        .then(res=>{
          this.ffList = res.data;
          this.loading = 0
        })
        .catch((err=>{
          this.loading = 0
        }))
    },
    async save(){
      let params = {
        snkey:this.snkey,
        method:212,
        taskNo:this.taskno,
        userNumber:this.planeno,
        startTime:this.startTime,
        endTime:this.endTime,
        cyjg:this.cytime,
        kf:this.kf,
        minzyl:this.minzyl, 
        minll:this.minll,
        maxll:this.maxll,
        qixie:this.qixie,
        cmcCode:this.cmcCode,
        JCList:encodeURI(JSON.stringify(this.ffList)),
        qxSCM:encodeURI(this.qxSCM),
      } 
      if(this.ffList.length<=0)
        return;
      this.loading = 1 
      await axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
        .then(res=>{
          if(res.data.key == 0){
              this.$notify.success({content:res.data.msg}) 
          }else{
              this.$notify.danger({content:'保存失败'})
          }
          this.loading=0
        })
        .catch((err=>{
          this.loading = 0
        }))
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
    //获取任务对应的 器械标识
    getQIXIEId(){
      let taskno = this.taskno
      let param = this.param;
      param.assistid="GETTASKQX";
      param.cont="~o.sid ='"+taskno+"'";
      axios.post(global.BIPAPIURL+global.API_COM, qs.stringify(param)).then(res => {
          console.log(res.data)
          this.qixie=res.data.values[0].id;
          this.qixieVal=res.data.values[0].name; 
          this.minzyl=res.data.values[0].minzyl;
          this.qxSCM=res.data.values[0].scm1;
      }); 
    },
    //获取参数信息
    getError(){
      let taskno = this.taskno
      let params = {snkey:this.snkey,method:208,taskNo:taskno}
      axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
      .then(res=>{
        this.kf=res.data.widcloth;
        this.minll = parseFloat(res.data.minflow);
        this.maxll = parseFloat(res.data.maxflow);
      })
      .catch(err=>{
          console.log(err)
      })
    },
    getCYJG(){ 
      let taskno = this.taskno
      let params = {snkey:this.snkey,method:214,taskNo:taskno}
      axios.post(`${global.BIPAPIURL}MapServlet`,qs.stringify(params))
      .then(res=>{
        this.cytime = res.data.fcjrequency
      })
      .catch(err=>{
          console.log(err)
      })
    }
  },
  created(){ 
    let usrCode = JSON.parse(window.sessionStorage.getItem('user')).userCode
    if(usrCode == 'admin'){
      this.cmcCode =2;
    }else{
      this.cmcCode = usrCode.substring(0,6)
    }
    //获取select数据
    // this.getListData()
  },
  watch:{
    'taskno':function(){
      this.getAirId()
      this.getQIXIEId() 
      this.getError()
      this.getCYJG()
    },
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


</style>
