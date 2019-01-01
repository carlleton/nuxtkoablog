<template>
  <section>
    <ArticleList :posts="posts" :total="total" :url="'/cate/' + cid + '/page/?'"></ArticleList>
  </section>
</template>
<script>
import ArticleList from '~/components/ArticleList.vue'

export default {
  head() {
    return {
      title: this.title
    }
  },
  validate({ params }) {
    return /^\d+$/.test(params.cid)
  },
  async asyncData({params, $axios}) {
    var cid = ~~params.cid
    let posts = await $axios.$get('/api/posts/list?cid=' + cid)
    let cates = await $axios.$get('/api/cates/list')
    var catename = '未定义'
    for (var i = 0, n = cates.data.length; i < n; i++) {
      if (cates.data[i].id === cid) {
        catename = cates.data[i].catename
        break
      }
    }
    return {
      title: catename,
      cates: cates.data,
      posts: posts.data.data,
      total: posts.data.total,
      cid: cid
    }
  },
  components: {
    ArticleList
  }
}
</script>
<style scoped>
</style>
