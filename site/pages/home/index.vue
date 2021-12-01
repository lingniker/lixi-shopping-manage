<template>
  <div class="doc div page-container">
    <div class="doc-left lx-scroll-doc">
      <div class = "logo" >
      </div> 
      <ul class="lx-layout">
        <li class="doc-li" v-for="(item, index) in homeRouter" :key="index">
          <router-link :to="item.path" activeClass='active-menu'>{{ item.title }}</router-link>
        </li>
      </ul>
    </div> 
    <div class = "doc-right div content lx-scroll-doc">
      <router-view></router-view>
    </div> 
  </div>
</template>

<script>
import "./index.scss";
import homeRouter from './home-router.js';

export default {
  data(){
    return {
      homeRouter
    }
  }
}
</script>