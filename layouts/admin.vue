<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark">
          <Avatar icon="persion" size="large" />
          <div class="author">
            carlleton
            <a href="/logout">退出</a>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider :style="{padding: '24px 0', minHeight: '280px',background:'#fff'}">
          <Menu theme="light" width="auto" active-name="0-0" :open-names="['p0']">
            <Submenu :name="'p'+pindex" v-for="(menu,pindex) in menus" :key="pindex">
              <template slot="title">
                {{menu.name}}
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
export default {
  data() {
    return {
      menus: [
        {
          name: '内容管理',
          childs: [
            {name: '内容列表', link: '/admin/posts/list'},
            {name: '添加', link: '/admin/posts/add'},
            {name: '分类管理', link: '/admin/posts/cates'},
            {name: '标签管理', link: '/admin/posts/tags'}
          ]
        }
      ]
    }
  }
}
</script>
<style scoped>
.layout{
  height: 100%;
  width: 100%;
}
.author{
  float: right;
  color: #fff;
}
</style>
