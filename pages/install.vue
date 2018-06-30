<template>
  <div class="installpage">
    <div class="result">
      <div class="resultarea">
        <p v-for="(result,index) in results" :key="index">{{result}}</p>
      </div>
      <div class="btns">
        <el-button type="primary" @click="save" v-if="!isFinish">点击安装</el-button>
        <el-button type="primary" @click="goadmin" v-if="isFinish">点击登陆</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  layout: 'bank',
  title: '安装',
  data() {
    return {
      results: [],
      isloading: false,
      isFinish: false
    }
  },
  methods: {
    async save() {
      this.isloading = true
      // this.results.push('配置写入文件成功！')

      let url = '/api/install/installtable'
      let installresult = await axios.post(url, [])
      if (installresult.data) {
        var result = installresult.data
        this.results.push(...result)
        this.isFinish = true
      }
    },
    goadmin() {
      this.$router.push('/login')
    }
  }
}
</script>
<style scoped>
.installpage{
  width: 500px;
  margin: 20px auto;
}
.inputform, .result{
  margin: 20px;
}
.resultarea{
  width:500px;
  height:300px;
  overflow: auto;
  border: 1px solid #ccc;
}
.btns{
  margin: 5px 0;
}
</style>
