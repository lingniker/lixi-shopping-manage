<template>
  <router-view></router-view>
</template>

<script>
  import Layout from './components/layout/index.vue'
  // import { use } from '../src/i18n/index';

  export default {
    components: {
      Layout
    },
    data() {
      return {
        name : "ling"
      }
    },
    created() {
      // function setLang(){
      //   var lang = window.localStorage.getItem("lv_lang");
      //   if (lang) {
      //     use(lang);
      //   } else {
      //     use("zh");
      //   }
      // }
      // setLang()
    }
  }
</script>