<template>
  <section>
    <article>
      <div class="entry-header">
        <h2 class="entry-title">
          <nuxt-link :to="'/post/'+post.id">{{post.title}}</nuxt-link>
        </h2>
      </div>
      <div class="entry-content md" v-html="markdownhtml">
      </div>
      <div class="entry-footer">
        <i class="el-icon-date"></i> {{post.addtime|addtime}}
        <i class="el-icon-document"></i>
        <nuxt-link :to="'/cate/'+post.cid" class="cate">{{catename(post.cid)}}</nuxt-link>
        <i class="fa fa-tags"></i>
        {{post.tags|tags}}
      </div>
    </article>
  </section>
</template>
<script>
import hljs from 'highlight.js'
import axios from 'axios'
import {dateFormat} from '~/util/tools'
import 'highlight.js/styles/dark.css'
import '~/assets/css/yeh-md-theme.css'
import '~/assets/css/ocean.min.css'

let marked = require('marked')
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  }
})

export default {
  head() {
    return {
      title: this.title
    }
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async asyncData({params}) {
    let postdata = await axios.get('/api/posts/' + params.id)
    let post = postdata.data
    let cates = await axios.get('/api/cates/list')
    var markdownhtml = marked(post.content)
    return {
      title: post.title,
      cates: cates.data,
      post: post,
      markdownhtml: markdownhtml
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
.entry-header{
  padding: 0 5%;
  overflow: auto;
}
.entry-title{
  font-size: 24px;
  line-height: 1.2308;
  margin-bottom: 1.2308em;
  margin: 20px 0 10px;
  text-align: center;
}
.entry-content{
  padding: 10px;
}
.entry-footer{
  padding: 10px;
  background: #f7f7f7;
  color: rgba(51, 51, 51, 0.7);
}
.cate{
  margin-left: 5px;
}
</style>
