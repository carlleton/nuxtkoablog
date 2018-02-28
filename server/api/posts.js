import Posts from '../models/Posts'
const router = require('koa-router')()
const db = require('../../util/db')
const _ = require('lodash')

let postsModel = new Posts()

router.get('/:id', async (ctx, next) => {
  var id = ctx.params.id
  if (!_.isInteger(id)) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: 'no result'
    }
    return
  }
  var result = await postsModel.findOne(id)
  ctx.status = 200
  ctx.body = result.result
})

router.get('/list/:pageNum', async (ctx, next) => {
  var params = {
    scope: ctx.query.scope || '',
    pageNum: ctx.params.pageNum || 0
  }
  var result = await postsModel.list(params)
  if (result.err) {
    ctx.status = 404
    ctx.body = { code: 404, message: 'no result' }
  } else {
    ctx.status = 200
    ctx.body = result.result
  }
})

router.post('/add', async (ctx, next) => {
  var body = ctx.request.body
  var params = {
    title: body.title,
    content: body.content,
    cid: body.cid,
    status: body.status,
    addtime: body.addtime
  }
  var result = await postsModel.add(params)
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
    id: body.id,
    title: body.title,
    content: body.content,
    cid: body.cid,
    status: body.status
  }
  var result = await postsModel.update(params)
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

  var result = await postsModel.del(body.id)
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

module.exports = router
