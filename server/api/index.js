const router = require('koa-router')()

const user = require('./user')

router.use('/user', user.routes())

module.exports = router
