let jwt = require('jwt-simple')
const config = require('../../config/config')
const jwtSecret = config.jwtSecret
const needAuth = config.needAuth

module.exports = (ctx, next) => {
  let path = ctx.request.originalUrl

  // 接口不需要登陆，直接next
  if (needAuth.indexOf('path') < 0) {
    return next()
  }

  // 接口需要登陆
  var token = ctx.request.headers['authorization']
  if (!token) {
    // ctx.response.type = 'json'
    ctx.response.body = {
      code: 401,
      message: 'you need login:there is no token'
    }
    return
  }

  try {
    //解密获取的token
    let decoded = jwt.decode(token, jwtSecret)

    //校验有效期
    if (decoded.exp <= Date.now()) {
      ctx.response.body = {
        code: 401,
        message: 'you need login:token is expired'
      }
    }
    next()
  } catch (err) {
    // ctx.response.type = 'json'
    ctx.response.body = {
      code: 401,
      message: 'you need login:token is expired'
    }
  }
}
