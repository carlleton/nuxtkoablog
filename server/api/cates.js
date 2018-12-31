import Cates from '../models/Cates'
import { getTen } from '../../util/tools'
const router = require('koa-router')()
const db = require('../utils/db')
const _ = require('lodash')

let catesModel = new Cates()

router.get('/list', async (ctx, next) => {
  var params = {}
  if (ctx.query.pid) {
    params.pid = ctx.query.pid
  }
  if (ctx.query.deepid) {
    params.deepid = ctx.query.deepid
  }
  var result = await catesModel.list(params)
  ctx.status = 200
  ctx.body = result.result
})

router.post('/add', async (ctx, next) => {
  let uid = ctx.state.uid
  let body = ctx.request.body
  let id = db.nextId()
  let params = {
    id: id,
    catename: body.catename,
    pid: body.pid,
    orderid: body.orderid || 1,
    path: '',
    uid
  }
  if (body.pid !== 0) {
    var pCates = await catesModel.find({
      where: 'id = ' + body.pid + ' and uid = ' + uid,
      limit: '0, 1'
    })
    if (pCates.result.length > 0) {
      params.path = pCates.result[0].path
    }
  }
  if (!body.orderid) {
    let maxCate = await catesModel.find({
      where: 'pid = ' + body.pid + ' and uid = ' + uid,
      order: 'orderid desc',
      limit: '0, 1'
    })
    if (maxCate.result.length > 0) {
      params.orderid = maxCate.result[0].orderid + 1
    }
  }
  params.path += getTen(params.orderid) + ','
  var result = await catesModel.add(params)
  if (result.error) {
    ctx.status = 404
    ctx.body = { code: 404, message: 'no result' }
  } else {
    ctx.status = 200
    ctx.body = {
      id: id
    }
  }
})

router.post('/update', async (ctx, next) => {
  let uid = ctx.state.uid
  var body = ctx.request.body
  var params = {
    id: body.id,
    catename: body.catename,
    pid: body.pid,
    orderid: body.orderid,
    path: '',
    uid
  }
  if (body.pid !== 0) {
    var pCates = await catesModel.find({
      where: 'id = ' + body.pid + ' and uid = ' + uid,
      limit: '0, 1'
    })
    if (pCates.result.length > 0) {
      params.path = pCates.result[0].path
    }
  }
  params.path += getTen(params.orderid) + ','
  var result = await catesModel.update(params)
  if (result.error) {
    ctx.status = 404
    ctx.body = { code: 404, message: 'no result' }
  } else {
    console.log(res)
    ctx.status = 200
    ctx.body = {
      rows: result.result.affectedRows
    }
  }
})

router.post('/del', async (ctx, next) => {
  var body = ctx.request.body

  var result = await catesModel.del(body.id)
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
  var result = await catesModel.one(id)
  ctx.status = 200
  var data = result.result
  if (data.length > 0) {
    ctx.body = data[0]
  } else {
    ctx.body = {}
  }
})


module.exports = router
