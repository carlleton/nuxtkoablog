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
    '/api/tags/add',
  ],
  pageSize: 20
}

module.exports = config
