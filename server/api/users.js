import Users from '../models/Users'
let jwt = require('jwt-simple')
let moment = require('moment')
let jwtSecret = process.env.jwtSecret
const router = require('koa-router')()
const db = require('../utils/db')
const _ = require('lodash')

let usersModel = new Users()

router.post('/login', async (ctx, next) => {
  var body = ctx.request.body
  var user = {
    username: body.username,
    userpass: body.userpass
  }
  if (user.username.trim() == '' || user.userpass === '') {
    ctx.status = 403
    ctx.body = { code: 403, message: '用户名或密码不正确' }
    return
  }
  var result = await usersModel.auth(user)
  if (!result.err && result.result.length === 1) {
    //设置七天有效期
    let expires = moment().add(7, 'days').valueOf()

    let token = jwt.encode({
      uid: result.result[0].id,
      exp: expires
    }, jwtSecret)
    ctx.status = 200
    ctx.body = { code: 200, message: 'success', token: token }
  } else {
    ctx.status = 200
    ctx.body = { code: 404, message: '登陆失败' }
  }
})

router.post('/changePass', async (ctx, next) => {
  var body = ctx.request.body
  var params = {
    username: body.username.trim(),
    oldpass: body.oldpass,
    newpass: body.newpass
  }
  if (_.isEmpty(params.username) ||  _.isEmpty(params.oldpass) || _.isEmpty(params.newpass)) {
    ctx.status = 200
    ctx.body = {
      code: 403,
      message: '请输入密码'
    }
    return
  }
  var result = await usersModel.changePass(params)
  console.log(result)
  if (!result.err && result.result.affectedRows === 1) {
    ctx.status = 200
    ctx.body = { code: 200, message: 'success' }
  } else {
    ctx.status = 200
    ctx.body = { code: 404, message: '更改失败' }
  }
})

module.exports = router
