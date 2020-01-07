<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <!-- 查询 -->
        <md-button @click.native="search()">{{$t('commBtn.B_FIND')}}</md-button>
        <!-- <md-button @click.native="clear">清空</md-button> -->
      </md-part-toolbar-group>
      <!-- <md-part-toolbar-group>
        <md-button>复制</md-button>
      </md-part-toolbar-group> -->
      <md-part-toolbar-group>
        <!-- 列表 -->
        <!-- <md-button @click.native="list()">{{$t('commBtn.B_LIST')}}</md-button> -->
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <!-- 统计 -->
        <md-button @click.native="searchCount('dialog')">{{$t('commBtn.B_STATISTICS')}}</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <!-- 导出 -->
        <md-button @click.native="exportFile()">{{$t('commBtn.B_EXP')}}</md-button>
      </md-part-toolbar-group>
      <!-- 隐藏显示条件按钮  顶部 -->
      <md-part-toolbar-group>
          <md-button @click.native="showSearchInfo">{{showContLabel}}</md-button>
          <md-button @click.native="lineToColumnRun">{{lineToColumn}}</md-button>
      </md-part-toolbar-group>
      <!-- 常量定义的按钮 -->
      <md-part-toolbar-group v-if="biLay != 'card'">
          <md-button :disabled="btnDisabled" v-for="(item,index) in dlgBtn" :key="index" @click.native="dlgBtnClick(item)">{{item.name}}</md-button>
      </md-part-toolbar-group>

      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>{{mdTitle}}</md-part-toolbar-crumb>
        <md-part-toolbar-crumb>{{$t('commBtn.B_LIST')}}</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body id="partBody">
      <md-content style=" background-color: #F9F9F9;">
        <template v-if="showCont">
          <md-layout  md-gutter="4" v-if="ds_cont" md-column id="partCondition">
            <template v-if="showAllCont">
              <md-layout>
                <md-layout md-flex="95">
                  <md-bip-input :isReport="true" v-for="(cell) in ds_cont.ccells.cels" :key="cell.id" :cell="cell" :modal="ds_cont.currRecord" :is-search="true" v-if="cell.isShow" :btj="true" @change="dataChange"></md-bip-input>
                </md-layout>
                <md-layout md-flex="5" md-vertical-align="end">
                  <!-- 隐藏显示剩余条件 -->
                  <md-button class="bip-more md-icon-button" @click.native="showMore()">
                    <md-tooltip md-direction="left">{{tipLaber}}</md-tooltip>
                    <md-icon>list</md-icon>   
                  </md-button>
                </md-layout>
              </md-layout>
            </template>
            <template v-else>
              <md-layout>
                <md-layout md-flex="95">
                  <md-bip-input :isReport="true" v-for="(cell, index) in ds_cont.ccells.cels" :key="cell.id" :cell="cell" :modal="ds_cont.currRecord" :is-search="true" v-if="cell.isShow&&index<4" :btj="true" @change="dataChange"></md-bip-input>
                </md-layout>
                <md-layout md-flex="5" md-vertical-align="end">
                  <!-- 隐藏显示剩余条件 -->
                  <md-button class="bip-more md-icon-button" @click.native="showMore()">
                    <md-tooltip md-direction="left">{{tipLaber}}</md-tooltip>
                    <md-icon>list</md-icon>   
                  </md-button>
                </md-layout>
              </md-layout>
            </template>
            <md-layout>
              
            </md-layout>
          </md-layout> 
        </template>
        <template v-if="!groupTJ"> 
          <!-- 表格布局 -->
          <template v-if="biLay =='table' && ds_m" class="flex">
            <md-table-card ><!--  style="height: -webkit-fill-available;" -->
              <!-- 旧table -->
              <!-- <md-table  @select="onTableSelect" class="flex" v-if="ds_m" @sort="onSort">
                <md-table-header v-if="ds_m">
                  <md-table-row>
                    <template v-for="(item, index) in ds_m.ccells.cels" v-if="item.isShow">
                      <md-table-head v-if="(item.attr & bills1.ORDERBY)>0 " :md-numeric="item.type<12" :md-sort-by="item.id">&nbsp;&nbsp;&nbsp;{{item.labelString}}&nbsp;&nbsp;&nbsp;</md-table-head>
                      <md-table-head v-else :md-numeric="item.type<12">{{item.labelString}}</md-table-head>
                    </template>
                  </md-table-row>
                </md-table-header>
                <md-table-body> 
                  <md-table-row :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in ds_m.cdata" :key="rowIndex" :md-item="row" :md-auto-select="mdAutoSelect"  :md-selection="mdSelection"  :style="getRowStyle(row,ds_m.ccells)" >
                    <md-table-cell v-for="(column, columnIndex) in ds_m.ccells.cels" :key="columnIndex" v-if="column.isShow" :md-numeric="column.type<12" :class="numRed(row[column.id],column) ? 'md-num-red':''"  @dblclick.native="openrefs(row,rowIndex,columnIndex)" >
                      <md-bip-bi-file-up  v-if="column.editName =='UPDOWN'" :cell="fileFJCell(row)" :modal="fileFJModal(row)" ref="fj_name" style="padding: 0px;margin: 0px;min-height: 0px;"></md-bip-bi-file-up>
                      <md-bip-input-ddGPS v-else-if="column.editType == 12" :cell="fileMPCell(row)" :modal="fileMPModal(row)" gpsType="showGPS"></md-bip-input-ddGPS>
                      <md-bip-ref v-else :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type === 3" :modal="row" :row="row" @pkclick="openrefs(row,rowIndex,columnIndex)"></md-bip-ref> 
                    </md-table-cell>
                  </md-table-row>
                </md-table-body>
              </md-table>  -->  
              <vxe-table ref="newBiTable" class="mytable-style" :data.sync="ds_m.cdata" :height="tableHeight" 
                highlight-hover-row highlight-current-row @cell-click="onTableSelect" 
                header-cell-class-name="md-numeric"  @header-cell-click="onSortNew" @sort-change="sort_change" 
                :row-class-name="getRowStyleNew" border  resizable :auto-resize="true"  stripe 
                :sort-config="{trigger: 'cell'}"
                :span-method="rowspanMethod">  
                <!-- :header-cell-class-name="getTitleNewStyle" -->
                <!-- <md-bip-bi-table-column :ds_m="ds_m" :Multi_level_title="Multi_level_title" ></md-bip-bi-table-column> -->
                <vxe-table-column :min-width="item.ccCharleng*9+40" v-for="(item, index) in ds_m.ccells.cels" v-if="item.isShow" :key="index" :prop="item.id" :label="item.labelString" :sortable="isSortable(item)" :fixed="isFixed(item,index)" :remote-sort="true" show-header-overflow show-overflow> 
                  <template slot-scope="scope"> 
                    <md-bip-bi-file-up  v-if="item.editName =='UPDOWN'" :cell="fileFJCell(scope.row.sbuid,item.id)" :modal="fileFJModal(scope.row,item.id)" ref="fj_name" style="padding: 0px;margin: 0px;min-height: 0px;"></md-bip-bi-file-up>
                    <md-bip-input-ddGPS v-else-if="item.editType == 12" :cell="fileMPCell(scope.row)" :modal="fileMPModal(scope.row)" gpsType="showGPS"></md-bip-input-ddGPS>
                    <md-bip-ref v-else :inputValue="scope.row[item.id]" :bipRefId="item" :md-numeric="item.type === 3" :modal="scope.row" :row="scope.row" @pkclick="openrefs(scope.row,scope.rowIndex,index)"></md-bip-ref> 
                  </template>
                </vxe-table-column>
              </vxe-table>
              <md-table-tool style="max-height:50px"> 
                <md-layout class="flex"></md-layout> 
                <md-table-pagination
                    :md-size="pageInfo.size"
                    :md-total="pageInfo.total"
                    :md-page="pageInfo.page"
                    :md-label="$t('commInfo.Per')"
                    md-separator="/"
                    :md-page-options="[10,20, 30, 50]"
                    @pagination="onTablePagination"
                    >
                </md-table-pagination>
              </md-table-tool>
            </md-table-card>
          </template>
          <!-- 卡片布局 -->
          <template v-else-if="biLay == 'card'">  
              <template v-if="ds_m && ds_m.cdata && ds_m.cdata.length>0"> 
                <md-layout style="padding:10px;">
                  <md-card v-for="(row, rowIndex) in ds_m.cdata" :key="rowIndex" style="margin-bottom: 20px;    box-shadow: rgba(226, 226, 226, 0.54) 0px 0px 10px;" :style="getRowStyle(row,ds_m.ccells)" >
                    <md-card-expand> 
                      <md-card-header  class="d_jump" style="padding-bottom: 0px;padding-top: 10px;">
                        <md-layout v-if="timedown" md-flex ="100"  md-align="center" >
                          <md-bip-time-down :row="row" :timedown="timedown" :callback="callback" endText="已经结束了"></md-bip-time-down>
                        </md-layout>
                        <md-layout v-for="(item, index) in ds_m.ccells.cels"  v-if="item.isShow && (item.attr&bills1.DICT)>0" :key="index" md-flex ="100" :md-gutter="16"> 
                            <md-layout md-flex ="35" class="title11" >{{item.labelString}}</md-layout>
                            <md-layout md-flex ="65" class="content">
                              <!-- <md-bip-ref v-if="item.editName!='UPDOWN'" :inputValue="row[item.id]" :bipRefId="item" :md-numeric="item.type === 3" :modal="row" :row="row" @pkclick="openrefs(row,rowIndex,index)"></md-bip-ref>
                              <md-bip-bi-file-up  v-else :cell="fileCell(row)" :modal="fileModal(row)" ref="fj_name" style="padding: 0px;margin: 0px;min-height: 0px;"  ></md-bip-bi-file-up> -->
                              <md-bip-bi-file-up  v-if="item.editName =='UPDOWN'" :cell="fileFJCell(row.sbuid,item.id)" :modal="fileFJModal(row,item.id)"  ref="fj_name" style="padding: 0px;margin: 0px;min-height: 0px;"></md-bip-bi-file-up><!-- :cell="fileFJCell(row)" :modal="fileFJModal(row)" -->
                              <md-bip-input-ddGPS v-else-if="item.editType == 12" :cell="fileMPCell(row)" :modal="fileMPModal(row)" gpsType="showGPS"></md-bip-input-ddGPS>
                              <md-bip-ref v-else :inputValue="row[item.id]" :bipRefId="item" :md-numeric="item.type === 3" :modal="row" :row="row" @pkclick="openrefs(row,rowIndex,index)"></md-bip-ref>                              
                            </md-layout>
                        </md-layout>
                      </md-card-header> 
                      <md-card-content> 
                          <md-layout v-for="(item, index) in ds_m.ccells.cels" v-if="item.isShow && (item.attr& bills1.DICT)<=0"  :key="index" md-flex ="100" :md-gutter="16"> 
                            <md-layout md-flex ="35" class="title11" >{{item.labelString}}</md-layout>
                            <md-layout md-flex ="65" class="content">
                              <md-bip-bi-file-up  v-if="item.editName == 'UPDOWN'"  :cell="fileFJCell(row.sbuid,item.id)" :modal="fileFJModal(row,item.id)" ref="fj_name" style="padding: 0px;margin: 0px;min-height: 0px;"></md-bip-bi-file-up>
                              <md-bip-input-ddGPS v-else-if="item.editType == 12" :cell="fileMPCell(row)" :modal="fileMPModal(row)" gpsType="showGPS"></md-bip-input-ddGPS>
                              <md-bip-ref v-else :inputValue="row[item.id]" :bipRefId="item" :md-numeric="item.type === 3" :modal="row" :row="row" @pkclick="openrefs(row,rowIndex,index)"></md-bip-ref>                              
                            </md-layout>
                          </md-layout>     
                      </md-card-content>
                      <md-card-actions>  
                        <md-button :disabled="btnDisabled" v-for="(itembtn,index) in dlgBtn" :key="index" @click.native="moblieButton(itembtn,row)">{{itembtn.name}}</md-button>
                        <md-button :disabled="btnDisabled" v-for="(itembtn,index) in sbuidBtn" :key="index" @click.native="openrefs(row,rowIndex,itembtn.columnIndex)">{{itembtn.name}}</md-button>
                        <md-button class="md-icon-button" md-expand-trigger @click="ExpandShrink(rowIndex)">
                          <md-icon>keyboard_arrow_down</md-icon>
                        </md-button>
                      </md-card-actions> 
                    </md-card-expand>
                  </md-card> 
                </md-layout>
                <md-layout v-show="pageToolShow">
                  <md-layout md-flex="50" md-align="center">
                    <md-button :disabled="pageOn" class="md-dense" @click="getpageOn">
                      <md-icon>keyboard_arrow_left</md-icon>
                    </md-button> 
                  </md-layout>
                  <md-layout md-flex="50">
                    <md-button  :disabled="pageNext" class="md-dense" md-align="center" @click="getPageNext">
                      <md-icon>keyboard_arrow_right</md-icon>
                    </md-button> 
                  </md-layout>
                </md-layout>
              </template>
              <template v-else> 
                <md-layout md-flex="100" class="nodata">
                  <img src="../../../../img/bi/noData.png"/>
                </md-layout> 
              </template> 
          </template>
        </template>
        <template v-else>
          <md-layout class="flex" >
            <md-layout v-if="groupfilds.length!=0 && groupdatafilds.length!=0" md-flex-small="100" md-flex="100">
              <!-- 手工统计 -->
              <md-bip-chart :showData="true" :groupfilds="groupfilds" :groupdatafilds="groupdatafilds" :modal="ds_cont.currRecord" :pcell="ds_m.ccells.obj_id" :doSearch="doSearCh" :searchCelId="ds_cont.ccells.obj_id"  :chartType="ctype" :showChart="showChart" @hideChar="hideChar"></md-bip-chart>
            </md-layout>
            <md-layout v-else v-for="(item,index) in this.mparamsArr" :key="index"  md-flex-small="100" :md-flex="item.width">
              <!-- 系统初始定义统计 -->
              <md-bip-chart :showData="mparamsArr.length==1?true:false" :groupfilds="item.groupfilds" :chartType="item.ctype"  :groupdatafilds="item.sumfilds"   :modal="ds_cont.currRecord" :pcell="ds_m.ccells.obj_id" :doSearch="doSearCh" :searchCelId="ds_cont.ccells.obj_id"  :showChart="showChart" @hideChar="hideChar"></md-bip-chart>
            </md-layout> 
          </md-layout>
        </template>
      </md-content>
      <md-loading :loading="loading"></md-loading>
      <md-dialog ref="dialog" class="md-bip-dialog" v-if="ds_m">
        <md-dialog-title>{{mdTitle}}--{{$t('commLabel.L_Statist_Title')}}</md-dialog-title>
        <md-dialog-content>
          <md-input-container>
            <label for="groupfilds">{{$t('commLabel.L_Statist_Y')}}</label>
            <md-select id="groupfilds" multiple v-model="groupfilds" required>
              <md-option v-for="(cell, index) in ds_m.ccells.cels"
                :key="index"
                :value="cell.id" v-if="(cell.type !== 2 && cell.type !== 3 && cell.type !== 4 && cell.type !== 5 && cell.type !== 6 && cell.type !== 8) &&cell.isShow">
                {{cell.labelString}}
              </md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label for="groupdatafilds">{{$t('commLabel.L_Statist_X')}}</label>
            <md-select multiple v-model="groupdatafilds" required>
              <md-option v-for="(cell, index) in ds_m.ccells.cels"
                :key="index"
                :value="cell.id" v-if="(cell.type == 2 || cell.type == 3 || cell.type == 4 || cell.type == 5 || cell.type == 6 || cell.type == 8)&&cell.isShow">
                {{cell.labelString}}
              </md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label for="ctype">{{$t('commLabel.L_Statist_CType')}}</label>
            <md-select v-model="ctype">
              <md-option v-for="(item) in chartList"
                :key="item.id"
                :value="item.id">
                {{item.name}}
              </md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <md-checkbox id="my-test1" name="my-test1" v-model="showChart">{{$t('commLabel.L_Statist_ChartHidden')}}</md-checkbox>
          </md-input-container>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="closeDialog('dialog')">{{$t('commInfo.cancel')}}</md-button>
          <md-button class="md-primary" @click="okDialog('dialog')">{{$t('commInfo.ok')}}</md-button>
        </md-dialog-actions>
      </md-dialog>
    </md-part-body>
    <bill-link-applet ref="sbill"></bill-link-applet>
    <bill-blbip-applet ref="BL_BIP"></bill-BLBIP-applet>
    <md-bip-bi-dialog ref="biDialog"></md-bip-bi-dialog>
  </md-part>
</template>
<script> 
import bipBi from '../js/bip_bi.js' 
import billS from '../../classes/billState';
import common from '../../commonModal.js'; 
import billLinkApplet from '../../applet/billLinkApplet'
import billBlbipApplet from '../../applet/billBLBIPApplet' 
import mdBipBiDialog from '../../biDialog/mdBipBiDialog'
import mdBipBiTableColumn from '../table/biTableColumn'
export default { 
  components:{billLinkApplet,mdBipBiDialog,mdBipBiTableColumn,billBlbipApplet},
  data(){
    return { 
      pageOn:true,
      pageNext:true,
      pageToolShow:false,
      bills1 : billS, 
      tableHeight:0,
      fixedNum :0,      
      tableData:[
        {name:'cc',age:19,date3:'as'}
      ],
    }
  },
  mixins:[common,bipBi],
  props: ['mdTitle','mparams'],
  computed: { 
  },
  methods:{  
    moblieButton(btn,item){ 
      this.selectData = item; 
      this.ds_m.currRecord = item;
      this.dlgBtnClick(btn);
    },
    page(){
      if(this.pageInfo.page<=1){
        this.pageOn = true;
      }else{
        this.pageOn = false;
      }
      if(this.pageInfo.total<=this.pageInfo.size){
        this.pageToolShow=false;
      }else{
        this.pageToolShow=true;
      }
      if((this.pageInfo.page*this.pageInfo.size)>this.pageInfo.total){
        this.pageNext = true;
      }else{
        this.pageNext = false;
      }
    },
    getPageNext(){
      let page={};
      page.page = this.pageInfo.page+1;
      page.size=20;
      this.onTablePagination(page);
    },
    getpageOn(){
      let page={};
      page.page = this.pageInfo.page-1;
      page.size=20;
      this.onTablePagination(page);
    },
    //倒计时结束
    callback(){

    },
    //定位到当前选项卡
    ExpandShrink(index){ 
      let jump = document.querySelectorAll('.d_jump')
      jump[index].scrollIntoView()
    },
    //排序
    onSort(sortBy){
      let name = sortBy.name;
      let type = sortBy.type;
      let order = name +"  " + type;
      // this.ds_m.pcell.orderby = name +"  " + type;
      this.fetchUIData(order);
    },


  },
  created(){ 
    // this.getPbds();
  },
  mounted(){  
    setTimeout(() => {
      if(document.getElementById("partCondition"))
      this.tableHeight = document.getElementById("partBody").clientHeight-53 - document.getElementById("partCondition").clientHeight;    
      else
      this.tableHeight = document.getElementById("partBody").clientHeight-50 ;   
    }, 300);
  },
  watch:{ 
    pageInfo:{
      handler: function () { 
        this.page();
      },
      deep: true
    }
  } 
}
</script>

<style lang="scss" scoped>
.md-num-red{
  color: red;
}

.md-table-head.md-numeric {
    // text-align: right;
    color:rgba(81,162,81,.91);
}

.bip-more{
  // background-color: rgba(81,162,81,.91);
  font-size: 0.1rem;
  &.md-button{
    // height: 0.3rem;
    // min-height: 0.2rem;
    margin: 0.15rem 0.08rem;
  }
} 
.md-card .md-card-content:last-child {
  padding-bottom: 0rem; 
}
.title11{
  color: #828282
}
.content{
  border-bottom: 1px solid #8282824a; 
}
.nodata{
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px;
  img{
    width: 150px;
    height: 150px;
  }
}  
.vxe-table--body .vxe-body--row .ccc {
  font-size: 99px;
} .vxe-body--row .ccc {
  font-size: 99px;
} 
.ccc {
  font-size: 99px;
} 
</style>
