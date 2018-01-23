<template>
    <button @click.stop="Excel" label="导出excel3" labelPosition="after">
        导出excel3</button>
</template>
<script>
import util from "./views/classes/excelUtils.js";
export default {
    methods: {
        Excel() {
          // console.log(util.exportExcel(11,22,3,34));
          //util.exportExcel(11,22,3,34))
            var _headers = ['id', 'name', 'age', 'height', 'weight'];
            var _data = [
                
                { "id": "编号", "name": "姓名", "age": "年龄", "height": "身高(cm)", "weight": "体重(kg)" },
                { "id": 1, "name": "张三", "age": "12", "height": "170", "weight": "70" },
                { "id": 2, "name": "张三", "age": "12", "height": "170", "weight": "70" },
                { "id": 3, "name": "张三", "age": "12", "height": "170", "weight": "70","weight1": "70" }
            ];
            util.exportExcel(_headers,_data,'fdsfds','ffff');
            //util.nowR();
        },
    }
}
</script>