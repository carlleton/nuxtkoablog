<template>
  <div>
    <el-form label-position="right" label-width="100px" style="width:500px;">
      <el-form-item>
        自动备份设置
      </el-form-item>
      <div class="send">
        <el-form-item label="host">
          <el-input v-model="sendEmail.host" placeholder="host"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="sendEmail.user" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="sendEmail.pass" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="发送名">
          <el-input v-model="sendEmail.from" placeholder="发送名"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="接收Email">
        <el-input v-model="receiveEmail" placeholder="接收Email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  layout: 'admin',
  data() {
    return {
      sendEmail: {
        host: '',
        user: '',
        pass: '',
        from: ''
      },
      receiveEmail: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      let result = await axios.get('/api/options/list?keys=sendEmail,receiveEmail')
      if (result.data.data) {
        var sendEmail = result.data.data['sendEmail']
        try {
          sendEmail = JSON.parse(sendEmail)
          this.sendEmail = sendEmail
        } catch (e) {
          console.log(e)
        }
        this.receiveEmail = result.data.data['receiveEmail']
      }
    },
    async save() {
      let result1 = await axios.post('/api/options/update', {
        name: 'sendEmail',
        value: JSON.stringify(this.sendEmail)
      })
      let result2 = await axios.post('/api/options/update', {
        name: 'receiveEmail',
        value: this.receiveEmail
      })
      if (result1.data.rows > 0 && result2.data.rows > 0) {
        this.$message({
          message: '保存成功',
          duration: 2000
        })
      }
    }
  }
}
</script>
