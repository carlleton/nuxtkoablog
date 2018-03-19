import Notes from '../models/Notes'
import NoteCates from '../models/NoteCates'
const router = require('koa-router')()
const db = require('../../util/db')
const _ = require('lodash')
let pageSize = require('../../config').pageSize

let notesModel = new Notes()
let notecatesModel = new NoteCates()

router.get('/list', async (ctx, next) => {
  var params = {
    pageNum: ctx.query.pageNum || 1,
    pageSize: ctx.query.pageSize || pageSize,
    cid: ctx.query.cid || '',
    keyword: ctx.query.keyword || ''
  }
  if (typeof params.pageSize === 'string') {
    params.pageSize = parseInt(params.pageSize)
  }
  if (typeof params.cid === 'string') {
    params.cid = parseInt(params.cid)
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
    tags: body.tags,
    postid: body.postid
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
    addtime: body.addtime || (new Date()).getTime()
  }
  body.title && (params.title = body.title)
  body.content && (params.content = body.content)
  body.cid && (params.cid = body.cid)
  body.tags && (params.tags = body.tags)
  body.postid !== undefined && (params.postid = body.postid)

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
  var result = await notesModel.one(id)
  ctx.status = 200
  var data = result.result
  if (data.length > 0) {
    ctx.body = data[0]
  } else {
    ctx.body = {}
  }
})

module.exports = router
