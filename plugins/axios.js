import axios from 'axios'
import {getCookieInClient} from '../util/tools'

export default ({ app, store, redirect }) => {
  // 服务端渲染需要完整的url
  if (process.server) {
    axios.defaults.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3001}`
  }

  axios.interceptors.request.use(config => {
    if (typeof document === 'object') {
      let token = getCookieInClient('token')
      if (token) {
        config.headers.Authorization = token
      }
    }
    return config
  }, err => {
    return Promise.reject(err)
  })

  axios.interceptors.response.use(response => {
    if (response.data.code === 401) {
      redirect('/login')
    }
    return response
  }, err => {
    return Promise.reject(err)
  })
}
