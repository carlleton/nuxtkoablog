/* eslint-disable */
// 此文件只用在服务端
const moment = require('moment')
const cp = require('child_process')
const nodemailer = require('nodemailer')
const config = require('../config')

/**
 * 备份数据库并压缩
 * @param  {[type]}   conf     [配置]
 * @param  {Function} callback [回调]
 */
module.exports.zip = async () => {
  var filename = 'out/' + config.mysqlConfig.database+moment().format('YYYYMMDD')+'.sql.gz'
  return new Promise((resolve, reject) => {
    var command = 'mysqldump --user='+config.mysqlConfig.user+' --password='+config.mysqlConfig.password+' '+config.mysqlConfig.database+' | gzip > '+filename
    cp.exec(command, (err,stdout,stderr) => {
      if (err) {
        console.log('备份数据库发生错误:'+stderr)
        reject('')
      } else {
        resolve(filename)
      }
    })
  })
}

/**
 * 发送备份到邮箱
 * @param  {[type]} obj [发送email的参数]
 *                      {
 *                        subject: '',//发送邮件的主题
 *                        html: '',//发送邮件的内容
 *                        filepath: ''//发送附件路径
 *                      }
 * @param {callback}  [回调]
 * @return {[type]}   [description]
 */
module.exports.email = function(conf, obj, callback) {
  var transporter = nodemailer.createTransport({
    host: conf.sendEmail.host,
    secureConnection: true,
    port: 465,
    auth: {
      user: conf.sendEmail.user,
      pass: conf.sendEmail.pass
    }
  })
  // 发送邮件
  var option = {
    from: conf.sendEmail.from,
    to: conf.receiveEmail,
    subject: obj.subject,
    html: obj.html,
    attachments: []
  }
  if (obj.filepath) {
    var filepath = obj.filepath
    var filename = filepath.substr(filepath.lastIndexOf('/') + 1)
    option.attachments.push({
      filename: filename,
      path: filepath
    })
  }
  transporter.sendMail(option, function (error) {
    callback({err: error})
  })
}

/* eslint-enable */
