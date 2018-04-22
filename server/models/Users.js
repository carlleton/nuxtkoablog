let crypto = require('crypto')
let db = require('../../util/db')

export default class Users {
  // 验证用户名密码
  auth(user) {
    let sql = "select id,role from users where username = ? and password = ?"
    //密码加密
    user.userpass = crypto.createHash('sha1').update(user.userpass).digest('hex')
    return db.query(sql, [user.username, user.userpass])
  }
  // 更改密码
  changePass(params) {
    let sql = "update users set password = ? where username = ? and password = ?"
    params.oldpass = crypto.createHash('sha1').update(params.oldpass).digest('hex')
    params.newpass = crypto.createHash('sha1').update(params.newpass).digest('hex')
    return db.query(sql, [params.newpass, params.username, params.oldpass])
  }
}
