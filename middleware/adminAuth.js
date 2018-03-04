import { isLogin, getCookiesInServer } from '../util/tools'
// const needAuth = require('../config/config').needAuth

export default function ({ isClient, isServer, route, req, res, redirect }) {
  // 服务器端判断是否需要登陆
  if (isServer) {
    let cookies = getCookiesInServer(req)
    let path = req.originalUrl

    if (path.indexOf('admin') > 0 && !cookies.token) {
      redirect('/login')
    }
  }
  // 客户端
  if (isClient) {
    if (route.path.indexOf('admin') > 0 && !isLogin()) {
      redirect('login')
    }
  }
}
