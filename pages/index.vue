<template>
  <section class="container">
    <img src="../assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Universal Vue.js Application Framework
    </h1>
    <nuxt-link class="button" to="/about">
      About page
    </nuxt-link>
  </section>
</template>
<script>
  export default {
    serverCacheKey() {
      // Will change every 10 minutes
      return Math.floor(Date.now() / 600000)
    }
  }
</script>
<style scoped>
.title
{
  margin: 50px 0;
}
</style>
