let db = require('../../util/db')
let pageSize = require('../../config/config').pageSize

export default class Cates {

  // 根据页码获取当前页Post列表
  list(params) {
    let sql = 'select posts.*,cates.catename from posts,cates where (posts.cid = cates.id or posts.cid = 0)'
    if (params.scope === 'published') {
      sql += ` and status = '${params.scope}'`
    }
    if (params.where) {
      sql += ' and ' + params.where
    }
    sql += ' order by id desc'
    sql += ` limit ${params.pageNum * pageSize}, ${pageSize}`
    return db.query(sql, [])
  }

  // 根据id获取Post详情
  one(id) {
    let sql = 'select * from cates id = ?'
    return db.query(sql, [id])
  }

  // 根据类型id获取单个posts
  findOneByCate(cid) {
    let sql = 'select posts.*,cates.catename from posts,cates where posts.cid = cates.id and posts.cid = ? limit 0, 1'
    return db.query(sql, [cid])
  }

  // 插入Post
  add(post) {
    let sql = 'insert into posts (title,content,cid,status,addtime,updatetime) values (?, ?, ?, ?, ?, ?)'
    let params = [
      post.title,
      post.content,
      post.cid,
      post.status,
      post.addtime || new Date().getTime(),
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

  // 删除信息
  del(id) {
    var sql = 'delete from posts where id = ?'
    return db.query(sql, [id])
  }
}
