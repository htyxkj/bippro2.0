<template>
  <md-layout md-flex>
    <section class="content-container">
      <div class="grid-content bg-purple-light">
        <div class="breadcrumb-container">
          <strong class="title">{{$t('bipmsg.title')}}</strong>
        </div>
        <div class="content-wrapper">
          <section>
            <div class="toolbar">
              <div class="tool">
                <!-- search -->
                <div class="form-item">
                  <div class="item-content">
                    <div class="inp">
                      <input type="text" :placeholder="$t('bipmsg.keyword')" class="input-inner" v-model="words" @keyup.enter="search">
                    </div>
                  </div>
                </div>
                <!-- btn -->
                <div class="form-item">
                  <div class="item-content">
                    <button type="button" class="btn" @click="search" >
                      <span>{{$t('bipmsg.btnFind')}}</span>
                    </button>
                  </div>
                </div>
                <!-- btn -->
                <div class="form-item">
                  <div class="item-content">
                    <button type="button" class="btn" @click="getMsg">
                      <span>{{$t('bipmsg.btnUnRead')}}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="mytable">
              <md-table-card>
                <md-table @select="onSelect">
                  <md-table-header>
                    <md-table-row>
                      <md-table-head>{{$t('bipmsg.head.sid')}}</md-table-head>
                      <md-table-head>{{$t('bipmsg.head.title')}}</md-table-head>
                      <md-table-head>{{$t('bipmsg.head.time')}}</md-table-head>
                      <md-table-head>{{$t('bipmsg.head.state')}}</md-table-head>
                      <md-table-head>{{$t('bipmsg.head.oper')}}</md-table-head>
                    </md-table-row>
                  </md-table-header>
                  <md-table-body>
                    <md-table-row v-for="(row,index) in msgs" :key="index" :md-item="row" md-selection>
                      <md-table-cell>{{(pageInfo.page-1)*pageInfo.size+index+1}}</md-table-cell>
                      <md-table-cell>{{row.title}}</md-table-cell>
                      <md-table-cell>{{row.dmake}}</md-table-cell>
                      <md-table-cell>{{getStatus(row.brd)}}</md-table-cell>
                      <!-- <md-table-cell v-for="(col,colIndex) in row" :key="col.id" v-if="colIndex!='content'">{{col}}</md-table-cell> -->
                      <md-table-cell class="cell">
                        <button type="button" class="small-btn" @click="view(index)">{{$t('bipmsg.btnView')}}</button>
                        <button type="button" class="small-btn md-btn" @click="del(index)">{{$t('bipmsg.btnDel')}}</button>
                      </md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table>
                <md-table-pagination :md-size="pageInfo.size" :md-total="pageInfo.total" :md-page="pageInfo.page" :md-label="$t('commInfo.Per')" md-separator="/" :md-page-options="[5, 10,15, 25, 50]" @pagination="onPagination" class="flex"></md-table-pagination>
              </md-table-card>
            </div>
          </section>
        </div>
      </div>
    </section>
  </md-layout>
</template>

<script>
export default {
  data() {
    return {
      words:'',
      msgs:[],
      pageInfo: {
        size: 10,
        page: 1,
        total: 0
      },
    }
  },
  mounted(){
    this.getMsg();
  },
  methods: {
    search() {
      // this.msgs = this.items.filter(o=>o.title.indexOf(this.words)>-1)
      // console.log(this.msgs)
    },
    async getMsg(){
      var data1={
        snkey : JSON.parse(window.sessionStorage.getItem('snkey')),
        apiId : global.APIID_TA_MSG,
        tskim:global.APIID_TM_MSG_DTL,
        page:this.pageInfo.page,
        size:this.pageInfo.size
      };
      var res = await this.getDataByAPINew(data1);
      // console.log(res);
      if(res.data.id==0){
        this.msgs = res.data.data.page.celData;
        this.pageInfo.page = res.data.data.page.currentPage;
        this.pageInfo.total = res.data.data.page.totalItem;
      }
    },
    view(index) {
      var that =this
      this.$msgDialog.open({ msgTitle: this.msgs[index].title,msgTM:this.msgs[index].dmake, msgStatus: this.getStatus(this.msgs[index].brd),msgContent:this.msgs[index].content,upStatus(){that.upStat(index)} })
    },
    //修改状态
    async upStat(index){
      // this.msgs[index].status = '已读'
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
      if(this.pageInfo.size!=page.size){
        this.pageInfo.page = 1;
      }else{
        this.pageInfo.page = page.page;
      }
      this.pageInfo.size  = page.size;
      this.getMsg();
    },
    onSelect() {

    },
    getStatus(id){
      if(id===1 || id==0){
        return this.$t('bipmsg.btnUnRead');
      }else{
        return this.$t('bipmsg.btnRead');
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.grid-content bg-purple-light {
  display: block;
}

.content-container {
  flex: 1;
  overflow-y: scroll;
  padding: 20px;
  background-color: #fff;
}

.breadcrumb-container {
  width: 100%;
  float: left;
  box-sizing: border-box;
}

.content-wrapper {
  background-color: #fff;
  box-sizing: border-box;
  width: 100%;
  float: left;
  display: block;
}

strong {
  font-weight: bold;
}

.title {
  width: 200px;
  float: left;
  color: #475669;
}

.toolbar {
  width: 100%;
  float: left;
  box-sizing: border-box;
  background: #f2f2f2;
  padding: 10px;
  margin: 10px 0;
  padding-bottom: 0px;
}

.tool {
  display: block;
  margin-top: 0em;
}

.form-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
  margin-bottom: 10px;
}

.item-content {
  display: inline-block;
  vertical-align: top;
  line-height: 36px;
  position: relative;
  font-size: 14px;
}

.inp {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 100%;
}

.input-inner {
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  display: block;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  outline: 0;
  padding: 3px 10px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  width: 100%;
}

input {
  -webkit-rtl-ordering: logical;
  text-rendering: auto;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  text-align: start;
  margin: 0;
  font: 400 13.3333px Arial;
}

.btn {
  color: #fff;
  background-color: #20a0ff;
  border-color: #20a0ff;
  display: inline-block;
  line-height: 1;
  white-space: normal;
  cursor: pointer;
  border: 1px solid #bfcbd9;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 4px;
}

.mytable {
  width: 100%;
  position: relative;
  float: left;
}

.md-table {
  border-bottom: 1px solid #bfcbd9;
}

.cell {
  white-space: nowrap;
  word-break: break-all;
  line-height: 24px;
  overflow: hidden;
  padding-right: 18px;
  box-sizing: border-box;
  text-overflow: ellipsis;
  transition: background-color .25s ease;
  height: 40px;
  min-width: 0;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
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
@media screen and (min-width:300px) and (max-width:321px) {
  .item-content{max-width: 1rem;}
}

@media screen and (min-width:321px) and (max-width:361px) {
  .item-content{max-width: 1rem;}
}

@media screen and (min-width:362px) and (max-width:380px) {
  .item-content{max-width: 1rem;}
}

@media screen and (min-width:381px) and (max-width:420px) {
  .item-content{max-width: 1rem;}
}

</style>

