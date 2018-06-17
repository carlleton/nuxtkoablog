let db = require('../../util/db')
const { tables, tableids, usnstates } = require('../config/state')
export default class Usns {

  ids(tablename) {
    let sql = `select id from ${tablename}`
    return db.query(sql, [])
  }

  create(obj) {
    let sql = 'insert into usns (id,tag, tagid, usn, updatetime, state, deal) values (?, ?, ?, ?, ?, ?, ?)'
    let params = [
      obj.id,
      obj.tag,
      obj.tagid,
      obj.usn,
      Date.now(),
      obj.state,
      obj.deal
    ]
    return db.query(sql, params)
  }

  getUsns(where) {
    let sql = 'select * from usns where 1=1'
    let params = []
    if (where.usn !== undefined) {
      sql += ' and usn > ?'
      params.push(where.usn)
    }
    if (where.deal !== undefined) {
      sql += ' and deal = ?'
      params.push(where.deal)
    }
    return db.query(sql, params)
  }

  update(obj) {
    let sql = 'update usns set '
    let keys = []
    let params = []
    for (let key in obj.set) {
      keys.push(key)
      params.push(obj.set[key])
    }
    sql += keys.map(item => item + ' = ?').join(',')
    sql += ' where 1=1'
    for (let key in obj.where) {
      sql += ' and ' + key + ' = ?'
      params.push(obj.where[key])
    }
    return db.query(sql, params)
  }

  syncadd(key, id) {
    let obj = {
      id: db.nextId(),
      tag: tableids[key],
      tagid: id,
      usn: 0,
      updatetime: Date.now(),
      state: 1,
      deal: 0
    }
    return this.create(obj)
  }

  syncupdate(key, id) {
    return this.update({
      where: {
        tag: tableids[key],
        tagid: id
      },
      set: {
        deal: 0,
        updatetime: Date.now(),
        state: 2
      }
    })
  }

  syncdel(key, id) {
    return this.update({
      where: {
        tag: tableids[key],
        tagid: id
      },
      set: {
        deal: 0,
        state: 0
      }
    })
  }

}