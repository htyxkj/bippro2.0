<template> 
  <div>
    <div v-for="(item,index) in column" :key="index">
      <template v-if="item.isgroup">
        <vxe-table-column :label="item.title"> 
          <template v-for="(itemz, index) in item.glist">
            <vxe-table-column :min-width="50" :width="ds_m.ccells.cels[itemz.index].ccCharleng*9+40"  v-if="ds_m.ccells.cels[itemz.index].isShow"  :prop="ds_m.ccells.cels[itemz.index].id" :label="ds_m.ccells.cels[itemz.index].labelString" :sortable="isSortable(ds_m.ccells.cels[itemz.index])" :fixed="isFixed(ds_m.ccells.cels[itemz.index],itemz.index)" :remote-sort="true" show-header-overflow show-overflow> 
              <template slot-scope="scope"> 
                <md-bip-bi-file-up  v-if="ds_m.ccells.cels[itemz.index].editName =='UPDOWN'" :cell="fileFJCell(scope.row.sbuid,ds_m.ccells.cels[itemz.index].id)" :modal="fileFJModal(scope.row,ds_m.ccells.cels[itemz.index].id)" ref="fj_name" style="padding: 0px;margin: 0px;min-height: 0px;"></md-bip-bi-file-up>
                <md-bip-input-ddGPS v-else-if="ds_m.ccells.cels[itemz.index].editType == 12" :cell="fileMPCell(scope.row)" :modal="fileMPModal(scope.row)" gpsType="showGPS"></md-bip-input-ddGPS>
                <md-bip-ref v-else :inputValue="scope.row[ds_m.ccells.cels[itemz.index].id]" :bipRefId="ds_m.ccells.cels[itemz.index]" :md-numeric="ds_m.ccells.cels[itemz.index].type === 3" :modal="scope.row" :row="scope.row" @pkclick="openrefs(scope.row,scope.rowIndex,itemz.index)"></md-bip-ref> 
              </template>
            </vxe-table-column>
          </template>
        </vxe-table-column>
      </template>
      <template v-else>
        <vxe-table-column :min-width="50" :width="ds_m.ccells.cels[item.index].ccCharleng*9+40"  v-if="ds_m.ccells.cels[item.index].isShow" :prop="ds_m.ccells.cels[item.index].id" :label="ds_m.ccells.cels[item.index].labelString" :sortable="isSortable(ds_m.ccells.cels[item.index])" :fixed="isFixed(ds_m.ccells.cels[item.index],item.index)" :remote-sort="true" show-header-overflow show-overflow> 
          <template slot-scope="scope"> 
            <md-bip-bi-file-up  v-if="ds_m.ccells.cels[item.index].editName =='UPDOWN'" :cell="fileFJCell(scope.row.sbuid,ds_m.ccells.cels[item.index].id)" :modal="fileFJModal(scope.row,ds_m.ccells.cels[item.index].id)" ref="fj_name" style="padding: 0px;margin: 0px;min-height: 0px;"></md-bip-bi-file-up>
            <md-bip-input-ddGPS v-else-if="ds_m.ccells.cels[item.index].editType == 12" :cell="fileMPCell(scope.row)" :modal="fileMPModal(scope.row)" gpsType="showGPS"></md-bip-input-ddGPS>
            <md-bip-ref v-else :inputValue="scope.row[ds_m.ccells.cels[item.index].id]" :bipRefId="ds_m.ccells.cels[item.index]" :md-numeric="ds_m.ccells.cels[item.index].type === 3" :modal="scope.row" :row="scope.row" @pkclick="openrefs(scope.row,scope.rowIndex,item.index)"></md-bip-ref> 
          </template>
        </vxe-table-column>
      </template>
    </div>
  </div> 
</template>
<script>
import billS from "../../classes/billState";
export default {
  data() {
    return {
      bills1: billS,
      column:[],
    };
  },
  props: {
    ds_m: { type: Object, default: null },
    Multi_level_title: { type: Object, default: null }, 
  },
  computed: {},
  methods: {
    isSortable(item) {
      //是否排序
      if((item.attr & this.bills1.ORDERBY)>0){
        return true;
      }
    },
    isFixed(item, index) {
      //固定列
      if (this.ds_m.ccells.sfix) {
        if (index < this.fixedColumn) {
          return "left";
        }
      }
    }, 
  },
  created() { 
    this.column=[];
    if(this.ds_m)
    for(var i=0;i<this.ds_m.ccells.cels.length;i++){
        let cels = this.ds_m.ccells.cels[i]; 
        if(cels.isShow){
            let cc ={index:i,isgroup:false,title:"",glist:[]}
            if(this.Multi_level_title[cels.id]){
                let num = this.Multi_level_title[cels.id];
                cc.isgroup=true;
                cc.title = this.Multi_level_title[cels.id+'_TITLE']
                let yy =parseInt(i)+parseInt(num);
                for(i;i<yy;i++){
                    let dd ={index:i,isgroup:false,title:"",glist:[]}
                    cc.glist.push(dd);
                }
                i--;
            }
            this.column.push(cc);
        }
    }
    console.log(this.column); 
  },
  mounted() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>
