// import users from './users'

const router = require('koa-router')()

const users = require('./users')
const posts = require('./posts')
const cates = require('./cates')
const options = require('./options')
const backup = require('./backup')
const install = require('./install')

let jwtAuth = require('../middleware/jwtAuth')

router.prefix('/api')
router.use('/', jwtAuth)

router.use('/users', users.routes(), users.allowedMethods())
router.use('/posts', posts.routes(), posts.allowedMethods())
router.use('/cates', cates.routes(), cates.allowedMethods())
router.use('/options', options.routes(), options.allowedMethods())
router.use('/backup', backup.routes(), backup.allowedMethods())
router.use('/install', install.routes(), install.allowedMethods())

router.all('/', async (ctx, next) => {
  ctx.status = 200
  ctx.body = {
    message: '欢迎使用API服务！'
  }
})

module.exports = router
