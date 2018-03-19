<template>
  <section v-show="posts.length > 0">
    <article v-for="post in posts" :key="post.id">
      <div class="entry-header">
        <h2 class="entry-title">
          <nuxt-link :to="'/post/'+post.id">{{post.title}}</nuxt-link>
        </h2>
        <div class="entry-footer">
          <i class="fa fa-calendar"></i> {{post.addtime|addtime}}
          <span v-show="post.cid !== 0">
            <i class="fa fa-folder"></i>
            <nuxt-link :to="'/cate/'+post.cid" class="cate">{{catename(post.cid)}}</nuxt-link>
          </span>
          <i class="fa fa-tags"></i>
          {{post.tags|tags}}
        </div>
      </div>
    </article>
    <el-pagination
      background
      class="pages"
      layout="prev, pager, next"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      v-show="total > pageSize">
    </el-pagination>
  </section>
</template>
<script>
import axios from 'axios'
import {dateFormat} from '~/util/tools'
let pageSize = require('~/config').pageSize

export default {
  props: ['posts', 'total', 'url'],
  data() {
    return {
      pageSize: pageSize,
      cates: [],
      currentPage: 1
    }
  },
  created() {
    axios.get('/api/cates/list').then((res) => {
      this.cates = res.data
    })
  },
  methods: {
    handleCurrentChange(currentPage) {
      var url = this.url
      url = url.replace('?', currentPage)
      this.$router.push(url)
    },
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
    },
    tags(str) {
      if (!str) {
        return ''
      }
      return str.split(',').join(' ')
    }
  }
}
</script>
<style scoped>
article{
  margin-bottom: 10px;
  background: #fff;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.15);
}
.entry-header, .pages{
  padding: 0 5% 10px 5%;
  overflow: auto;
}
.entry-title{
  font-size: 24px;
  line-height: 1.2308;
  margin-bottom: 1.2308em;
  margin: 10px 0;
}
.entry-footer{
  padding: 10px;
  background: #f7f7f7;
  color: rgba(51, 51, 51, 0.7);
}
.cate{
  margin-left: 5px;
}
.pages{
  margin-top: 10px;
}
</style>
