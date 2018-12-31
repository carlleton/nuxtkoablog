import { writeFile, readFile } from '../tools'
import Users from '../models/Users'

const router = require('koa-router')()
const _ = require('lodash')
const moment = require('moment')
let db = require('../utils/db')
var filepath = './server/config/config.js'
let usersModel = new Users()

router.get('/', async (ctx, next) => {
  let sql = 'select * from options'
  let res = await db.query(sql)
  if (res.err && res.notInstalled) {
    ctx.status = 200
    ctx.body = {
      code: 201,
      message: 'not installed',
      notInstalled: true
    }
  } else {
    ctx.status = 200
    ctx.body = {
      code: 200
    }
  }
})

// 执行数据库安装操作
router.post('/installtable', async (ctx, next) => {
  let sql = 'select * from options'
  let res = await db.query(sql)
  if (!res.err || !res.notInstalled) {
    ctx.status = 200
    ctx.body = {
      error: true,
      results: [`It's already installed`]
    }
    return
  }
  let body = ctx.request.body
  let username = body.username.trim()
  let userpass = body.userpass.trim()
  if (!username || !userpass) {
    ctx.status = 200
    ctx.body = {
      error: true,
      results: ['username or userpass is empty....']
    }
    return
  }

  let create = require('../config/sql/create')
  let initdata = require('../config/sql/initdata')

  var results = []
  for (let i in create) {
    let result = await db.query(create[i])
    if (!result.err) {
      if (create[i].indexOf('DROP') > -1) {
        results.push('删除' + i.replace('drop', '') + '成功！')
      } else {
        results.push('创建' + i + '成功！')
      }
    }
  }
  userpass = usersModel.createpass(userpass)
  for (let i in initdata) {
    let sql = initdata[i]
    if (i === 'users') {
      sql = sql.replace('admin', username)
      sql = sql.replace('adminpass', userpass)
    }
    let result = await db.query(sql)
    if (!result.err) {
      results.push('插入初始化数据' + i + '成功！')
    }
  }

  ctx.status = 200
  ctx.body = {
    results: results
  }
})

module.exports = router
