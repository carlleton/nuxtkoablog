const router = require('koa-router')()

const users = require('./users')
const posts = require('./posts')
const tags = require('./tags')

router.prefix('/api')


router.use('/users', users.routes())
router.use('/posts', posts.routes(), posts.allowedMethods())
router.use('/tags', tags.routes())

router.all('/', async (ctx, next) => {
  ctx.status = 200
  ctx.body = {
    message: '欢迎使用API服务！'
  }
})
module.exports = router
