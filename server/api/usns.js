import Usns from '../models/Usns'
import NoteCates from '../models/NoteCates'
import Cates from '../models/Cates'
import Posts from '../models/Posts'
import Notes from '../models/Notes'
import Options from '../models/Options'

const { tables, tableids, usnstates } = require('../config/state')

const router = require('koa-router')()
const db = require('../../util/db')
const _ = require('lodash')

let usnsModel = new Usns()
let notecatesModel = new NoteCates()
let catesModel = new Cates()
let postsModel = new Posts()
let notesModel = new Notes()
let optionsModel = new Options()

/**
 * 初始化
 */
router.post('/init', async (ctx, next) => {
  var body = ctx.request.body
  let tag = body.tag
  let table = body.table

  var res = await usnsModel.ids(table)
  if (!res.error) {
    var ids = res.result.map(item => item.id)
    var result_error = 0
    var result_success = 0
    for (let i in ids) {
      let params = {
        id: db.nextId(),
        tag: parseInt(tag),
        tagid: ids[i],
        usn: 1,
        state: 1,
        deal: 1
      }
      let addresult = await usnsModel.create(params)
      if (addresult.error) {
        result_error++
      } else {
        result_success++
      }
    }
    ctx.status = 200
    ctx.body = {
      code: 200,
      message: `表格：${table}，添加成功：${result_success}，添加失败：${result_error}`
    }
  } else {
    ctx.status = 200
    ctx.body = { code: 404, message: `查询${body.table}ids失败` }
  }
})

// 同步状态，获取
router.get('/sync/state', async (ctx, next) => {
  let res = await usnsModel.getUsns({
    deal: 0
  })
  if (!res.error && res.result.length > 0) {
    let maxusn = 1
    let resMaxUsn = await optionsModel.one('maxusn')
    if (!resMaxUsn) {
      maxusn = parseInt(resMaxUsn.result.value)
    }
    maxusn += 1
    await optionsModel.update({
      name: 'maxusn',
      value: maxusn
    })
    await usnsModel.update({
      where: {
        deal: 0
      },
      set: {
        usn: maxusn,
        deal: 1,
        state: 1
      }
    })
  }
  let usn = ctx.query.usn
  res = await usnsModel.getUsns({usn})
  let usns = []
  if (!res.error) {
    usns = res.result
    usns.forEach((item) => {
      item._id = item.id
    })
  }
  // 笔记分类
  let notecateids = usns.filter(item => item.tag === tableids['notecates'] && item.state > 0).map(item => item.tagid)
  let notecatesRes = await notecatesModel.findids(notecateids)
  let notecates = []
  if (!notecatesRes.err) {
    notecates = notecatesRes.result
    notecates.forEach((item) => {
      item._id = item.id
    })
  }
  // 分类
  let cateids = usns.filter(item => item.tag === tableids['cates'] && item.state > 0).map(item => item.tagid)
  let catesRes = await catesModel.findids(cateids)
  let cates = []
  if (!catesRes.err) {
    cates = catesRes.result
    cates.forEach((item) => {
      item._id = item.id
    })
  }

  ctx.status = 200
  ctx.body = {
    notecates,
    cates,
    usns
  }
})
// 批量获取新的post
router.get('/sync/post', async (ctx, next) => {
  let ids = ctx.query.ids.split(',')
  let res = await postsModel.findByIds(ids)
  if (!res.err) {
    ctx.status = 200
    res.result.forEach(item => {
      item._id = item.id
    })
    ctx.body = res.result
  } else {
    ctx.state = 200
    ctx.body = { code: 404, message: `查询post_ids_${ids}失败` }
  }
})
// 批量获取新的note
router.get('/sync/note', async (ctx, next) => {
  let ids = ctx.query.ids.split(',')
  let res = await notesModel.findByIds(ids)
  if (!res.err) {
    ctx.status = 200
    res.result.forEach(item => {
      item._id = item.id
    })
    ctx.body = res.result
  } else {
    ctx.state = 200
    ctx.body = { code: 404, message: `查询note_ids_${ids}失败` }
  }
})
// 上传信息
router.post('/sync/up', async (ctx, next) => {
  let usns = ctx.body.usns
  let maxusn = 1

  let resMaxUsn = await optionsModel.one('maxusn')
  if (!resMaxUsn) {
    maxusn = parseInt(resMaxUsn.result.value)
  }
  maxusn += 1
  let models = {
    'posts': postsModel,
    'notes': notesModel,
    'cates': catesModel,
    'notecates': notecatesModel
  }
  for (let usn of usns) {
    let model = models[tables[usn.tag]]
    // 删除操作
    if (usn.state === 0) {
      await model.del(usn.tagid)
    }
    if (usn.state === 1) {
      await model.add(usn.obj)
    }
    if (usn.state === 2) {
      await updateData(tables[usn.tag], usn.obj)
    }
    await usnsModel.update({
      where: {
        id: usn.id
      },
      set: {
        state: usn.state > 0 ? 1 : 0,
        updatetime: Date.now(),
        usn: maxusn
      }
    })
  }
  await optionsModel.update({
    name: 'maxusn',
    value: maxusn
  })
  ctx.status = 200
  ctx.body = {
    maxusn
  }
})

function updateData(table, obj) {
  var updated = []
  var params = []
  for (var key in obj) {
    if (key === 'id' || key === '_id') {
      continue
    }
    updated.push(key + ' = ?')
    params.push(obj[key])
  }
  var sql = 'update ' + table + ' set ' + updated.join(',') + ' where id = ?'
  params.push(obj.id)

  return db.query(sql, params)
}

module.exports = router
