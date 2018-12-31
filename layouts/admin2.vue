<template>
  <div class="layout">
    <nuxt></nuxt>
  </div>
</template>
<script>
import { removeToken } from '../util/tools'
export default {
  methods: {
    logout() {
      removeToken()
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
.layout{
}
</style>
