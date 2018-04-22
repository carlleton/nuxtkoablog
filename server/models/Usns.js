let db = require('../../util/db')

export default class Cates {

  ids(tablename) {
    let sql = `select id from ${tablename}`
    return db.query(sql, [])
  }

  create(obj) {
    let sql = 'insert into usns (tag, tagid, usn, updatetime, state) values (?, ?, ?, ?, ?)'
    let params = [
      obj.tag,
      obj.tagid,
      obj.usn,
      Date.now(),
      obj.state
    ]
    return db.query(sql, params)
  }

}