<template>
  <div>
    <div class="left" style="width:500px;">
      <el-form label-position="right" label-width="100px">
        <el-form-item class="tit">
          <strong>自动备份设置</strong>
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
        <el-form-item label="发送频率">
          <el-select v-model="backupRate" placeholder="发送频率">
            <el-option value="day" label="每天"></el-option>
            <el-option value="hour" label="每小时"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save()">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="left testbox">
      <div class="tit">
        发送测试
      </div>
      <p>
        <button @click="sendTestEmail()">发送测试邮件</button>
        <button @click="zipBackupSendEmail()">打包发送</button>
      </p>
      <div class="testresult">
        {{testresult}}
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  layout: 'admin',
  data() {
    return {
      sendEmail: { // 发送信息
        host: '',
        user: '',
        pass: '',
        from: ''
      },
      receiveEmail: '', // 接收的Email
      backupRate: 'day', // 备份频率
      testresult: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      let result = await axios.get('/api/options/list?keys=sendEmail,receiveEmail,backupRate')
      if (result.data.data) {
        var sendEmail = result.data.data['sendEmail']
        try {
          sendEmail = JSON.parse(sendEmail)
          this.sendEmail = sendEmail
        } catch (e) {
          console.log(e)
        }
        this.receiveEmail = result.data.data['receiveEmail']
        this.backupRate = result.data.data['backupRate']
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
      let result3 = await axios.post('/api/options/update', {
        name: 'backupRate',
        value: this.backupRate
      })
      if (result1.data.rows > 0 && result2.data.rows > 0 && result3.data.rows > 0) {
        this.$message({
          message: '保存成功',
          duration: 2000
        })
      }
    },
    async sendTestEmail() {
      var url = '/api/backup/email'
      var result = await axios.get(url)
      if (result.data) {
        if (!result.data.err) {
          this.testresult = '发送成功'
        } else {
          this.testresult = '发送失败'
        }
      } else {
        this.testresult = '访问失败'
      }
    },
    async zipBackupSendEmail() {
      var url = '/api/backup/zip'
      var result = await axios.get(url)
      if (result.data) {
        if (!result.data.err) {
          this.testresult = '发送成功'
        } else {
          this.testresult = '发送失败'
        }
      } else {
        this.testresult = '访问失败'
      }
    }
  }
}
</script>
<style scoped>
.tit{
  font-weight: bold;
}
.testbox{
  width: 300px;
  margin-left: 10px;
}
.testresult{
  border: 1px solid #ccc;
  width: 300px;
  height: 280px;
}
</style>
