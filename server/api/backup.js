import Options from '../models/Options'
const router = require('koa-router')()
const _ = require('lodash')
const backup = require('../../util/backup')
const moment = require('moment')

let optionsModel = new Options()

// 发送邮件
var sendEmail = async function (obj) {
  var params = {
    keys: 'sendEmail,receiveEmail'
  }
  var result = await optionsModel.list(params)
  var list = result[0]
  var data = {}
  for (var key in list) {
    data[list[key].name] = list[key].value
  }
  var sendEmail = JSON.parse(data['sendEmail'])
  var receiveEmail = data['receiveEmail']
  var conf = {
    sendEmail,
    receiveEmail
  }
  return backup.email(conf, obj)
}

// 发送测试邮件
router.get('/email', async (ctx, next) => {
  var obj = {
    subject: '这是一封测试邮件',
    html: '这是测试邮件的内容'
  }
  var result = await sendEmail(obj)
  ctx.status = 200
  ctx.body = result
})

// 打包数据库发送到邮箱
router.get('/zip', async (ctx, next) => {
  var filename = await backup.zip()
  var obj = {
    subject: '数据备份' + moment().format('YYYYMMDD'),
    html: '',
    filepath: filename
  }
  var result = await sendEmail(obj)
  var lastBackupTime = (new Date()).getTime()
  await optionsModel.update({
    name: 'lastBackupTime',
    value: lastBackupTime
  })
  result.lastBackupTime = lastBackupTime
  ctx.status = 200
  ctx.body = result
})

// 备份列表
router.get('/list', async (ctx, next) => {
  let folder = 'out/zip'
  let files = await backup.readfolder(folder)
  ctx.status = 200
  ctx.body = files
})

// 删除备份文件
router.post('/del', async (ctx, next) => {
  let name = ctx.request.body.name
  let result = await backup.delBackup(name)
  ctx.status = 200
  ctx.body = result
})

// 还原备份
router.post('/restore', async (ctx, next) => {
  let name = ctx.request.body.name
  let result = await backup.restore(name)
  ctx.status = 200
  ctx.body = result
})

module.exports = router
