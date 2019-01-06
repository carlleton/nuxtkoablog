<template>
  <div class="installpage">
    <div class="result">
      <div class="resultarea" v-if="results && results.length > 0">
        <p v-for="(result,index) in results" :key="index">{{result}}</p>
      </div>
      <Form ref="form" :model="user" label-width="80px" v-if="!isFinish" style="margin-top: 10px;">
        <FormItem>
          <h3>安装系统</h3>
        </FormItem>
        <FormItem label="用户名">
          <Input v-model="user.username" placeholder="管理页用户名"></Input>
        </FormItem>
        <FormItem label="密码">
          <Input type="password" v-model="user.userpass" placeholder="管理页用户名"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="save">点击安装</Button>
        </FormItem>
      </Form>
      <div class="btns">
        <Button type="primary" @click="goadmin" v-if="isFinish">点击登陆</Button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'bank',
  title: '安装',
  data() {
    return {
      user: {
        username: '',
        userpass: ''
      },
      results: [],
      isloading: false,
      isFinish: false
    }
  },
  methods: {
    async save() {
      this.isloading = true
      // this.results.push('配置写入文件成功！')
      if (!this.user.username || !this.user.userpass) {
        this.$message({
          type: 'info',
          message: '请输入账户和密码'
        })
        return
      }

      let url = '/api/install/installtable'
      let params = {
        username: this.user.username,
        userpass: this.user.userpass
      }
      let installresult = await this.$axios.post(url, params)
      if (installresult.data) {
        var result = installresult.data.results
        this.results.push(...result)
        if (!installresult.data.error) {
          this.isFinish = true
        }
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
