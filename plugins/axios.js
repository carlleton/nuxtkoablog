export default ({ app, store, $axios, redirect }) => {
  // 服务端渲染需要完整的url
  if (process.server) {
    $axios.defaults.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3001}`
  }

  $axios.interceptors.request.use(config => {
    if (typeof document === 'object') {
      let token = sessionStorage.getItem('token')
      $axios.setToken(token, 'Bearer')
    }
    // $axios.setToken('456')
    return config
  }, err => {
    return Promise.reject(err)
  })

  $axios.interceptors.response.use(response => {
    if (response.data.code === 401) {
      sessionStorage.setItem('token', '')
      redirect('/login')
    }
    return response
  }, err => {
    return Promise.reject(err)
  })
}
