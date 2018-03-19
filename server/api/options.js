import Options from '../models/Options'
import { getTen } from '../../util/tools'
const router = require('koa-router')()
const db = require('../../util/db')
const _ = require('lodash')

let optionsModel = new Options()

router.get('/list', async (ctx, next) => {
  var params = {}
  if (ctx.query.keys) {
    params.keys = ctx.query.keys
  }
  var result = await optionsModel.list(params)
  if (result.err) {
    ctx.status = 404
    ctx.body = { code: 404, message: 'no result list' }
  } else {
    ctx.status = 200
    var list = result[0]
    var data = {}
    for (var key in list) {
      data[list[key].name] = list[key].value
    }
    ctx.body = {
      data: data,
      total: result[1].total
    }
  }
})

router.post('/add', async (ctx, next) => {
  var body = ctx.request.body
  var params = {
    name: body.name,
    value: body.value
  }
  var result = await optionsModel.add(params)
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
    name: body.name,
    value: body.value
  }
  var result = await optionsModel.update(params)
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

  var result = await optionsModel.del(body.name)
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

router.get('/:name', async (ctx, next) => {
  var name = ctx.params.name
  var result = await optionsModel.one(name)
  ctx.status = 200
  var data = result.result
  if (data.length > 0) {
    ctx.body = data[0].value
  } else {
    ctx.body = {}
  }
})


module.exports = router
