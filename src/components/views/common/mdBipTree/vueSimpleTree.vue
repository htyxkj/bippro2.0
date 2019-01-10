<template>
  <div>
     <vue-tree
        :tree-data="treeData"
        v-model="ids"
        :options="options"
        @handle="handle"
      />
  </div>
</template>
<script>
//参考文档 ：https://github.com/jiaxincui/vue-tree/
export default {
    props: {treeOption:{ default: [], type: Array },code:{default:'',type:String},value:{default:'',type:String}},
    name: 'app',
    data: function () {
      return {
        ids: [1],
        options: {
          label: 'label',
          checkbox: false,
          checkedOpen: true,
          folderBold: true,
          idsWithParent: false,
          depthOpen: 0,
          openIcon: 'fa fa-angle-right',
          closeIcon: 'fa fa-angle-down',
          halfCheckedIcon: 'fa fa-minus-square-o fa-fw text-primary',
          checkedIcon: 'fa fa-check-square-o fa-fw text-danger',
          uncheckedIcon: 'fa fa-square-o fa-fw'
        },
        message: [], 
        itemData:{
          label: 'ROOT',
          id: '',
          children:[],
          parentTree:null,
        },
        treeData:[],
      }
    }, 
  methods: { 
    handle (item) { 
      console.log(item) 
    },
    createData(){
      let nd0 = this.itemData;
      for(var i=0;i<this.treeOption.length;i++){ 
        let data = this.treeOption[i]; 
        let _id=data[this.code];
        let label=data[this.value];
        let menuTemp = {id:_id,label:label,children:[],parentTree:null};

        while (!_id.startsWith(this.trim(nd0.id))){// abcd  ab  true
          nd0 = nd0.parentTree; 
        }
        menuTemp.parentTree=nd0;
        nd0.children.push(menuTemp); 
        nd0 = menuTemp;  
      } 
      for(var i =0;i<this.itemData.children.length;i++){
        this.treeData.push(this.itemData.children[i])
      }
    },
    trim(s){
       return s.replace(/(^\s*)|(\s*$)/g, "");
    }
  },
  mounted() { 
    if(this.treeOption!=null){
      this.createData();
    }
  },
  watch:{ 
    treeOption(){
      this.createData();
    }
  }
}
</script>

<style lang="scss" scoped>
.bip-child-inset{
  padding-left: 0.3rem;
}
</style>


