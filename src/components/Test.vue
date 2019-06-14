<template>
    <!-- <vxe-table
        border
        show-all-overflow
        :data.sync="tableData"
        :edit-config="{trigger: 'click', mode: 'cell'}">
        <vxe-table-column type="index" width="60"></vxe-table-column>
        <vxe-table-column prop="name" label="Name" :edit-render="{name: 'input'}">
            <template v-slot:edit="row">
                <input type="text" v-model="row.name" class="custom-input">
            </template>
        </vxe-table-column>
        <vxe-table-column prop="age" label="Age" :edit-render="{autofocus: '.custom-input'}">
            <template v-slot:edit="row">
                <input type="number" v-model="row.age" class="custom-input">
            </template>
        </vxe-table-column>
        <vxe-table-column prop="date3" label="Date" :edit-render="{name: 'input'}">
            <template v-slot:edit="row">
                <input type="date" v-model="row.date3" class="custom-input">
            </template>
            <template v-slot="row">选中日期：{{ row.date3 }}</template>
        </vxe-table-column>
    </vxe-table> -->
</template>
<script> 
export default {
    data(){
        return { 
            tableData:[
                {name:'sfd',age:18,date3:'2019-05-05'}
            ],
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
        }
    },
    methods: { 
    }
}
</script>