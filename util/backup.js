/* eslint-disable */
// 此文件只用在服务端
const moment = require('moment')
const cp = require('child_process')
const nodemailer = require('nodemailer')
const config = require('../server/config')
const mysqlConfig = JSON.parse(process.env.mysqlConfig)
const fs = require('fs')
const path = require('path')

/**
 * 备份数据库并压缩
 * @param  {[type]}   conf     [配置]
 * @param  {Function} callback [回调]
 */
let zip = () => {
  var filename = 'out/zip/' + mysqlConfig.database+moment().format('YYYYMMDDHHmmss')+'.sql.gz'
  return new Promise((resolve, reject) => {
    var command = 'mysqldump --user='+mysqlConfig.user+' --password='+mysqlConfig.password+' '+mysqlConfig.database+' | gzip > '+filename
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

let install = (name) => {
  var filename = 'out/zip/' + name +'.sql.gz'
  return new Promise((resolve, reject) => {
    var command = 'mysqldump --user='+mysqlConfig.user+' --password='+mysqlConfig.password+' '+mysqlConfig.database+' | gzip > '+filename
    cp.exec(command, (err,stdout,stderr) => {
      if (err) {
        console.log('还原数据库发生错误:'+stderr)
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
function email(conf, obj, callback) {
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
  return new Promise((resolve, reject) => {
    transporter.sendMail(option, function (error, info) {
      resolve({err: error, message: info})
    })
  })

}

// 读取目录下文件
function readfolder (folder) {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, async (err, files) => {
      if (!err) {
        let list = []
        for (let i = 0, n = files.length; i < n; i++) {
          let file = files[i]
          if (file.indexOf('.') === 0) {
            continue
          }
          let curFolder = folder
          if (folder.lastIndexOf('/') !== folder.length - 1) {
            curFolder += '/'
          }
          let statInfo = fs.statSync(curFolder + file)
          list.push({
            file,
            name: file.replace(curFolder, '').replace('.sql.gz', ''),
            size: statInfo.size
          })
        }
        resolve(list)
      } else {
        reject(err)
      }
    })
  })
}
// 删除备份文件
function delBackup (name) {
  let file = 'out/zip/' + name + '.sql.gz'
  return new Promise((resolve, reject) => {
    fs.unlink(file, (err) => {
      if (!err) {
        resolve(true)
      } else {
        reject(false)
      }
    })
  })
}
// 恢复
function restore (name) {
  let filename, command
  if (name.indexOf('.') > -1) {
    filename = 'out/zip/' + name
  } else {
    filename = 'out/zip/' + name + '.sql.gz'
  }
  if (filename.lastIndexOf('.sql') === filename.length - 1) {
    command = 'mysql -h'+mysqlConfig.host+' -u'+mysqlConfig.user+' -p'+mysqlConfig.password+' '+mysqlConfig.database+' < ' + filename
  } else if (filename.lastIndexOf('.sql.gz')) {
    command = 'gunzip < ' + filename + ' | mysql -u'+ mysqlConfig.user +' -p'+mysqlConfig.password+' '+mysqlConfig.database
  }
  return new Promise((resolve, reject) => {
    cp.exec(command, (err,stdout,stderr) => {
      if (err) {
        console.log('还原数据库发生错误:'+stderr)
        reject('')
      } else {
        resolve(filename)
      }
    })
  })
}

module.exports = {
  zip,
  install,
  email,
  readfolder,
  delBackup,
  restore
}
/* eslint-enable */
