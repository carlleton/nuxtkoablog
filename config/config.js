let config = {
  mysqlConfig: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nuxtkoablog'
  },
  jwtSecret: 'nuxtkoablog123abc',
  needAuth: [
    '/api/posts/add',
    '/api/posts/update',
    '/api/posts/del',
    '/api/cates/add',
    '/api/cates/update',
    '/api/cates/del'
  ],
  pageSize: 20
}

module.exports = config
