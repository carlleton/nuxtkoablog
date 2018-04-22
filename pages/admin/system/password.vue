<template>
  <div style="width:500px;">
    <el-form label-position="right" label-width="100px">
      <el-form-item class="tit">
        <strong>密码管理</strong>
      </el-form-item>
      <el-form-item label="旧密码">
        <el-input type="password" v-model="oldpass" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input type="password" v-model="newpass" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="重新输入">
        <el-input type="password" v-model="repass" placeholder="请重新输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePass()">更改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import { getUserName } from '../../../util/tools'

export default {
  layout: 'admin',
  data() {
    return {
      oldpass: '',
      newpass: '',
      repass: ''
    }
  },
  methods: {
    async changePass() {
      if (this.newpass !== this.repass) {
        this.$message({
          message: '新密码和确认密码必须一致',
          type: 'error'
        })
      }
      let url = '/api/users/changePass'
      let params = {
        username: getUserName(),
        oldpass: this.oldpass,
        newpass: this.newpass
      }
      let res = await axios.post(url, params)
      if (res.data && res.data.code === 200) {
        this.$message({
          message: '更改成功',
          duration: 2000
        })
      }
    }
  }
}
</script>
