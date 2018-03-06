<template>
  <div>
    <div class="site-header">
      <h1 class="site-title">
        <a href="/" rel="home">蚕豆的blog</a>
      </h1>
      <p class="site-description">记录、收集、分享一些东西</p>
    </div>
    <aside class="widget" v-if="cates.length > 0">
      <h2 class="widget-title">分类目录</h2>
      <ul class="widget-cates">
        <li v-for="cate in cates" :key="cate.id">
          <nuxt-link :to="'/cate/'+cate.id">{{cate.catename}}</nuxt-link>
          <ul v-if="cate.childs && cate.childs.length > 0">
            <li v-for="childcate in cate.childs" :key="childcate.id">
              <nuxt-link :to="'/cate/'+childcate.id">{{childcate.catename}}</nuxt-link>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      cates: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      var catesresult = await axios.get('/api/cates/list')
      var data = catesresult.data
      var cates = []
      var temps = []
      for (var i = 0, n = data.length; i < n; i++) {
        if (data[i].pid === 0) {
          cates.push(data[i])
        } else {
          var maxi = cates.length - 1
          if (data[i].pid === cates[maxi].id) {
            if (cates[maxi].childs === undefined) {
              cates[maxi].childs = []
            }
            cates[maxi].childs.push(data[i])
          } else {
            temps.push(data[i])
          }
        }
      }
      this.cates = cates.concat(temps)
    }
  }
}
</script>
<style scoped>
.site-header{
  background: transparent;
  margin: 20% 0;
  padding: 0 20%;
}
.site-title{
  font-size: 1.9rem;
  line-height: 1.1852;
  font-weight: bold;
  margin: 0;
}
.site-description{
  font-size: 1.14rem;
  margin: 0;
}
.widget{
  margin: 0 0 20%;
  padding: 0 20%;
  line-height: 1.5;
  font-size: 1.14rem;
}
.widget a{
  /*color: #333;*/
}
.widget-title{
  margin: 0 0 1.5em;
  color: #333;
  font-family: "Noto Sans", sans-serif;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 1em;
  font-weight: bold;
}
.widget ul,.widget li{
  list-style:none;
  padding: 0;
  margin: 0;
}
.widget-cates li ul{
  padding-left: 20px;
}
</style>
