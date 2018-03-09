<template>
  <el-container>
    <el-aside width="200px" class="cates">
      <!-- 分类 -->
      <Cates :cateid.sync="cateid"></Cates>
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
import Cates from '~/components/admin/note/cates'

export default {
  layout: 'admin2',
  head() {
    return {
      title: '笔记'
    }
  },
  data() {
    return {
      cateid: 0,
      cates: []
    }
  },
  created() {
  },
  methods: {
  },
  components: {
    Cates
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
