<template>
  <div class="installpage">
    <el-steps :active="step" simple>
      <el-step title="1.设置数据库" icon="el-icon-edit"></el-step>
      <el-step title="2.初始化数据库" icon="el-icon-tickets"></el-step>
    </el-steps>
    <el-form ref="form" :model="config" class="inputform" label-width="80px" v-loading="isloading" v-show="step==1">
      <el-form-item label="域名">
        <el-input v-model="config.host"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="config.user"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="config.password"></el-input>
      </el-form-item>
      <el-form-item label="数据库">
        <el-input v-model="config.database"></el-input>
      </el-form-item>
      <el-form-item label="token盐">
        <el-input v-model="config.jwtSecret"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">连接数据库</el-button>
      </el-form-item>
    </el-form>
    <div class="result" v-show="step==2">
      <div class="resultarea">
        <p v-for="(result,index) in results" :key="index">{{result}}</p>
      </div>

      <el-button type="primary" @click="goadmin" v-show="isFinish">点击登陆</el-button>
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
      step: 1,
      config: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'nuxtkoablog',
        jwtSecret: ''
      },
      results: [],
      isloading: false,
      isFinish: false
    }
  },
  methods: {
    async save() {
      this.isloading = true
      var url = '/api/install/setConfig'
      var params = this.config
      let fileresult = await axios.post(url, params)
      if (fileresult.error) {
        this.$alert('配置写入文件失败，请查看相应配置', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.step = 2
      this.results.push('配置写入文件成功！')

      url = '/api/install/installtable'
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
</style>
