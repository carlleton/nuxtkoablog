<template>
  <div>
    <el-form :model="options" label-position="right" label-width="100px" style="width:500px;">
      <el-form-item label="每页文章数" prop="pageSize">
        <el-input v-model="pageSize"></el-input>
      </el-form-item>
      <el-form-item label="备份使用的目录" prop="backupfolder">
        <el-input v-model="backupfolder"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
let options = require('~/config/options')
export default {
  layout: 'admin',
  data() {
    return {
      options: options
    }
  }
}
</script>
<style>

</style>
