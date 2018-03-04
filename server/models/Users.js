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
}
