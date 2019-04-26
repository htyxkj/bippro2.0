<template>
<div style="width:100%;max-width:100%">
    <template v-if="layout&&layout.layType === 'B'">
        <border-layout :laycfg="comps" :dsm="dsm"></border-layout>
    </template>
    <template v-else-if="layout&&layout.layType === 'T'">
        <tabs-layout :laycfg="comps" :dsm="dsm"></tabs-layout>
    </template>
    <template v-else-if="layout&&layout.layType === 'H'">
        <bip-horizontal-lay :laycfg="comps" :dsm="dsm"></bip-horizontal-lay>
    </template>
    <template v-else-if="layout&&layout.layType === 'V'">
        <bip-vertical-lay :laycfg="comps" :dsm="dsm"></bip-vertical-lay>
    </template>
    <template v-else-if="layout&&layout.layType === 'U'">
        <div>自定义布局</div>
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
    props: {dsm: Object,layout:Object},
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