<template>
  <div>
    <nuxt-link to="/admin/notes">打开日志页面</nuxt-link>
  </div>
</template>
<script>
  export default {
    layout: 'admin',
    name: 'admin',
    head: {
      title: '后台管理'
    }
  }
</script>
