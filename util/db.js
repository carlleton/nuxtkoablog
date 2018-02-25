let mysql = require('mysql')
const mysqlConfig = require('../config/config').mysqlConfig

var pool = mysql.createPool(mysqlConfig)

pool.on('connection', function (connection) {
  // console.log('Connection %d built', connection.threadId)
  connection.on('error', function (err) {
    console.log(err) // 'ER_BAD_DB_ERROR'
  })
})

function query (sql, params, callback) {
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err)
        return callback(true)
      }
      //链接
      connection.query(sql, params, (err, result) => {
        //释放链接
        connection.release()
        if (err) {
          console.error('db error17:' + err)
          return callback(true)
        }
        callback(false, result)
      })
    })
  } catch (err) {
    console.error('db error24:' + err)
    return callback(true)
  }
}

module.exports.query = query
