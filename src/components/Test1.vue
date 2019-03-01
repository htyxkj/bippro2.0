
<template>
  <div>
    <md-layout style="height:auto;margin:0px" v-for="(item,index) in inp" :key="index" >
      <md-layout style="height:auto;margin:0px" v-for="(row,rowIn) in item" :key="rowIn" :md-flex="row[0].width" :md-flex-offset="row[0].width"> 
        <md-layout style="background-color: #666666;" v-for="(one,index1) in row" :key="index1"  :md-flex="one.input.width" :md-flex-offset="one.input.width">
          <!-- <md-bip-input :dsm="dsm"   :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input> -->
            <md-input-container>
              <label>With label</label>
              <md-input placeholder="My nice placeholder"></md-input>
            </md-input-container>
        </md-layout>  
      </md-layout> 
    </md-layout> 
  </div>
</template>

<script>
export default { 
  data () {
    return {
      inp:[],
    }
  },    
  mounted() {  
    this.getInput();
  }, 
  methods: {
    getInput(){
      var columnNum = 5;
      let iput = [
        {width:2,title:"111111",row:1},{width:1,title:"22222",row:2},{width:1,title:"333333",row:1},{width:1,title:"444444",row:1},{width:1,title:"555555",row:1},{width:1,title:"666666",row:1},
        {width:1,title:"777777",row:2},{width:1,title:"888888",row:1},{width:1,title:"999999",row:1},{width:1,title:"101010",row:1},{width:1,title:"0000000",row:1},
      ];

      let row=[];
      let j=0;
      let isRows = false;//上一个是否是多行
      for(var i=0;i<iput.length;i++){
        let one = iput[i]
        one.width = parseInt(one.width*100/columnNum);
        j += one.width;
        if(j==100){
          if(one.row>1){
            var o = [{rows:true,input:one,width:one.width}];
            row.push(o);
            isRows = true;
          }else{
            if(isRows){
              var o = [{rows:false,input:one}];
              row.push(o);
            }else{
              if(row == [] || row.length ==0){
                var o = new Array(0)
                var b ={rows:false,input:one}; 
                o.push(b); 
                row.push(o);
              }else{
                var o = {rows:false,input:one};
                row[row.length-1].push(o);
              }
            }
            isRows = false;
          }
          for(var r=0;r<row.length;r++){
            if(row[r][0].rows ==false){
              let _r = row[r];
              let width=0;
              for(var _j=0;_j<_r.length;_j++){
                width += _r[_j].input.width;
              }
              let _width=0;
              if(width!=100){
                while(width !=_width){
                  i++;
                  let _one =iput[i];
                  if(_one){
                    _one.width = parseInt(_one.width*100/columnNum);
                    _width += _one.width;
                    if(_width<=width){
                      let b = {rows:false,input:_one}; ;
                      row[r].push(b)
                    }else{
                      _width = width;
                      i--;
                    }
                  }else{
                    _width = width;
                  }
                }
              }else{
                _width = width;
              }
              for(var _j=0;_j<_r.length;_j++){
                row[r][_j].width = _width;
              }
            }
          }
          console.log(row)
          for(var l=0;l<row.length;l++){
            for(var p=0;p<row[l].length;p++){ 
              row[l][p].input.width=parseInt( (row[l][p].input.width/row[l][0].width)*100)
            }
          }

          this.inp.push(row);
          row =[];
          j=0;
          isRows = false;//上一个是否是多行
        }else if(j<100){
  
          if(one.row>1){
            var o = [{rows:true,input:one,width:one.width}];
            row.push(o);
            isRows = true;
          }else{
            if(isRows){
              var o = [{rows:false,input:one}];
              row.push(o);
            }else{ 
              if(row == [] || row.length ==0){
                var o = new Array(0)
                var b ={rows:false,input:one}; 
                o.push(b); 
                row.push(o);
              }else{
                var o = {rows:false,input:one};
                row[row.length-1].push(o);
              }
            }
            isRows = false; 
          }   

          if(i == iput.length -1 ){
            for(var r=0;r<row.length;r++){
              if(row[r][0].rows ==false){
                let _r = row[r];
                let width=0;
                for(var _j=0;_j<_r.length;_j++){
                  width += _r[_j].input.width;
                }
                let _width=0;
                if(width!=100){
                  while(width !=_width){
                    i++;
                    let _one =iput[i];
                    if(_one){
                      _one.width = parseInt(_one.width*100/columnNum);
                      _width += _one.width;
                      if(_width<=width){
                        let b = {rows:false,input:_one}; ;
                        row[r].push(b)
                      }else{
                        _width = width;
                        i--;
                      }
                    }else{
                      _width = width;
                    }
                  }
                }else{
                  _width = width;
                }
                for(var _j=0;_j<_r.length;_j++){
                  row[r][_j].width = _width;
                }
              }
            }
            console.log(row)
            for(var l=0;l<row.length;l++){
              for(var p=0;p<row[l].length;p++){ 
                row[l][p].input.width=parseInt( (row[l][p].input.width/row[l][0].width)*100)
              }
            }

            this.inp.push(row);
            row =[];
            j=0;
            isRows = false;//上一个是否是多行
          }
        }else if(j>100){
          iput[i].width = parseInt(one.width/100*columnNum);
          i--;
          j=100; 
          for(var r=0;r<row.length;r++){
            if(row[r][0].rows ==false){
              let _r = row[r];
              let width=0;
              for(var _j=0;_j<_r.length;_j++){
                width += _r[_j].input.width;
              }
              let _width=0;
              while(width !=_width){
                i++;
                let _one =iput[i];
                if(_one){
                  _one.width = parseInt( _one.width*100/columnNum);
                  _width += _one.width;
                  if(_width<=width){
                    let b = {rows:false,input:_one}; ;
                    row[r].push(b)
                  }else{
                    _width = width;
                    i--;
                  }
                }else{
                  _width = width;
                }
              }
              for(var _j=0;_j<_r.length;_j++){
                row[r][_j].width = _width;
              }
            }
          }
          console.log(row)
          for(var l=0;l<row.length;l++){
            for(var p=0;p<row[l].length;p++){ 
              row[l][p].input.width=(row[l][p].input.width/row[l][0].width)*100
            }
          }

          this.inp.push(row);
          row =[];
          j=0;
          isRows = false;//上一个是否是多行
        }
      }
      console.log("循环完成")
      console.log(this.inp);
    },
  }    
}
</script>
 
<style scoped> 
.input{
  height: 30px;
  width: 80%;
}
</style> 