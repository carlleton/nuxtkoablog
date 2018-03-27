import NoteCates from '../models/NoteCates'
import { getTen } from '../../util/tools'
const router = require('koa-router')()
const db = require('../../util/db')
const _ = require('lodash')

let notecatesModel = new NoteCates()

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
  var params = {
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
      params.pidpath = pCates.result[0].idpath + getTen(pCates.result[0].id) + ','
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
    ctx.status = 200
    ctx.body = {
      id: result.result.insertId
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
    var nowresult = await notecatesModel.one(id)
    var nowone = nowresult.result[0]
    var upone = upresult.result[0]

    var nowpath = nowone.path
    nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
    nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
    if (nowpath) {
      nowpath += ','
    }
    nowpath += getTen(upone.orderid)+','
    var objnow = {
      id: nowone.id,
      path: nowpath,
      orderid: upone.orderid
    }
    await notecatesModel.update(objnow)
    var sql1 = 'update notecates set path = replace(path, ?, ?) where pidpath like ?'
    var params1 = []
    params1.push(nowone.path)
    params1.push(nowpath)
    params1.push((nowone.pidpath||'') + getTen(nowone.id) + ',')
    var res1 = await db.query(sql1, params1)

    var uppath = upone.path
    uppath = uppath.substr(0, uppath.lastIndexOf(','))
    uppath = uppath.substr(0, uppath.lastIndexOf(','))
    if (uppath) {
       uppath += ','
    }
    uppath += getTen(nowone.orderid)+','
    var objup = {
      id: upone.id,
      path: uppath,
      orderid: nowone.orderid
    }
    await notecatesModel.update(objup)
    var sql2 = 'update notecates set path = replace(path, ?, ?) where pidpath like ?'
    var params2 = []
    params2.push(upone.path)
    params2.push(uppath)
    params2.push((upone.pidpath||'') + getTen(upone.id) + ',')
    var res2 = await db.query(sql2, params2)

    ctx.status = 200
    ctx.body = {
      rows: 2 + res1.result.affectedRows + res2.result.affectedRows
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
    var nowresult = await notecatesModel.one(id)
    var nowone = nowresult.result[0]
    var upone = upresult.result[0]

    var nowpath = nowone.path
    nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
    nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
    if (nowpath) {
      nowpath += ','
    }
    nowpath += getTen(upone.orderid)+','
    var objnow = {
      id: nowone.id,
      path: nowpath,
      orderid: upone.orderid
    }
    await notecatesModel.update(objnow)
    var sql1 = 'update notecates set path = replace(path, ?, ?) where pidpath like ?'
    var params1 = []
    params1.push(nowone.path)
    params1.push(nowpath)
    params1.push((nowone.pidpath||'') + getTen(nowone.id) + ',')
    var res1 = await db.query(sql1, params1)

    var uppath = upone.path
    uppath = uppath.substr(0, uppath.lastIndexOf(','))
    uppath = uppath.substr(0, uppath.lastIndexOf(','))
    if (uppath) {
       uppath += ','
    }
    uppath += getTen(nowone.orderid)+','
    var objup = {
      id: upone.id,
      path: uppath,
      orderid: nowone.orderid
    }
    await notecatesModel.update(objup)
    var sql2 = 'update notecates set path = replace(path, ?, ?) where pidpath like ?'
    var params2 = []
    params2.push(upone.path)
    params2.push(uppath)
    params2.push((upone.pidpath||'') + getTen(upone.id) + ',')
    var res2 = await db.query(sql2, params2)

    ctx.status = 200
    ctx.body = {
      rows: 2 + res1.result.affectedRows + res2.result.affectedRows
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
