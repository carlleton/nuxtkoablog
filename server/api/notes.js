import Notes from '../models/Notes'
import NoteCates from '../models/NoteCates'
const router = require('koa-router')()
const db = require('../../util/db')
const _ = require('lodash')
let pageSize = require('../../config/config').pageSize

let notesModel = new Notes()
let notecatesModel = new NoteCates()

router.get('/list', async (ctx, next) => {
  var params = {
    pageNum: ctx.query.page || 1,
    pageSize: pageSize,
    cid: ctx.query.cid || '',
    keyword: ctx.query.keyword || ''
  }
  var result = await notesModel.list(params)
  if (result.err) {
    ctx.status = 404
    ctx.body = { code: 404, message: 'no result list' }
  } else {
    ctx.status = 200
    ctx.body = {
      data: result[0],
      total: result[1].total
    }
  }
})

router.post('/add', async (ctx, next) => {
  var body = ctx.request.body
  var params = {
    title: body.title,
    content: body.content,
    cid: body.cid,
    addtime: body.addtime,
    tags: body.tags
  }
  var result = await notesModel.add(params)
  if (result.err) {
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
    id: body.id,
    title: body.title,
    content: body.content,
    cid: body.cid,
    tags: body.tags,
    addtime: body.addtime
  }
  var result = await notesModel.update(params)
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

  var result = await notesModel.del(body.id)
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
  var result = await postsModel.one(id)
  ctx.status = 200
  var data = result.result
  if (data.length > 0) {
    ctx.body = data[0]
  } else {
    ctx.body = {}
  }
})

module.exports = router
