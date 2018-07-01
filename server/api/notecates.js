import NoteCates from '../models/NoteCates'
import Usns from '../models/Usns'
import { getTen } from '../../util/tools'
const router = require('koa-router')()
const db = require('../../util/db')
const _ = require('lodash')

let notecatesModel = new NoteCates()
let usnsModel = new Usns()

router.get('/list', async (ctx, next) => {
  var params = {}
  if (ctx.query.pid) {
    params.pid = ctx.query.pid
  }
  if (ctx.query.deepid) {
    params.deepid = ctx.query.deepid
  }
  var result = await notecatesModel.list(params)
  ctx.status = 200
  ctx.body = result.result
})

router.post('/add', async (ctx, next) => {
  var body = ctx.request.body
  let id = db.nextId()
  var params = {
    id,
    catename: body.catename,
    pid: body.pid,
    orderid: body.orderid || 1,
    path: '',
    pidpath: ''
  }
  if (body.pid !== 0) {
    var pCates = await notecatesModel.find({
      where: 'id = ' + body.pid,
      limit: '0, 1'
    })
    if (pCates.result.length > 0) {
      params.path = pCates.result[0].path
      params.pidpath = pCates.result[0].idpath + pCates.result[0].id + ','
    }
  }
  if (!body.orderid) {
    let maxCate = await notecatesModel.find({
      where: 'pid = ' + body.pid,
      order: 'orderid desc',
      limit: '0, 1'
    })
    if (maxCate.result.length > 0) {
      params.orderid = maxCate.result[0].orderid + 1
    }
  }
  params.path += getTen(params.orderid) + ','
  var result = await notecatesModel.add(params)
  if (result.error) {
    ctx.status = 404
    ctx.body = { code: 404, message: 'no result' }
  } else {
    await usnsModel.syncadd('notecates', id)
    ctx.status = 200
    ctx.body = {
      id
    }
  }
})

router.post('/update', async (ctx, next) => {
  var body = ctx.request.body
  var params = {
    id: body.id
  }
  body.catename && (params.catename = body.catename)
  body.pid && (params.pid = body.pid)
  body.orderid && (params.orderid = body.orderid)

  if (body.orderid) {
    params.path = ''
    if (body.pid !== 0) {
      var pCates = await notecatesModel.find({
        where: 'id = ' + body.pid,
        limit: '0, 1'
      })
      if (pCates.result.length > 0) {
        params.path = pCates.result[0].path
      }
    }
    params.path += getTen(params.orderid) + ','
  }
  var result = await notecatesModel.update(params)
  if (result.error) {
    ctx.status = 404
    ctx.body = { code: 404, message: 'no result' }
  } else {
    await usnsModel.syncupdate('notecates', body.id)
    ctx.status = 200
    ctx.body = {
      rows: result.result.affectedRows
    }
  }
})

router.post('/del', async (ctx, next) => {
  var body = ctx.request.body

  var result = await notecatesModel.del(body.id)
  if (result.error) {
    ctx.status = 404
    ctx.body = { code: 404, message: 'no result' }
  } else {
    await usnsModel.syncdel('notecates', body.id)
    ctx.status = 200
    ctx.body = {
      rows: result.result.affectedRows
    }
  }
})

router.post('/up', async (ctx, next) => {
  var body = ctx.request.body
  var id = _.toNumber(body.id)
  if (!id) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: 'no result'
    }
    return
  }
  var upresult = await notecatesModel.one(id, 'up')
  if (upresult.result.length === 0) {
    ctx.status = 200
    ctx.body = {
      rows: 0
    }
  } else {
    let updateCount = 0
    var nowresult = await notecatesModel.one(id)
    var nowone = nowresult.result[0]
    var upone = upresult.result[0]

    var nowpath = nowone.path
    nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
    nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
    if (nowpath) {
      nowpath += ','
    }
    nowpath += getTen(upone.orderid) + ','
    let replacepath = (nowone.pidpath || '') + nowone.id + ','
    var objnow = {
      id: nowone.id,
      path: nowpath,
      orderid: upone.orderid
    }
    await notecatesModel.update(objnow)
    await usnsModel.syncupdate('notecates', objnow.id)
    updateCount += 1
    let updateres = await db.query('select id from notecates where pidpath like ?', [replacepath])
    let updateids = updateres.result
    if (updateids.length > 0) {
      var sql1 = 'update notecates set path = replace(path, ?, ?) where pidpath like ?'
      var params1 = [
        nowone.path,
        nowpath,
        replacepath
      ]
      var res1 = await db.query(sql1, params1)
      for (let i = 0, n = updateids.length; i < n; i++) {
        await usnsModel.syncupdate('notecates', updateids[i])
      }
      updateCount += res1.result.affectedRows
    }

    var uppath = upone.path
    uppath = uppath.substr(0, uppath.lastIndexOf(','))
    uppath = uppath.substr(0, uppath.lastIndexOf(','))
    if (uppath) {
      uppath += ','
    }
    uppath += getTen(nowone.orderid) + ','
    replacepath = (upone.pidpath || '') + upone.id + ','
    var objup = {
      id: upone.id,
      path: uppath,
      orderid: nowone.orderid
    }
    await notecatesModel.update(objup)
    await usnsModel.syncupdate('notecates', objup.id)
    updateCount += 1
    updateres = await db.query('select id from notecates where pidpath like ?', [replacepath])
    updateids = updateres.result
    if (updateids.length > 0) {
      var sql2 = 'update notecates set path = replace(path, ?, ?) where pidpath like ?'
      var params2 = [
        upone.path,
        uppath,
        replacepath
      ]
      var res2 = await db.query(sql2, params2)
      for (let i = 0, n = updateids.length; i < n; i++) {
        await usnsModel.syncupdate('notecates', updateids[i])
      }
      updateCount += res2.result.affectedRows
    }

    ctx.status = 200
    ctx.body = {
      rows: updateCount
    }
  }
})

router.post('/down', async (ctx, next) => {
  var body = ctx.request.body
  var id = _.toNumber(body.id)
  if (!id) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: 'no result'
    }
    return
  }
  var upresult = await notecatesModel.one(id, 'down')
  if (upresult.result.length === 0) {
    ctx.status = 200
    ctx.body = {
      rows: 0
    }
  } else {
    let updateCount = 0 // 更新次数
    var nowresult = await notecatesModel.one(id)
    var nowone = nowresult.result[0]
    var upone = upresult.result[0]

    var nowpath = nowone.path
    nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
    nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
    if (nowpath) {
      nowpath += ','
    }
    nowpath += getTen(upone.orderid) + ','
    let updatepath = (nowone.pidpath || '') + nowone.id + ','
    var objnow = {
      id: nowone.id,
      path: nowpath,
      orderid: upone.orderid
    }
    await notecatesModel.update(objnow)
    await usnsModel.syncupdate('notecates', objnow.id)
    updateCount += 1
    let updateres = await db.query('select id from notecates where pidpath like ?', [updatepath])
    let updateids = updateres.result
    if (updateids.length > 0) {
      var sql1 = 'update notecates set path = replace(path, ?, ?) where pidpath like ?'
      var params1 = [
        nowone.path,
        nowpath,
        updatepath
      ]
      var res1 = await db.query(sql1, params1)
      for (let i = 0, n = updateids.length; i < n; i++) {
        await usnsModel.syncupdate('notecates', updateids[i])
      }
      updateCount += res1.result.affectedRows
    }

    var uppath = upone.path
    uppath = uppath.substr(0, uppath.lastIndexOf(','))
    uppath = uppath.substr(0, uppath.lastIndexOf(','))
    if (uppath) {
      uppath += ','
    }
    uppath += getTen(nowone.orderid) + ','
    updatepath = (upone.pidpath || '') + upone.id + ','
    var objup = {
      id: upone.id,
      path: uppath,
      orderid: nowone.orderid
    }
    await notecatesModel.update(objup)
    await usnsModel.syncupdate('notecates', objup.id)
    updateCount += 1
    updateres = await db.query('select id from notecates where pidpath like ?', [updatepath])
    updateids = updateres.result
    if (updateids.length > 0) {
      var sql2 = 'update notecates set path = replace(path, ?, ?) where pidpath like ?'
      var params2 = [
        upone.path,
        uppath,
        updatepath
      ]
      var res2 = await db.query(sql2, params2)
      for (let i = 0, n = updateids.length; i < n; i++) {
        await usnsModel.syncupdate('notecates', updateids[i])
      }
      updateCount += res2.result.affectedRows
    }

    ctx.status = 200
    ctx.body = {
      rows: updateCount
    }
  }
})

router.get('/:id', async (ctx, next) => {
  var id = _.toNumber(ctx.params.id)
  if (!id || !_.isNumber(id)) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: 'no result'
    }
    return
  }
  var result = await notecatesModel.one(id)
  ctx.status = 200
  var data = result.result
  if (data.length > 0) {
    ctx.body = data[0]
  } else {
    ctx.body = {}
  }
})

module.exports = router
