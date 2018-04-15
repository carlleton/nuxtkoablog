import { isLogin, getCookiesInServer } from '../util/tools'
import axios from 'axios'

export default async function ({ isClient, isServer, route, req, res, redirect }) {
  let result = await axios.get('/api')
  let path = ''
  let notInstalled = result.data.notInstalled

  // 服务器端判断是否需要登陆
  if (isServer) {
    let cookies = getCookiesInServer(req)
    path = req.originalUrl

    if (path.indexOf('/install') === -1 && notInstalled) {
      return redirect('/install')
    }

    if (path.indexOf('/install') > -1 && !notInstalled) {
      return redirect('/')
    }

    if (path.indexOf('admin') > 0 && !cookies.token) {
      return redirect('/login')
    }
  }
  // 客户端
  if (isClient) {
    path = route.path

    if (path.indexOf('/install') === -1 && notInstalled) {
      return redirect('/install')
    }

    if (path.indexOf('/install') > -1 && !notInstalled) {
      return redirect('/')
    }
    
    if (path.indexOf('admin') > 0 && !isLogin()) {
      return redirect('login')
    }
  }
}
