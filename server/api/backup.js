import Options from '../models/Options'
const router = require('koa-router')()
const _ = require('lodash')
const backup = require('../../util/backup')
const moment = require('moment')

let optionsModel = new Options()

var sendEmail = async function(obj) {
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
  return new Promise((resolve, reject) => {
    backup.email(conf, obj, (result) => {
      resolve(result)
    })
  })
}

router.get('/email', async (ctx, next) => {
  var obj = {
    subject: '这是一封测试邮件',
    html: '这是测试邮件的内容'
  }
  var result = await sendEmail(obj)
  ctx.status = 200
  ctx.body = result
})

router.get('/zip', async (ctx, next) => {
  var filename = await backup.zip()
  var obj = {
    subject: '数据备份' + moment().format('YYYYMMDD'),
    html: '',
    filepath: filename
  }
  var result = await sendEmail(obj)
  var result_update = await optionsModel.update({
    name: 'lastBackupTime',
    value: (new Date()).getTime()
  })
  ctx.status = 200
  ctx.body = result
})

module.exports = router
