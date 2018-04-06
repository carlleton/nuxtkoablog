<template>
  <a class="backup" @click="checkBackup">备份一下</a>
</template>
<script>
import axios from 'axios'
const moment = require('moment')

export default {
  computed: {
    lastBackupTime() {
      return this.$store.state.lastBackupTime
    }
  },
  methods: {
    async checkBackup() {
      var lastBackupTime = this.$store.state.lastBackupTime
      if (!lastBackupTime) {
        var result = await axios.get('/api/options/lastBackupTime')
        lastBackupTime = result.data
        this.$store.commit('setLastBackupTime', lastBackupTime)
      }
      // var now = (new Date()).getTime()

      var str = '上次备份时间是' + moment(lastBackupTime).lang('zh-cn').fromNow() + '(' + moment(lastBackupTime).format('YYYY-MM-DD mm:ss') + ')，您确认要备份吗？'
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var backupresult = await axios.get('/api/backup/zip')
        if (!backupresult.data.err) {
          lastBackupTime = backupresult.data.lastBackupTime
          this.$store.commit('setLastBackupTime', lastBackupTime)
          this.$message('备份成功')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消备份'
        })
      })
    }
  }
}
</script>
<style scoped>
.backup{
  cursor: pointer;
  font-size: 14px;
  margin: 0 10px;
}
</style>
