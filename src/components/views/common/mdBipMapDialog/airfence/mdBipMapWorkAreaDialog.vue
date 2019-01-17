<template>
  <md-dialog ref="dialog" :md-click-outside-to-close="false" :md-esc-to-close="false">
      <!-- title -->
      <md-dialog-title> <div class="dia-title">{{diaTitle}}</div></md-dialog-title>
      <!-- content -->
      <md-dialog-content class="contentC">
        <div class="content-area">
          <div class="c-areapc">
            <md-layout>
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-input-container>
                  <label for="plane">作业区</label> 
                  <md-input :required="false" v-model="areaid"></md-input>
                </md-input-container> 
              </md-layout>
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-input-container>
                  <label for="plane">架区编号</label> 
                  <md-input :required="true" v-model="id"></md-input>
                </md-input-container> 
              </md-layout>
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-input-container>
                  <label for="plane">架区名称</label> 
                  <md-input :required="false" v-model="name"></md-input>
                </md-input-container> 
              </md-layout>
            </md-layout>
          </div>
          <div class="c-areapc">
            <md-layout> 
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-input-container>
                  <label for="plane">所属乡镇</label> 
                  <md-input :required="false" v-model="township"></md-input>
                </md-input-container> 
              </md-layout>
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-input-container>
                  <label for="plane">具体地点</label> 
                  <md-input :required="false" v-model="address"></md-input>
                </md-input-container> 
              </md-layout>
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-input-container>
                  <label for="plane">林地类型</label> 
                  <md-input :required="false" v-model="wdtype"></md-input>
                </md-input-container> 
              </md-layout>
            </md-layout>
          </div> 
          <div class="c-areapc">
            <md-layout>
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-input-container>
                  <label for="plane">起点坐标</label> 
                  <md-input :required="false" v-model="startpoint"></md-input>
                </md-input-container> 
              </md-layout>
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-input-container>
                  <label for="plane">终点坐标</label> 
                  <md-input :required="false" v-model="endpoint"></md-input>
                </md-input-container> 
              </md-layout>
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-input-container>
                  <label for="plane">避让点坐标</label> 
                  <md-input :required="false" v-model="avoid"></md-input>
                </md-input-container> 
              </md-layout>
            </md-layout>
          </div>
          <div class="c-areapc">
            <md-layout>
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-input-container>
                  <label for="plane">备注信息</label> 
                  <md-input :required="false" v-model="remark1"></md-input>
                </md-input-container> 
              </md-layout>
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-input-container>
                  <label for="plane">作业区描述</label> 
                  <md-input :required="false" v-model="remark"></md-input>
                </md-input-container> 
              </md-layout>  
              <md-layout md-flex="33" md-flex-xsmall="33">
                <md-bip-input-ref  :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-ref>
              </md-layout>            
            </md-layout>
          </div> 
          <div class="c-areapc">
            <md-layout>
              <md-layout md-flex="33" md-flex-xsmall="33">   
                <md-input-container>
                  <label for="plane">作业区面积(亩)</label> 
                  <md-input :required="false" v-model="area_1"></md-input>
                </md-input-container> 
              </md-layout>  
              <md-layout md-flex="66" md-flex-xsmall="66">
                <md-input-container>
                  <label for="plane">边界坐标</label> 
                  <md-input :required="false" v-model="boundary_1"></md-input>
                </md-input-container> 
                 </md-layout>  
            </md-layout>
          </div>
        </div>
      </md-dialog-content>
      <!-- action -->
      <md-dialog-actions class="actionC">
        <md-button class="md-primary md-raised" @click="ok">确定</md-button>
        <md-button class="md-raised" @click="closeDialog">取消</md-button>
      </md-dialog-actions>
  </md-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import qs from 'qs'
export default {
  data() {
    return {   
      modal:{
        orgcode:JSON.parse(window.sessionStorage.getItem('user')).deptInfo.cmcCode,
      },
      cell:{
        editName:"SORG",
        editType:0,
        id:"orgcode",
        index:0,
        isReq:false,
        labelString:"隶属部门",
        refValue:"{&SORG}",
      },
      param:{
        apiId: "assisto",
        dbid: `${global.DBID}`,
        usercode: JSON.parse(window.sessionStorage.getItem('user')).userCode, 
        page:1,
        assistid: null,
        cont:null,
      }, 
      classA: 'classA',  
      snkey :JSON.parse(window.sessionStorage.getItem('snkey')), 

      // cmcCode : '',// JSON.parse(window.sessionStorage.getItem('user')).deptInfo.cmcCode,

      areaid:'',//作  业 区
      id:'',//架区编号
      name:'',//架区名称
      township:'',//所属乡镇
      address:'',//具体地点
      wdtype:'',//林地类型
      boundary_1:'',//边界坐标
      remark1:'',//备注信息
      avoid:'',//避让点坐标
      startpoint:'',//起点坐标
      endpoint:'',//终点坐标
      remark:'',//作业区描述
      sopr:JSON.parse(window.sessionStorage.getItem('user')).userCode,//业务员
      sorg:'',//隶属部门
      scm:'',//隶属公司
      sbuid:'3513',//单据类型*
      smake:JSON.parse(window.sessionStorage.getItem('user')).userCode,//制 单 人
      mkdate:'',//制单日期
      state:'0',//状态*
      boundary1_1:'',//边界坐标
      area_1:0,//作业区面积
    }
  },
  props: {
    getOpt:{
      type:Function,
    }, 
    diaTitle:'',  
    boundary:'',
    boundary1:'',
    area:'',
  },
  methods: { 
    //隶属部门发生改变
    dataChange(data){  
      this.sorg=data.value[data.cellId]  
    },
    ok() {
      //作业区数据发生变化
      if(this.boundary_1 !=this.boundary){
        var jwd="";
        var boundary = this.boundary_1
        while(boundary.indexOf("E") !=-1){
          // 经度 
          var oneE = boundary.indexOf("E");
          var oneEF = boundary.indexOf("″"); 
          var nexN = boundary.indexOf("N");
          if(oneEF>nexN){
              this.$notify.warning({content:'坐标数据错误！'})
              this.checkbox[i]=null;
              return;
          }
          var lngStr = boundary.substring(oneE,oneEF+1);
          var lng = this.convertLngLat(lngStr); 
          boundary = boundary.substring(oneEF+1,boundary.length);
          // 纬度
          var oneN = boundary.indexOf("N");
          var oneNF = boundary.indexOf("″"); 
          var nexE = boundary.indexOf("E");
          if(nexE != -1)
          if(oneNF>nexE){
              this.$notify.warning({content:'坐标数据错误！'})
              this.checkbox[i]=null;
              return;
          }
          var latStr = boundary.substring(oneN,oneNF+1); 
          var lat = this.convertLngLat(latStr);
          boundary = boundary.substring(oneNF+1,boundary.length); 
          jwd = jwd+lng+","+lat+";";
        }
        jwd=jwd.substring(0,jwd.length-1);
        this.boundary1_1 = jwd;
      }

      var jsonstr={};
      jsonstr["areaid"]=this.areaid;//作  业 区
      jsonstr["id"]=this.id;//架区编号
      jsonstr["name"]=this.name;//架区名称
      jsonstr["township"]=this.township;//所属乡镇
      jsonstr["address"]=this.address;//具体地点
      jsonstr["wdtype"]=this.wdtype;//林地类型
      jsonstr["boundary"]=this.boundary_1;//边界坐标
      jsonstr["remark1"]=this.remark1;//备注信息
      jsonstr["avoid"]=this.avoid;//避让点坐标
      jsonstr["startpoint"]=this.startpoint;//起点坐标
      jsonstr["endpoint"]=this.endpoint;//终点坐标
      jsonstr["remark"]=this.remark;//作业区描述
      jsonstr["sopr"]=this.sopr;//业务员
      jsonstr["sorg"]=this.sorg;///隶属部门
      jsonstr["scm"]=this.scm;//隶属公司
      jsonstr["sbuid"]=this.sbuid;//单据类型*
      jsonstr["smake"]=this.smake;//制 单 人
      jsonstr["area"] = this.area_1;//作业区面积
      
      jsonstr["mkdate"]=moment(new Date()).format("YYYY-MM-DD HH:mm:ss");//制单日期
      jsonstr["state"]=this.state;//状态*
      jsonstr["boundary1"]=this.boundary1_1;//边界坐标

      var data1 = {
        "dbid": `${global.DBID}`,
        "usercode": JSON.parse(window.sessionStorage.getItem('user')).userCode,
        "apiId": "savedata", //cellparam pbuid=21243&pmenuid=22403
        "pcell": '3513',
        "jsonstr":JSON.stringify(jsonstr),
        "datatype":1
      };
      this.loading=1;
      let _this =this;
      var state=0;
      axios.post(`${global.BIPAPIURL}`+`${global.API_COM}`,qs.stringify(data1)) .then(res=>{ 
        console.log(res.data)
          if(res.data.id==0){
            _this.$notify.success({content:'保存成功'})
            _this.getOpt(1)
            _this.closeDialog()
          }else{
            _this.$notify.danger({content:'保存失败'})
          }  
          _this.loading=0;
      }) .catch(err=>{
          console.log(err)
          _this.$notify.danger({content:'系统故障！'})
          _this.loading=0;
      })  
    }, 
    closeDialog() {
      this.$refs.dialog.close()
    },  
  },
  created(){
    this.area_1 = this.area;
    this.boundary_1= this.boundary;
    this.boundary1_1=this.boundary1;
    let usrCode = JSON.parse(window.sessionStorage.getItem('user')).userCode
    if(usrCode == 'admin'){
      this.scm ='2';
    }else{
      this.scm = usrCode.substring(0,6)
    } 
    this.sorg = this.modal.orgcode
  },
  mounted() {
    this.$refs.dialog.open()
  },
  watch:{ 
  }
}
</script>

<style scoped>
.md-dialog{
  max-height: 100%;
}
.classA {
  min-height: 6.5rem;
  max-width: 9.5rem;
  max-height: 9.5rem;
  min-width: 6.5rem;
}
.actionC {
  position: absolute;
  bottom: 0.1rem;
  right: 0.1rem;
}
.dia-title {
  width: auto;
  text-align: center;
}
.content-area {
  color: #48576a;
  font-size: 14px;
}
.c-areapc {
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
}   
.contentC {
  margin-bottom: 0.7rem;
  overflow: hidden;
}
</style>



