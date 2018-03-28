import { isLogin, getCookiesInServer } from '../util/tools'
import axios from 'axios'

export default async function ({ isClient, isServer, route, req, res, redirect }) {
  let result = await axios.get('/api')

  // 服务器端判断是否需要登陆
  if (isServer) {
    let cookies = getCookiesInServer(req)
    let path = req.originalUrl

    if (path.indexOf('/install') === -1 && result.data.notInstalled) {
      redirect('/install')
    }

    if (path.indexOf('admin') > 0 && !cookies.token) {
      redirect('/login')
    }
  }
  // 客户端
  if (isClient) {
    var path = route.path
    if (path.indexOf('/install') === -1 && result.data.notInstalled) {
      redirect('/install')
    }
    if (path.indexOf('admin') > 0 && !isLogin()) {
      redirect('login')
    }
  }
}
