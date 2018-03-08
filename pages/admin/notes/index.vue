<template>
  <el-container>
    <el-aside width="200px" class="cates">
      <!-- 分类 -->
    </el-aside>
    <el-aside width="200px" class="articles">
      <!-- 笔记列表 -->
    </el-aside>
    <el-main>
      <!-- 编辑器 -->
    </el-main>
  </el-container>
</template>
<script>
import axios from 'axios'

export default {
  layout: 'admin2',
  head() {
    return {
      title: '日记'
    }
  },
  data() {
    return {
      cates: []
    }
  },
  created() {
    this.getCatesData()
  },
  methods: {
    async getCatesData() {
      let cates = await axios.get('/api/notecates/list')
      this.cates = cates.data
    }
  }
}
</script>
<style scoped>
.el-container{
  position: fixed;
  width: 100%;
  height: calc(100% - 60px);
  top: 60px;
}
.cates{
  background-color: #bbb;
  border-right: 1px solid #ccc;
}
.articles{
  background-color: #bbb;
}
</style>
