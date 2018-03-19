const config = require('../../config')
const cp = require('child_process');
console.log(config)
/**
 * 备份数据库并压缩
 * @param  {[type]}   conf     [配置]
 * @param  {Function} callback [回调]
 */
module.exports.backup = function(callback){
  cp.exec('mysqldump --user='+config.mysqlConfig.user+' --password='+config.mysqlConfig.password+' '+config.mysqlConfig.database+' | gzip > out/'+config.mysqlConfig.fileName+'',
  function(err,stdout,stderr){
    if(err) {
      callback('error','备份数据库发生错误:'+stderr);
      return ;
    }
    callback();
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
module.exports.backupEmail = function(conf, obj, callback) {
  // var filepath = './out/nuxtkoablog.sql.gz'
  var filepath = obj.filepath
  var filename = filepath.substr(filepath.lastIndexOf('/') + 1)
  var nodemailer = require('nodemailer')
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
    attachments: [
      {
        filename: filename,
        path: filepath
      }
    ]
  }
  transporter.sendMail(option, function (error, response) {
    callback({err: true, message: response.message})
  })
}
