<template>
  <el-container>
    <el-aside width="200px" class="cates">
      <div class="catestit">
        <i class="fa fa-book fa-left"></i>
        笔记本
      </div>
      <!-- 分类 -->
      <Cates :cateid.sync="cateid" :catename.sync="catename"></Cates>
    </el-aside>
    <el-aside width="250px" class="notes">
      <div class="notestit">
        {{catename}}
      </div>
      <!-- 笔记列表 -->
      <Notes :cateid="cateid" :noteid.sync="noteid"></Notes>
    </el-aside>
    <el-main>
      <!-- 编辑器 -->
    </el-main>
  </el-container>
</template>
<script>
import Cates from '~/components/admin/note/cates'
import Notes from '~/components/admin/note/notes'

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
      catename: '最新',
      noteid: 0,
      cates: []
    }
  },
  created() {
  },
  methods: {
  },
  components: {
    Cates,
    Notes
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
  background: #41586e;
  color: #ccc;
  border-right: 1px solid #ccc;
  overflow: auto;
}
.catestit{
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
}
.notestit{
  background-color: #eee;
  border-bottom: 1px solid #ebeff2;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
}
.notes{
  background-color: #fff;
  border: 1px solid #cfcfcf;
}
</style>
