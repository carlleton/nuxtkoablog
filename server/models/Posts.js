let db = require('../../util/db')
let pageSize = require('../../config/config').pageSize

export default class Posts {

  // 根据页码获取当前页Post列表
  list(params) {
    let sql = 'select * from posts'
    if (params.scope === 'published') {
      sql += ` where status = '${params.scope}'`
    }
    if (params.where) {
      sql += ' and ' + params.where
    }
    sql += ' order by id desc'
    sql += ` limit ${params.pageNum * pageSize}, ${pageSize}`
    return db.query(sql, [])
  }

  // 根据id获取Post详情
  findOne(id) {
    let sql = 'select * from posts where id = ?'
    return db.query(sql, [id])
  }

  // 插入Post
  add(post) {
    let sql = 'insert into posts (title,content,cid,status,addtime,updatetime) values (?, ?, ?, ?, ?, ?)'
    let params = [
      post.title,
      post.content,
      post.cid,
      post.status,
      new Date().getTime(),
      new Date().getTime()
    ]
    return db.query(sql, params)
  }

  // 更新信息
  update(post) {
    var updated = []
    var params = []
    for (var key in post) {
      if (key === 'id') {
        continue
      }
      updated.push(key + ' = ?')
      params.push(post[key])
    }
    updated.push('updatetime = ?')
    params.push(Date.now())
    var sql = 'update posts set ' + updated.join(',') + ' where id = ?'
    params.push(post.id)

    return db.query(sql, params)
  }
}
