let crypto = require('crypto')
let db = require('../utils/db')

export default class Users {
  // 验证用户名密码
  auth(user) {
    let sql = "select id,role from users where username = ? and password = ?"
    //密码加密
    user.userpass = this.createpass(user.userpass)
    return db.query(sql, [user.username, user.userpass])
  }
  // 更改密码
  changePass(params) {
    let sql = "update users set password = ? where username = ? and password = ?"
    params.oldpass = this.createpass(params.oldpass)
    params.newpass = this.createpass(params.newpass)
    return db.query(sql, [params.newpass, params.username, params.oldpass])
  }
  createpass(userpass) {
    return crypto.createHash('sha1').update(userpass).digest('hex')
  }
}