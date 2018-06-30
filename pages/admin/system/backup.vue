<template>
  <div>
    <p>
      提示：<i>请保证系统能够使用gunzip、mysqldump、mysql命令</i>
    </p>
    <el-tabs v-model="show" type="card">
      <el-tab-pane label="备份列表" name="list"></el-tab-pane>
      <el-tab-pane label="备份设置" name="set"></el-tab-pane>
    </el-tabs>
    <div class="list" v-if="show=='list'">
      <table border="1" cellspacing="0">
        <thead>
          <tr>
            <th>序号</th>
            <th>备份名称</th>
            <th>大小</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in backupList" :key="index">
            <td>{{index + 1}}</td>
            <td>
              <a href="#" @click="restoreBackup(item.name)">
                {{item.name}}
              </a>
            </td>
            <td>{{item.size|filesize}}</td>
            <td>
              <a href="#" @click="restoreBackup(item.name)">还原备份</a>
              &nbsp;&nbsp;
              <a href="#" @click="delBackup(item.name)">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="set" v-if="show=='set'">
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
  </div>
</template>
<script>
import axios from 'axios'

export default {
  layout: 'admin',
  data() {
    return {
      show: 'list',
      backupList: [],
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
    this.getBackList()
  },
  methods: {
    async getBackList() {
      let res = await axios.get('/api/backup/list')
      this.backupList = res.data
    },
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
    async save() { // 保存设置
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
    async sendTestEmail() { // 发生测试邮件
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
    async zipBackupSendEmail() { // 打包发送
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
    },
    delBackup(name) { // 删除备份文件
      this.$confirm('您确认要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        loading: true,
        type: 'warning'
      }).then(async () => {
        let url = '/api/backup/del'
        let params = {
          name: name
        }
        let res = await axios.post(url, params)
        if (res.data) {
          this.getBackList()
          this.$message({
            message: '删除成功',
            duration: 2000
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    restoreBackup(name) { // 恢复操作
      this.$confirm('您确认要恢复吗？', '恢复数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        loading: true,
        type: 'warning'
      }).then(async () => {
        let url = '/api/backup/restore'
        let params = {
          name: name
        }
        let res = await axios.post(url, params)
        if (res.data) {
          this.$message({
            message: '恢复成功',
            duration: 2000
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消恢复'
        })
      })
    }
  },
  filters: {
    filesize(size) {
      let str = ''
      if (size < 1024) {
        str = size + 'B'
      } else {
        let K = size / 1024
        if (K < 1024) {
          str = K.toFixed(2) + 'KB'
        } else {
          let M = size / 1024 / 1024
          str = M.toFixed(2) + 'MB'
        }
      }
      return str
    }
  }
}
</script>
<style lang="scss" scoped>
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
.set{
  overflow: auto;
}
.list{
  table{
    width: 100%;
    border: 1px solid #ccc;
    padding: 0;
    td{
      padding: 5px;
      a{
        outline: none;
      }
    }
  }
}
</style>
