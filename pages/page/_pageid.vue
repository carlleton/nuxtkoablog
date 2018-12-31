<template>
  <section>
    <ArticleList :posts="posts" :total="total" url="/page/?"></ArticleList>
  </section>
</template>
<script>
import axios from 'axios'
import ArticleList from '~/components/ArticleList.vue'

export default {
  head() {
    return {
      title: '首页'
    }
  },
  validate({ params }) {
    return /^\d+$/.test(params.pageid)
  },
  async asyncData({params}) {
    var page = params.pageid
    let posts = await axios.get('/api/posts/list?page=' + page)
    return {
      posts: posts.data.data,
      total: posts.data.total
    }
  },
  components: {
    ArticleList
  }
}
</script>
<style scoped>

</style>
