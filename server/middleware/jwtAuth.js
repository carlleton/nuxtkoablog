let jwt = require('jwt-simple')
const config = require('../config')
const jwtSecret = process.env.jwtSecret
const needAuth = config.needAuth

module.exports = (ctx, next) => {
  let url = ctx.request.url
  let path
  if (url.indexOf('?') > -1) {
    path = url.substr(0, url.indexOf('?'))
  } else {
    path = url
  }
  // 接口不需要登陆，直接next
  if (needAuth.indexOf(path) < 0) {
    return next()
  }

  // 接口需要登陆
  var token = ctx.req.headers['authorization']
  if (!token) {
    // ctx.type = 'json'
    ctx.body = {
      code: 401,
      message: 'you need login:there is no token'
    }
    return
  }
  token = token.replace('Bearer ', '')
  try {
    //解密获取的token
    let decoded = jwt.decode(token, jwtSecret)

    //校验有效期
    if (decoded.exp <= Date.now()) {
      ctx.body = {
        code: 401,
        message: 'you need login:token is expired'
      }
      return
    }
    ctx.state.uid = decoded.uid
    return next()
  } catch (err) {
    // ctx.response.type = 'json'
    ctx.body = {
      code: 401,
      message: 'you need login:token is expired'
    }
  }
}
