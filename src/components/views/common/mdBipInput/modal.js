// const PRIMARY = 1;
// const NOTEDIT = 0x40;
// const READONLY  = 0x20;
// const INPUT_COMMON = 0;// 普通输入框
// const INPUT_LIST = 1;// 下拉框
// const INPUT_CHECK = 3;//多选
// const INPUT_RADIO = 4;//单选
// const INPUT_YESNO = 5;//是否
// const INPUT_IMAGE = 6;//图片
// const INPUT_FILE = 7;//文件
// const INPUT_REF = 8;//参照
// const INPUT_DATE = 9;//日期
// const INPUT_TEXTAFC = 10;//富文本编辑 
// const INPUT_AUTOGRAPH =12;//电子签名
export default {
  data () {
    return { 
      MULTIPLE:0x200000,//多项
      PRIMARY:0,
      NOTEDIT: 0x40,
      READONLY: 0x20,
      INPUT_COMMON: 0,
      INPUT_LIST: 1,
      INPUT_CHECK: 3,
      INPUT_RADIO: 4,
      INPUT_YESNO: 5,
      INPUT_IMAGE: 6,
      INPUT_FILE: 7,
      INPUT_REF: 8,
      INPUT_DATE: 9,
      INPUT_TEXTAFC:10, 
      INPUT_AUTOGRAPH:12,
      disabled: false,
      oldValue:"",
      mdSelection:false, 
      multiple:false
    }
  },
  props: {cell:Object,isSearch: {type:Boolean,default:false},modal:{},btj:{default:false,type:Boolean}},
  mounted () {
    // console.log("oldValue 赋值")
    this.oldValue = '';
    if(this.cell) {
      let notedit = this.cell.attr&this.NOTEDIT;
      this.disabled = notedit > 0 ? true:false;
      if(this.modal&&this.modal[this.cell.id]){
        this.oldValue = this.modal[this.cell.id];
      }
      let _multiple=this.cell.attr&this.MULTIPLE
      // console.log(_multiple)
      if(_multiple>0){   
        this.multiple =true;
        this.mdSelection=true; 
      }else{
        this.multiple =false;
        this.mdSelection=false;
      } 
    }

  },
  methods: {
    parentChange(){
      // console.log('111');
    }
  }    
}