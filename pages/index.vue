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
  async asyncData({params}) {
    let posts = await axios.get('/api/posts/list')
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
