<template>
  <div>
    <p>
      提示：<i>请保证系统能够使用gunzip、mysqldump、mysql命令</i>
    </p>
    <Tabs v-model="show" type="card">
      <TabPane label="备份列表" name="list"></TabPane>
      <TabPane label="备份设置" name="set"></TabPane>
    </Tabs>
    <div class="list" v-if="show=='list'">
      <p>
        <input type="file" @change="handleFile($event)" />
        <button @click="do_upload()">上传文件</button>
      </p>
      <table border="1" cellspacing="0">
        <thead>
          <tr>
            <th>序号</th>
            <th>备份名称</th>
            <th>大小</th>
            <th style="width: 120px;">操作</th>
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
        <Form label-position="right" label-width="100px">
          <FormItem class="tit">
            <strong>自动备份设置</strong>
          </FormItem>
          <div class="send">
            <FormItem label="host">
              <Input v-model="sendEmail.host" placeholder="host"></Input>
            </FormItem>
            <FormItem label="用户名">
              <Input v-model="sendEmail.user" placeholder="用户名"></Input>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="sendEmail.pass" placeholder="密码"></Input>
            </FormItem>
            <FormItem label="发送名">
              <Input v-model="sendEmail.from" placeholder="发送名"></Input>
            </FormItem>
          </div>
          <FormItem label="接收Email">
            <Input v-model="receiveEmail" placeholder="接收Email"></Input>
          </FormItem>
          <FormItem label="发送频率">
            <Select v-model="backupRate" placeholder="发送频率">
              <Option value="day" label="每天"></Option>
              <Option value="hour" label="每小时"></Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="save()">保存</Button>
          </FormItem>
        </Form>
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
      testresult: '',
      uploadfile: null
    }
  },
  created() {
    this.getData()
    this.getBackList()
  },
  methods: {
    async getBackList() {
      let res = await this.$axios.$get('/api/backup/list')
      this.backupList = res.data
    },
    async getData() { // 获取基本配置信息
      let result = await this.$axios.$get('/api/options/list?keys=sendEmail,receiveEmail,backupRate')
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
      let result1 = await this.$axios.post('/api/options/update', {
        name: 'sendEmail',
        value: JSON.stringify(this.sendEmail)
      })
      let result2 = await this.$axios.post('/api/options/update', {
        name: 'receiveEmail',
        value: this.receiveEmail
      })
      let result3 = await this.$axios.post('/api/options/update', {
        name: 'backupRate',
        value: this.backupRate
      })
      if (result1.data.rows > 0 && result2.data.rows > 0 && result3.data.rows > 0) {
        this.$Message.info({
          content: '保存成功',
          duration: 2
        })
      }
    },
    async sendTestEmail() { // 发生测试邮件
      var url = '/api/backup/email'
      var result = await this.$axios.$get(url)
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
      var result = await this.$axios.$get(url)
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
        let res = await this.$axios.post(url, params)
        if (res.data) {
          this.getBackList()
          this.$Message.info({
            content: '删除成功',
            duration: 2
          })
        }
      }).catch(() => {
        this.$Message.info({
          content: '取消删除'
        })
      })
    },
    restoreBackup(name, str) { // 恢复操作
      let showstr = str || '您确认要恢复吗？'
      this.$confirm(showstr, '恢复数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        loading: true,
        type: 'warning'
      }).then(async () => {
        let url = '/api/backup/restore'
        let params = {
          name: name
        }
        let res = await this.$axios.post(url, params)
        if (res.data) {
          this.$Message.info({
            content: '恢复成功',
            duration: 2
          })
        }
      }).catch(() => {
        this.$Message.info({
          content: '取消恢复'
        })
      })
    },
    handleFile(event) {
      this.uploadfile = event.target.files[0]
    },
    async do_upload() {
      var formData = new FormData()
      formData.append('upfile', this.uploadfile, this.uploadfile.name)
      let res = await this.$axios.post('/api/backup/upload', formData)
      if (res && res.data && res.data.code === 200 && res.data.name) {
        this.getBackList()
        this.restoreBackup(res.data.name, '上传成功，需要恢复数据吗？')
      }
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
