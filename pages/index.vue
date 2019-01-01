<template>
  <section>
    <ArticleList :posts="posts" :total="total" url="/page/?"></ArticleList>
  </section>
</template>
<script>
import ArticleList from '~/components/ArticleList.vue'

export default {
  head () {
    return {
      title: '首页'
    }
  },
  async asyncData ({ params, $axios }) {
    let posts = await $axios.$get('/api/posts/list?page=1')
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
