let db = require('../utils/db')

export default class Posts {

  // 根据页码获取当前页Post列表
  list(obj) {
    var sendParams = []
    var sql = ''
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
      sql += ` and posts.cid in (select id from cates where path like (select concat((select path from cates where id = ?),'%')))`
      sendParams.push(obj.cid)
    }
    if (obj.uid) {
      sql += ' and uid = ?'
      sendParams.push(obj.uid)
    }
    if (obj.where) {
      sql += ' and ' + obj.where
    }

    var totalsql = 'select count(id) as total from posts where 1=1' + sql
    var listsql = 'select * from posts where 1=1' + sql
    listsql += ' order by id desc'
    if (obj.pageNum && obj.pageSize) {
      listsql += ' limit ?, ?'
      if (obj.pageNum < 1) {
        obj.pageNum = 1
      }
      sendParams.push((obj.pageNum - 1) * obj.pageSize)
      sendParams.push(obj.pageSize)
    }
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
  one(id) {
    let sql = 'select * from posts where posts.id = ?'
    return db.query(sql, [id])
  }

  findByIds(ids, uid) {
    let sql = 'select * from posts where id in (?) and uid = ?'
    let params = [ids, uid]
    return db.query(sql, params)
  }

  // 根据类型id获取单个posts
  findOneByCate(cid) {
    let sql = 'select posts.*,cates.catename from posts,cates where posts.cid = cates.id and posts.cid = ? limit 0, 1'
    return db.query(sql, [cid])
  }

  // 插入Post
  add(post) {
    let sql = 'insert into posts (id,title,content,cid,status,tags,addtime,updatetime,uid) values (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    let params = [
      post.id,
      post.title,
      post.content,
      post.cid,
      post.status,
      post.tags,
      post.addtime || new Date().getTime(),
      post.updatetime || new Date().getTime(),
      post.uid
    ]
    return db.query(sql, params)
  }

  // 更新信息
  update(post) {
    var updated = []
    var params = []
    for (var key in post) {
      if (key === 'id' || key === 'uid') {
        continue
      }
      updated.push(key + ' = ?')
      params.push(post[key])
    }
    updated.push('updatetime = ?')
    params.push(Date.now())
    var sql = 'update posts set ' + updated.join(',') + ' where id = ?'
    params.push(post.id)
    if (post.uid) {
      sql += ' and uid = ?'
      params.push(post.uid)
    }

    return db.query(sql, params)
  }

  // 删除信息
  del(id) {
    var sql = 'delete from posts where id = ?'
    return db.query(sql, [id])
  }
}