let db = require('../../util/db')
let pageSize = require('../../config/config').pageSize

export default class Posts {

  // 根据页码获取当前页Post列表
  list(obj) {
    var sendParams = []
    var sql = 'select * from posts where 1=1'
    if (obj.scope === 'published') {
      sql += ` and status = '${obj.scope}'`
    }
    if (obj.tag) {
      sql += ` and concat(concat(',',tags),',') like '%,?,%'`
      sendParams.push(obj.tag)
    }
    if (obj.keyword) {
      sql += ` and title like ?`
      sendParams.push('%' + obj.keyword + '%')
    }
    if (obj.cid) {
      sql += ` and posts.cid = ?`
      sendParams.push(obj.cid)
    }
    if (obj.where) {
      sql += ' and ' + obj.where
    }
    sql += ' order by id desc'
    sql += ' limit ?, ?'
    sendParams.push(obj.pageNum * pageSize)
    sendParams.push(pageSize)
    return db.query(sql, sendParams)
  }

  // 根据id获取Post详情
  one(id) {
    let sql = 'select posts.*,cates.catename from posts,cates where (posts.cid = cates.id or posts.cid = 0) and posts.id = ?'
    return db.query(sql, [id])
  }

  // 根据类型id获取单个posts
  findOneByCate(cid) {
    let sql = 'select posts.*,cates.catename from posts,cates where posts.cid = cates.id and posts.cid = ? limit 0, 1'
    return db.query(sql, [cid])
  }

  // 插入Post
  add(post) {
    let sql = 'insert into posts (title,content,cid,status,tags,addtime,updatetime) values (?, ?, ?, ?, ?, ?)'
    let params = [
      post.title,
      post.content,
      post.cid,
      post.status,
      post.tags,
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
