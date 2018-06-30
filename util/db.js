let mysql = require('mysql')
let snowflake = require('node-snowflake').Snowflake
const mysqlConfig = JSON.parse(process.env.mysqlConfig)

let pool = mysql.createPool(mysqlConfig)
pool.on('connection', function (connection) {
  // console.log('Connection %d built', connection.threadId)
  connection.on('error', function (err) {
    console.log(err) // 'ER_BAD_DB_ERROR'
  })
})

function query (sql, params) {
  return new Promise((resolve, reject) => {
    try {
      pool.getConnection((err, connection) => {
        if (err) {
          return resolve({
            err: true
          })
        }
        //链接
        connection.query(sql, params, (err, result) => {
          //释放链接
          connection.release()
          if (err) {
            console.error('db error17:' + err)
            if (err.code === 'ER_NO_SUCH_TABLE') {
              return resolve({
                err: true,
                notInstalled: true
              })
            }
            return resolve({
              err: true
            })
          }
          resolve({
            err: false,
            result: result
          })
        })
      })
    } catch (err) {
      console.error('db error24:' + err)
      return resolve({
        err: true,
        message: 'not installed',
        notInstalled: true
      })
    }
  })
}

module.exports.nextId = function () {
  let id = snowflake.nextId()
  return id
}

module.exports.query = query
