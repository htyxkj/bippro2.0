<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button v-if="menuP.INSERT" @click.native="create">{{$t('commBtn.B_ADD')}}</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button v-if="menuP.DELETE" @click.native="delList">{{$t('commBtn.B_DEL')}}</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button v-if="menuP.FILE" @click.native="exportFile" :disabled="canexp">{{$t('commBtn.B_EXP')}}</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-pager @paging="paging" :options="pager"></md-part-toolbar-pager>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <!-- <md-part-toolbar-crumb>{{mdTitle}}</md-part-toolbar-crumb>
        <md-part-toolbar-crumb>{{$t('commBtn.B_LIST')}}</md-part-toolbar-crumb>
         -->
         <!-- <md-input-container>
            <label for="plane">查询</label> 
            <md-input v-model="allColumnsLike"></md-input>
          </md-input-container> -->
        <md-input-container style="margin:0px;padding:0px;     min-height: 0.28rem;">
          <md-input v-model="allColumnsLike" class="md-header-search-input" placeholder="搜索"></md-input>
        </md-input-container>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <md-content class="flex layout-column"> 
        <md-layout class="flex">
          <md-layout v-show="leftShow" md-flex-small="100" md-flex="20">
            <md-card>
              <md-bip-tree :treeOption="treeOption" :code="tree_code" :value="tree_value"></md-bip-tree>
            </md-card>
          </md-layout>
          <md-layout class="flex" md-flex-small="100" :md-flex="rightWidth">
            <md-table-card>
              <md-table @select="onTableSelect" class="flex">
                <md-table-header>
                  <md-table-row v-if="dsm">
                    <md-table-head v-for="(item) in dsm.ccells.cels" :key="item.id" v-if="item.isShow" :md-numeric="item.type===3">{{item.labelString}}</md-table-head>
                  </md-table-row>
                </md-table-header>
                <md-table-body v-if="dsm">
                  <!-- <md-table-row v-if="dsm.cdata.length==0">
                    <md-layout md-align="center">
                        <md-content>
                          <md-button class="md-fab md-fab-center-center">
                          <md-icon>verified_user</md-icon>
                        </md-button>
                        <span class="md-fab-center-center">{{$t('commInfo.noDatas')}}</span></md-content>
                    </md-layout>
                  </md-table-row> -->
                  <md-layout v-if="dsm.cdata.length==0">
                    <md-content>                      
                      <md-button class="md-fab md-fab-center-center">
                      <md-icon>verified_user</md-icon>
                    </md-button>
                      <span class="md-fab-center-center">{{$t('commInfo.noDatas')}}</span>
                    </md-content>
                  </md-layout>
                  <md-table-row v-if="dsm.cdata.length>0" :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in dsm.cdata" 
                    :key="rowIndex"
                    :md-item="row" 
                    :md-auto-select="mdAutoSelect" 
                    :md-selection="mdSelection" 
                    >
                    <!-- @dblclick.native="dblclick(row,rowIndex)" -->
                    <!-- <md-table-cell v-for="(column, columnIndex) in dsm.ccells.cels" :key="columnIndex" v-if="column.isShow" :md-numeric="column.type<12" :class="numRed(row[column.id],column) ? 'md-num-red':''">
                      <md-bip-ref  :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type === 3" :modal="row" :row="row"  @pkclick="dblclick(row,rowIndex)"></md-bip-ref>
                    </md-table-cell> -->
                    <md-table-cell v-for="(column, columnIndex) in dsm.ccells.cels" :key="columnIndex" v-if="column.isShow" :md-numeric="column.type<12" :class="numRed(row[column.id],column) ? 'md-num-red':''" @dblclick.native="openrefs(row,rowIndex,columnIndex)">
                      <md-bip-ref  :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type === 3" :modal="row" :row="row"  @pkclick="openrefs(row,rowIndex)"></md-bip-ref>
                    </md-table-cell>
                  </md-table-row>
                </md-table-body>
              </md-table>
              <md-table-tool>
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
              <!-- <md-layout v-if="dsm" md-align="center" >
                <md-layout v-if="dsm.cdata.length==0">
                    <md-content>                      
                      <md-button class="md-fab md-fab-center-center">
                      <md-icon>verified_user</md-icon>
                    </md-button>
                      <span class="md-fab-center-center">{{$t('commInfo.noDatas')}}</span>
                    </md-content>
                </md-layout>
              </md-layout> -->
            </md-table-card>
          <md-loading :loading="loading"></md-loading>
         </md-layout> 
        </md-layout>
      </md-content>
    </md-part-body>
    <bill-link-applet ref="sbill"  ></bill-link-applet>
  </md-part>
</template>
<script>
import BillState from '../classes/billState';
import common from '../commonModal.js'; 
import billLinkApplet from './billLinkApplet'
export default { 
  components:{billLinkApplet},
  data () {
    return {
      allColumnsLike:'',
      mdAutoSelect: true,
      mdSelection: true,
      loading:0,
      pager:{
        firstId:'1',
        lastId:'',
        prevId:'',
        nextId:'',
      },
      pageInfo:{
        size:20,
        page:1,
        total:0
      },
      rightWidth:100,
      leftShow:false,
      treeOption:null,
      tree_code:'',
      tree_value:'',  
    }
  },
  mixins:[common],
  props: {dsm:Object,dsext:Array,dscont:Object,mdTitle:String,opera:Object,mparams:Object,menuP:Object},
  created(){
    if(this.dsm){
      this.fetchUIData();
    }   
  },
  mounted(){
    this.doLayout_0();  
    this.doLayout();  
  },
  methods:{ 
    async exportFile(){
      if(this.dsm.cdata.length==0)
        return ;
      var header = [];
      var _data = {};
      for(let i=0;i<this.dsm.ccells.cels.length;i++){
        const cell = this.dsm.ccells.cels[i];
        header[i] = cell.id;
        _data[cell.id] = cell.labelString;
      }
      var cdata = this.dsm.cdata;
      if(this.pageInfo.total>this.dsm.cdata.length){
        let data1 = {
          dbid: global.DBID,
          usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
          apiId: global.APIID_EXPDATA,
          pcell: this.dsm.pcell,
          pdata: '',
          bebill: 0,
          currentPage: 1,
          pageSize: this.pageInfo.total,
          cellid: this.dsm.ccells.obj_id
        };
        var res = await this.downFile(data1);
        const content = res.data;
        this.exportFilesServ(content,this.mdTitle);
      }else{
        this.exportFiles(header,cdata,_data,'',this.mdTitle);
      }
    },
    pkclick(row){
      console.log(row);
    },
    async openrefs(row,index,columnIndex){ 
      if(columnIndex>=0){
        let cell = this.dsm.ccells.cels[columnIndex];
        let slkid = row[cell.id];
        if((cell.attr&0x80000)>0){
          let slkbuidCell = this.dsm.ccells.cels[columnIndex+1];
          let slkbuid = row[slkbuidCell.id];
          if(slkid&&slkbuid){  
            this.$refs["sbill"].open(slkid,slkbuid);
          }
        }else{
          this.dblclick(row,index);
        } 
      }
      else{
        this.dblclick(row,index);
      }
    },
    create(){
      // console.log("新建")
      this.dsm.index=-1;
      this.$emit('addBill');
    },
    initInfo(){
      this.pager = {firstId:'1',lastId:'', prevId:'', nextId:'',};
      this.pageInfo = {size:20,page:1,total:0};
    },
    paging(page){
      if(page==this.pageInfo.page){
        return;
      }
      this.pageInfo.page = page;
      this.fetchUIData();
    },
    onTableSelect(item){
      this.selectData = item;
    },
    // setRowColor(_index){
    //   _index = _index % 2;
    //   if ( _index !== 0){
    //     return true;
    //   }
    //   return false;
    // },
    onTablePagination (pager) { 
      if(parseInt(pager.size) != this.pageInfo.size){
        pager.page=1;
      }
      this.pageInfo.page = pager.page;
      this.pageInfo.size = pager.size;
      this.fetchUIData();
    },
    async fetchUIData () {  
      this.loading++;
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_FINDCELLDATA,
        'pcell': this.dsm.pcell,
        'pdata': '',
        'bebill':  1,
        'currentPage': this.pageInfo.page,
        'pageSize': this.pageInfo.size,
        'cellid': '',
        'allColumnsLike':encodeURI(this.allColumnsLike)
      }
      var res = await this.getDataByAPINewSync(data1);
      if(res.data.id==0){
        if(this.dsm.cdata.length>0){
          // console.log('清空DSM',this.dsm)
          this.dsm.clearData();
        }
        _.forEach(res.data.data.pages.celData,row=>{
          row.sys_stated = BillState.HISTORY;
          this.dsm.addRow(row);
        });
        this.pageInfo.total = res.data.data.pages.totalItem;
        var total = res.data.data.pages.totalPage;
        if(total>0){
          this.pager.nextId= total==1? '':(this.pageInfo.page==total? '':(parseInt(this.pageInfo.page)+1)+'');
          this.pager.prevId = (parseInt(this.pageInfo.page)==1?'':(parseInt(this.pageInfo.page)-1)+'');
          this.pager.lastId = total==1?'':(this.pageInfo.page==total)?'':total+'';
        }
      }
      this.loading--; 
    },
    // numRed (vals,cell) {
    //   if(cell.type === 3 &&vals<0)
    //     return true;
    //   return false;
    // },
    dblclick(row,index){
      // console.log(row,index);
      this.dsm.currRecord = row;
      this.dsm.index = index;
      this.$emit('addBill');
    },

    //删除数据
    delList(){
      console.log(this.selectData);
      _.forEach(this.selectData,item=>{
        if(this.opera){
          var state = item[this.opera.statefld];
          var sid  = item[this.opera.pkfld];
          console.log(state)
          if(!state)
            state ='0';
          if(state !== '0' && state !=='1'){
            this.$notify.warning({content: this.$t('commInfo.canNotDel')+sid+'!'});
          }else{
            item.sys_stated = 4;
            var str = JSON.stringify(item);
            var options = { pcell: this.dsm.pcell, jsonstr: str };
            this.saveData(options,this.delSuccess);
            // console.log(res);
          }
        }else{
            item.sys_stated = 4;
            var str = JSON.stringify(item);
            var options = { pcell: this.dsm.pcell, jsonstr: str };
            this.saveData(options,this.delSuccess);
        }
        // console.log(item);
      });
      // var _self = this;
      // _.forEach(this.selectData,function(n,key){
      //   n.sys_stated = 4;
      //   var str = JSON.stringify(n);
      //   //  console.log(str);
      //   var options = {'pcell': _self.mparams.pcell, 'jsonstr': str};
      //   // _self.saveData(options,_self.delSuccess,_self.delError);
      // });
      // this.$notify.success({content: '删除成功！'});
    },
    delSuccess(res){
      if(res.data.id == 0){
        this.$notify.info({content: this.$t('commInfo.deleteSucc')});
        this.fetchUIData();
      }
    },
    // delError(res){
    //   this.$notify.danger({content: '出错了！'});
    // }
    doLayout(){  
      let playout = this.mparams.playout; 
      if(playout.indexOf("H:")!=-1){ 
        if(playout.indexOf("U:TREE")!=-1){
          this.rightWidth=80; 
          this.leftShow=true;
          this.leftTree();
        }
      }else{
        this.rightWidth=100;
        this.leftShow=false;
      }
    },
    doLayout_0(){  
      let playout = this.mparams.playout; 
      if(playout.indexOf("H:")!=-1){
        if(playout.indexOf("U:TREE")!=-1){
          this.rightWidth=80; 
          this.leftShow=true;
          // this.leftTree();
        }
      }else{
        this.rightWidth=100;
        this.leftShow=false;
      }
    },
    async leftTree(){   
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_FINDCELLDATA,
        'pcell': this.dsm.pcell,
        'pdata': '',
        'bebill':  1,
        'currentPage': this.pageInfo.page,
        'pageSize': 100000,
        'cellid': '',
        'allColumnsLike':encodeURI(this.allColumnsLike)
      }
      var res = await this.getDataByAPINewSync(data1);  
      if(res.data.id==0){ 
        this.treeOption=res.data.data.pages.celData;
        this.tree_code=this.dsm.ccells.cels[0].id; 
        this.tree_value=this.dsm.ccells.cels[1].id;  
      }
    },
    styles(column){
      if((column.attr&0x80000)>0){
        return "cursor:hand;";
      }
    },
    
  },
  watch:{ 
    dsm(){ 
      if(this.dsm){
        this.doLayout();
        this.initInfo();
        this.fetchUIData();
      }
    },
    allColumnsLike:function(){
      this.fetchUIData ();
    }
  },

  computed:{
    canexp(){
      if(this.dsm){
        if(this.dsm.cdata.length>0){
          return false;
        }
      }
      return true;
    }
  }
}
</script>

