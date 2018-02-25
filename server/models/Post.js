let db = require('../../util/db')

export default class Post {

  // 插入Post
  insert(post, callback) {
    let sql = 'insert into posts (title,content,category,status,addtime,updatetime) values ()'
    let params = [
      post.title,
      post.content,
      post.category,
      post.status,
      new Date().getTime(),
      new Date().getTime()
    ]
    db.query(sql, params, (err, result) => {
      if (err) {
        return callback(true)
      }
      callback(false, result.insertId)
    })
  }
}
