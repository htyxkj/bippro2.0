<template>
  <div>
      <md-loading :loading="loading"></md-loading>
  </div>
</template>
<script>
import qs from 'qs'
import axios from 'axios'
export default { 
    components:{'app-login':Login},
    data() {
        return {
            loading:0,
        }
    },
    async mounted(){
        
    },
    async created(){
         
    },
    methods: {
        
    },
    watch: { 

    }
}
</script> 
