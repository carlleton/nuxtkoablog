<template>
  <div class="layout">
    <Layout>
      <Header>
        <div class="admin_tit">
          <nuxt-link to="/admin">后台管理</nuxt-link>
          <nuxt-link class="fontpage" to="/" target="_blank">前台页面</nuxt-link>
          <btnBackup></btnBackup>
        </div>
        <div class="author">
          carlleton
          <a class="logout" @click="logout()">退出</a>
        </div>
      </Header>
      <Layout>
        <Sider width="200px" style="minHeight:280px;padding:24px 0;">
          <Menu theme="light" width="auto" default-active="0-0" :default-openeds="['0']" :unique-opened="true">
            <Submenu :name="pindex+''" v-for="(menu,pindex) in menus" :key="pindex">
              <template slot="title">
                <i class="el-icon-message"></i>{{menu.name}}
              </template>
              <MenuItem :name="pindex+'-'+index" v-for="(item,index) in menu.childs" :key="index">
                <nuxt-link :to="item.link">{{item.name}}</nuxt-link>
              </MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Content :style="{padding: '24px', minHeight: '280px',paddingLeft:'34px', background:'#fff'}">
          <nuxt/>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import '../assets/css/admin.css'
import { removeToken } from '../util/tools'
import btnBackup from '../components/btn-backup'

export default {
  data() {
    return {
      menus: [
        {
          name: '文章管理',
          isadmin: true,
          childs: [
            {name: '文章列表', link: '/admin/posts/list', isadmin: true},
            {name: '分类管理', link: '/admin/posts/cates', isadmin: true}
          ]
        },
        {
          name: '系统设置',
          childs: [
            {name: '备份管理', link: '/admin/system/backup', isadmin: true},
            {name: '更改密码', link: '/admin/system/password'}
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
  },
  components: {
    btnBackup
  }
}
</script>
<style scoped>
.layout{
  height: 100%;
  width: 100%;
}
.Header{
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
.Sider {
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
.author a{
  color: #eee;
}
.logout{
  cursor: pointer;
}
</style>
