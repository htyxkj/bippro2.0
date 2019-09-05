<template>     
    <md-tabs :md-navigation="true" class="myTabsLayout_tabs">   
        <md-tab class="md-transparent"  v-for="(cfg,index) in laycfg" :key="index" :md-label="cfg.name" style="padding:0px;min-height:max-content;"> 
            <template v-if="!cfg.bcells">
                <bip-comm-lay :layout="cfg.comp" :dsm="dsm"  :sth="sth"></bip-comm-lay >
            </template>
            <template v-else>
                <md-layout>
                    <lay-cell :laycell="cfg.comp" :dsm="dsm" :sth="sth"></lay-cell>
                </md-layout> 
            </template> 
        </md-tab>
    </md-tabs> 
</template>
<script> 
export default {
    data() {
        return {
            
        };
    },
    props: { laycfg:Array,dsm :Object,sth:Object},
    methods: { 
    },
    computed: { 
    }, 
    async mounted() { 
        // console.log(this.laycfg) 
    },
    watch: { 
    }
};
</script>
<style lang="scss" scoped>
.bip-lay{
    width: 100%;
    max-width: 100%;
} 
</style>
<style lang="scss">
.myTabsLayout_tabs{
    overflow: hidden; 
    .md-tabs-navigation{
        overflow:-webkit-paged-x;
    } 
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
        width:6px;
        height:6px;
    }

    /* 滚动槽 */
    ::-webkit-scrollbar-track {
        border-radius:10px;
    }

    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius:10px; 
    } 
}
</style>
