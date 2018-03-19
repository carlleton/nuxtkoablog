import Posts from '../models/Posts'
import Cates from '../models/Cates'
const router = require('koa-router')()
const db = require('../../util/db')
const _ = require('lodash')
let pageSize = require('../../config').pageSize

let postsModel = new Posts()
let catesModel = new Cates()

router.get('/list', async (ctx, next) => {
  var params = {
    scope: ctx.query.scope || '',
    pageNum: ctx.query.page || 1,
    pageSize: pageSize,
    cid: ctx.query.cid || '',
    keyword: ctx.query.keyword || ''
  }
  var result = await postsModel.list(params)
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

router.get('/cate:cid', async (ctx, next) => {
  var cid = _.toNumber(ctx.params.cid)
  if (!_.isInteger(cid)) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      message: 'no result'
    }
    return
  }
  var result = await postsModel.findOneByCate(cid)
  if (!result) {
    var cate = await catesModel.one(cid)
    if (!cate) {
      ctx.status = 404
      ctx.body = {code: 404, message: 'no result'}
      return
    }
    var params = {
      title: cate.catename,
      content: '',
      cid: cid,
      status: 'published',
      addtime: new Date().getTime()
    }
    var resultAdd = await postsModel.add(params)
    if (resultAdd.error) {
      ctx.status = 404
      ctx.body = { code: 404, message: 'no result' }
      return
    }
    result = await postsModel.findOneByCate(cid)
  }
  ctx.status = 200
  var data = result.result
  if (data.length > 0) {
    ctx.body = data[0]
  } else {
    ctx.body = {}
  }
})

router.post('/add', async (ctx, next) => {
  var body = ctx.request.body
  var params = {
    title: body.title,
    content: body.content,
    cid: body.cid,
    status: body.status || 'published',
    addtime: body.addtime,
    tags: body.tags,
    noteid: body.noteid
  }
  var result = await postsModel.add(params)
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
  body.status && (params.status = body.status)
  body.tags && (params.tags = body.tags)
  body.noteid && (params.noteid = body.noteid)

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
