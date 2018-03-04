<template>
  <div>
    <article v-for="post in posts" :key="post.id">
      <div class="entry-header">
        <h2 class="entry-title">
          <nuxt-link :to="'/post/'+post.id">{{post.title}}</nuxt-link>
        </h2>
      </div>
      <div class="entry-footer">
        <i class="el-icon-date"></i>{{post.addtime|addtime}}
        <i class="el-icon-document"></i>
        <nuxt-link :to="'/cate/'+post.cid" class="cate">{{catename(post.cid)}}</nuxt-link>
      </div>
    </article>
  </div>
</template>
<script>
import axios from 'axios'
import {dateFormat} from '~/util/tools'

export default {
  head() {
    return {
      title: this.title
    }
  },
  validate({ params }) {
    return /^\d+$/.test(params.cid)
  },
  async asyncData({params}) {
    var cid = params.cid
    let posts = await axios.get('/api/posts/list?cid=' + cid)
    let cates = await axios.get('/api/cates/list')
    var catename
    for (var i = 0, n = cates.length; i < n; i++) {
      if (cates[i].id === cid) {
        catename = cates[i].catename
        break
      }
    }
    return {
      title: catename,
      cates: cates.data,
      posts: posts.data
    }
  },
  methods: {
    catename(cid) {
      for (var i = 0, n = this.cates.length; i < n; i++) {
        if (this.cates[i].id === cid) {
          return this.cates[i].catename
        }
      }
      return ''
    }
  },
  filters: {
    addtime(str) {
      return dateFormat(new Date(str), 'yyyy-MM-dd')
    }
  }
}
</script>
<style scoped>
.entry-header{
  padding: 0 10%;
  overflow: auto;
}
.entry-title{
  font-size: 24px;
  line-height: 1.2308;
  margin-bottom: 1.2308em;
  margin: 20px 0 10px;
}
.entry-footer{
  padding: 10px 10%;
  background: #f7f7f7;
  color: rgba(51, 51, 51, 0.7);
}
.cate{
  font-weight: bold;
}
</style>
