<template>
  <div class="layout">
    <el-container>
      <el-header>
        <div class="admin_tit">
          <nuxt-link to="/admin">后台管理页面</nuxt-link>
          <nuxt-link to="/" class="page">前台页面</nuxt-link>
          <nuxt-link to="/admin/posts/list" class="page">文章列表</nuxt-link>
        </div>
        <div class="author">
          <a class="logout" @click="logout()">退出</a>
        </div>
      </el-header>
      <nuxt></nuxt>
    </el-container>
  </div>
</template>
<script>
import { removeToken } from '../util/tools'
export default {
  methods: {
    logout() {
      removeToken()
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
.layout{
}
.el-header{
  background-color: #666;
}
.admin_tit{
  font-size: 20px;
  color: #fff;
  float: left;
  line-height: 50px;
}
.admin_tit a{
  color: #fff;
}
.admin_tit .page{
  font-size: 14px;
  margin-left: 20px;
}
.author{
  float: right;
  color: #fff;
  line-height: 50px;
}
.author a{
  color: #fff;
}
.logout{
  cursor: pointer;
}
</style>
