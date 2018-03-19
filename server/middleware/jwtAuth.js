let jwt = require('jwt-simple')
const config = require('../../config')
const jwtSecret = config.jwtSecret
const needAuth = config.needAuth

module.exports = (ctx, next) => {
  // let path = ctx.req.originalUrl

  // 接口不需要登陆，直接next
  if (needAuth.indexOf('path') < 0) {
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

  try {
    //解密获取的token
    let decoded = jwt.decode(token, jwtSecret)

    //校验有效期
    if (decoded.exp <= Date.now()) {
      ctx.body = {
        code: 401,
        message: 'you need login:token is expired'
      }
    }
    next()
  } catch (err) {
    // ctx.response.type = 'json'
    ctx.body = {
      code: 401,
      message: 'you need login:token is expired'
    }
  }
}
