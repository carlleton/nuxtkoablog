let db = require('../utils/db')

export default class Options {

  // 根据页码获取当前页Post列表
  list(obj) {
    var sendParams = []
    var sql = ''
    if (obj.keys) {
      var keys = obj.keys.split(',')
      var keystr = new Array(keys.length + 1).join('?').split('').join(',')

      sql += ` and name in (${keystr})`
      for (var i = 0, n = keys.length; i < n; i++) {
        sendParams.push(keys[i])
      }
    }
    if (obj.uid) {
      sql += ' and uid = ?'
      sendParams.push(obj.uid)
    }

    var totalsql = 'select count(id) as total from options where 1=1' + sql
    var listsql = 'select * from options where 1=1' + sql

    var listdata = new Promise((resolve, reject) => {
      db.query(listsql, sendParams).then((res) => {
        if (res.err) {
          reject(res.err)
        } else {
          resolve(res.result)
        }
      })
    })
    var totaldata = new Promise((resolve, reject) => {
      db.query(totalsql, sendParams).then((res) => {
        if (res.err) {
          reject(res.err)
        } else {
          resolve(res.result[0])
        }
      })
    })
    return Promise.all([listdata, totaldata])
  }

  // 根据id获取Post详情
  one(name, uid) {
    let sql = 'select * from options where name = ? and uid = ?'
    return db.query(sql, [name, uid])
  }

  // 插入Post
  add(post) {
    let sql = 'insert into options (id, name, value, uid) values (?, ?, ?, ?)'
    let params = [
      post.id,
      post.name,
      post.value,
      post.uid
    ]
    return db.query(sql, params)
  }

  // 更新信息
  update(option) {
    var params = []
    var sql = 'update options set value = ? where name = ? and uid = ?'
    params.push(option.value)
    params.push(option.name)
    params.push(option.uid)

    return db.query(sql, params)
  }

  // 删除信息
  del(name, uid) {
    var sql = 'delete from options where name = ? and uid = ?'
    return db.query(sql, [name, uid])
  }
}
