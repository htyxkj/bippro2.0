<template>     
    <md-tabs>   
        <md-tab class="md-transparent"  v-for="(cfg,index) in laycfg" :key="index" :md-label="cfg.name" style="padding:0px;min-height:max-content;"> 
            <template v-if="!cfg.bcells">
                <bip-comm-lay :layout="cfg.comp" :dsm="dsm"></bip-comm-lay >
            </template>
            <template v-else>
                <md-layout>
                    <lay-cell :laycell="cfg.comp" :dsm="dsm"></lay-cell>
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
    props: { laycfg:Array,dsm :Object},
    methods: { 
    },
    computed: { 
    }, 
    async mounted() { 
        console.log(this.laycfg) 
    },
    watch: { 
    }
};
</script>
<style scoped>
.bip-lay{
    width: 100%;
    max-width: 100%;
}
</style>
