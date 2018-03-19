const router = require('koa-router')()

const users = require('./users')
const posts = require('./posts')
const cates = require('./cates')
const notes = require('./notes')
const notecates = require('./notecates')
const options = require('./options')

let jwtAuth = require('../middleware/jwtAuth')

router.prefix('/api')
router.use('/', jwtAuth)

router.use('/users', users.routes())
router.use('/posts', posts.routes(), posts.allowedMethods())
router.use('/cates', cates.routes())
router.use('/notes', notes.routes())
router.use('/notecates', notecates.routes())
router.use('/options', options.routes())

router.all('/', async (ctx, next) => {
  ctx.status = 200
  ctx.body = {
    message: '欢迎使用API服务！'
  }
})
module.exports = router
