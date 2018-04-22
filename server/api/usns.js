import Usns from '../models/Usns'
import { getTen } from '../../util/tools'
const router = require('koa-router')()
const db = require('../../util/db')
const _ = require('lodash')

let usnsModel = new Usns()

router.post('/init', async (ctx, next) => {
  var body = ctx.request.body
  let tag = body.tag
  let table = body.table

  var resids = await usnsModel.ids(table)
  if (!resids.error) {
    var ids = resids.result.map(item => item.id)
    var result_error = 0
    var result_success = 0
    for (let i in ids) {
      let params = {
        tag: parseInt(tag),
        tagid: ids[i],
        usn: 1,
        state: 1
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

module.exports = router