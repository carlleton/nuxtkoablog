function options(config) {
  config.pageSize = 10
  config.needAuth = [
    '/api/posts/add',
    '/api/posts/update',
    '/api/posts/del',
    '/api/cates/add',
    '/api/cates/update',
    '/api/cates/del'
  ]
  config.receiveEmail = 'carlleton@vcandou.com'
  config.sendEmail = {
    host: 'smtp.163.com',
    user: 'aaa@163.com',
    pass: '123456',
    from: 'backupemail'
  }
}

module.exports = {
  options: options
}
