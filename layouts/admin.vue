<template>
  <div class="layout">
    <el-container>
      <el-header>
        <div class="admin_tit">
          <nuxt-link to="/admin">后台管理</nuxt-link>
          <nuxt-link class="fontpage" to="/" target="_blank">前台页面</nuxt-link>
        </div>
        <div class="author">
          carlleton
          <a class="logout" @click="logout()">退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" style="minHeight:280px;padding:24px 0;">
          <el-menu theme="light" width="auto" default-active="0-0" :default-openeds="['0']" unique-opened="true">
            <el-submenu :index="pindex+''" v-for="(menu,pindex) in menus" :key="pindex">
              <template slot="title">
                <i class="el-icon-message"></i>{{menu.name}}
              </template>
              <el-menu-item :index="pindex+'-'+index" v-for="(item,index) in menu.childs" :key="index">
                <nuxt-link :to="item.link">{{item.name}}</nuxt-link>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main :style="{padding: '24px', minHeight: '280px',paddingLeft:'34px', background:'#fff'}">
          <nuxt/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import '../assets/css/admin.css'
import { removeToken } from '../util/tools'
export default {
  data() {
    return {
      menus: [
        {
          name: '日记管理',
          childs: [
            {name: '日记列表', link: '/admin/notes'},
            {name: '分类管理', link: '/admin/notes/cates'}
          ]
        },
        {
          name: '文章管理',
          childs: [
            {name: '文章列表', link: '/admin/posts/list'},
            {name: '分类管理', link: '/admin/posts/cates'}
          ]
        },
        {
          name: '系统设置',
          childs: [
            {name: '备份管理', link: '/admin/system/backup'},
            {name: '系统设置', link: '/admin/system/set'}
          ]
        }
      ]
    }
  },
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
  height: 100%;
  width: 100%;
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
.admin_tit .fontpage{
  font-size: 14px;
  margin-left: 20px;
}
.el-aside {
  color: #333;
  text-align: center;
  line-height: 200px;
}
.avatar{
  overflow: hidden;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #ccc;
  display: inline-block;
  margin-left: 5px;
  margin-top: 5px;
}
.author{
  float: right;
  color: #fff;
  line-height: 50px;
}
.logout{
  cursor: pointer;
}
</style>
