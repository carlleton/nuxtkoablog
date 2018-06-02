let db = require('../../util/db')
let pageSize = process.env.pageSize

export default class Cates {

  // 根据页码获取当前页Post列表
  list(obj) {
    var params = []
    var sql = 'select * from cates where 1=1'
    if (obj.pid) {
      sql += ' and pid = ?'
      params.push(obj.pid)
    }
    if (obj.deepid) {
      sql += ` and path like concat((select path from cates where id = ?),'%')`
      params.push(obj.deepid)
    }
    sql += ' order by path asc,orderid asc,id asc'
    return db.query(sql, params)
  }

  // 根据id获取Post详情
  one(id) {
    var sql = 'select * from cates where id = ?'
    return db.query(sql, [id])
  }

  find({where,order,limit}) {
    var sql = 'select * from cates where 1 = 1'
    if (where) {
      sql += ' and ' + where
    }
    if (order) {
      sql += ' order by ' + order
    }
    if (limit) {
      sql += ' limit ' + limit
    }
    return db.query(sql, [])
  }

  findids(ids) {
    let sql = 'select * from cates where id in (?)'
    let params = [ids]
    return db.query(sql, params)
  }

  // 插入Post
  add(obj) {
    let sql = 'insert into cates (catename,pid,orderid,path) values (?, ?, ?, ?)'
    let params = [
      obj.catename,
      obj.pid,
      obj.orderid,
      obj.path
    ]
    return db.query(sql, params)
  }

  // 更新信息
  update(obj) {
    var updated = []
    var params = []
    for (var key in obj) {
      if (key === 'id') {
        continue
      }
      updated.push(key + ' = ?')
      params.push(obj[key])
    }
    var sql = 'update cates set ' + updated.join(',') + ' where id = ?'
    params.push(obj.id)

    return db.query(sql, params)
  }

  // 删除信息
  del(id) {
    var sql = 'delete from cates where id = ?'
    return db.query(sql, [id])
  }
}
