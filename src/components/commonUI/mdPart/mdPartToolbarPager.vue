<template>
  <md-part-toolbar-group class="md-part-toolbar-pager">
    <md-button :disabled="!options.firstId" @click.native="paging(options.firstId)">{{$t('commBtn.B_FIRST')}}</md-button>
    <md-button :disabled="!options.prevId" @click.native="paging(options.prevId)">{{$t('commBtn.B_UP')}}</md-button>
    <md-button :disabled="!options.nextId" @click.native="paging(options.nextId)">{{$t('commBtn.B_NEXT')}}</md-button>
    <md-button :disabled="!options.lastId" @click.native="paging(options.lastId)">{{$t('commBtn.B_LAST')}}</md-button>
  </md-part-toolbar-group>
</template>
<script>
  export default {
    props: {
      options:{
        type:Object,
        default(){
          return {
            firstId:'',
            lastId:'',
            prevId:'',
            nextId:'',
          }
        }
      }
    },
    methods: {
      paging(id){
        this.$emit('paging',id);
      }
    },
    mounted() {
    },
  };
</script>
