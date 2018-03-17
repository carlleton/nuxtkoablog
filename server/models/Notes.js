let db = require('../../util/db')

export default class Notes {

  // 根据页码获取当前页Post列表
  list(obj) {
    var sendParams = []
    var sql = ''
    if (obj.tag) {
      sql += ` and concat(concat(',',tags),',') like '%,?,%'`
      sendParams.push(obj.tag)
    }
    if (obj.keyword) {
      sql += ` and title like ?`
      sendParams.push('%' + obj.keyword + '%')
    }
    if (obj.cid) {
      sql += ` and notes.cid = ?`
      sendParams.push(obj.cid)
    }
    if (obj.where) {
      sql += ' and ' + obj.where
    }

    var totalsql = 'select count(id) as total from notes where 1=1' + sql
    var listsql = 'select id,title,cid,addtime,updatetime,tags from notes where 1=1' + sql
    listsql += ' order by updatetime desc'
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
          reject(err)
        } else {
          resolve(res.result)
        }
      })
    })
    var totaldata = new Promise((resolve, reject) => {
      db.query(totalsql, sendParams).then((res) => {
        if (res.err) {
          reject(err)
        } else {
          resolve(res.result[0])
        }
      })
    })
    return Promise.all([listdata, totaldata])
  }

  // 根据id获取Post详情
  one(id) {
    let sql = 'select * from notes where notes.id = ?'
    return db.query(sql, [id])
  }

  // 插入Post
  add(post) {
    let sql = 'insert into notes (title,content,cid,tags,addtime,updatetime) values (?, ?, ?, ?, ?, ?)'
    let params = [
      post.title,
      post.content,
      post.cid,
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
    var sql = 'update notes set ' + updated.join(',') + ' where id = ?'
    params.push(post.id)

    return db.query(sql, params)
  }

  // 删除信息
  del(id) {
    var sql = `delete from notes where path like concat((select path from notes where id = ?),'%')`
    return db.query(sql, [id])
  }
}
