<template>
  <Layout>
    <Sider style="width:28.2%;">
      <left></left>
    </Sider>
    <Content>
      <div class="main">
        <nuxt/>
      </div>
      <my-footer/>
    </Content>
  </Layout>
</template>

<script>
import MyFooter from '../components/Footer.vue'
import left from '../components/left.vue'

export default {
  head() {
    return {
      titleTemplate: '%s - 蚕豆的blog'
    }
  },
  components: {
    MyFooter,
    left
  }
}
</script>

<style>
.Layout{
  background: rgb(241, 241, 241);
  height: 100vh;
}
.Sider{
  background: #fff;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.15);
  content:"";
  width: 29.4118%;
}
.Content{
  padding: 20px 5%;
}
.main{

}

.button, .button:visited
{
  display: inline-block;
  color: #3B8070;
  letter-spacing: 1px;
  background-color: #fff;
  border: 2px solid #3B8070;
  text-decoration: none;
  text-transform: uppercase;
  padding: 15px 45px;
}

.button:hover, .button:focus
{
  color: #fff;
  background-color: #3B8070;
}

.title
{
  color: #505153;
  font-weight: 300;
  font-size: 2.5em;
  margin: 0;
}
</style>
