<template>
<div  class="all">
    <template v-if="layout&&layout.layType === 'B'">
        <border-layout :laycfg="comps" :dsm="dsm" :sth="sth" class="all"></border-layout>
    </template>
    <template v-else-if="layout&&layout.layType === 'T'">
        <tabs-layout :laycfg="comps" :dsm="dsm" :sth="sth" class="all"></tabs-layout>
    </template>
    <template v-else-if="layout&&layout.layType === 'H'">
        <bip-horizontal-lay :laycfg="comps" :dsm="dsm" :sth="sth" class="all"></bip-horizontal-lay>
    </template>
    <template v-else-if="layout&&layout.layType === 'V'">
        <bip-vertical-lay :laycfg="comps" :dsm="dsm" :sth="sth" class="all"></bip-vertical-lay>
    </template>
    <template v-else-if="layout&&layout.layType === 'U'">
        <div class="all">自定义布局</div>
    </template>
</div>
</template>
<script> 
export default {
    data() {
        return {
            comps:[],
        };
    },
    props: {dsm: Object,layout:Object,sth:Object},
    methods: { 
    },
    computed: { 
    }, 
    created(){
        if(this.layout)
            this.comps = this.layout.compconfs
    },
    async mounted(){
    },
    watch: { 
    }
};
</script>
<style scoped>
    .all{
        width:100%;
        max-width:100%;
        /* height:100%;
        min-height:100% */
    }
</style>