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
      <div class="user-info">{{ userInfo.user_name }} <a @click="loginOut">登出</a></div>
      <div>
      <router-view></router-view>
      </div>
    </div> 
  </div>
</template>

<script>
import "./index.scss";
import homeRouter from './home-router.js';

export default {
  data(){
    var userInfoStr = window.sessionStorage.getItem('userInfo')
    var userInfo = {}
    if (userInfoStr) {
      userInfo = JSON.parse(userInfoStr)
    }
    return {
      homeRouter,
      userInfo: userInfo
    }
  },
  methods: {
    loginOut() {
      window.sessionStorage.setItem('userInfo', '')
      // location.href = '/#/login'
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<style scoped lang="scss">
.user-info{
  position: absolute;
  top: 10px;
  right: 10px;
  a {
    cursor: pointer;
    font-size: 13px;
    color: #409eff;
    display: inline-block;
    padding-left: 10px;
  }
}
</style>