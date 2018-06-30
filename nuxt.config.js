module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'blog source of nuxtkoablog' },
      /*优先使用 IE 最新版本和 Chrome  */
      { name: 'renderer', content: 'webkit' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    '~assets/css/main.css',
    '~assets/css/font-awesome.min.css',
    'element-ui/lib/theme-chalk/reset.css',
    'element-ui/lib/theme-chalk/index.css'
  ],
  /**
   * 全局变量
   */
  env: {
    pageSize: 10,
    mysqlConfig: {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'nuxtkoablog'
    },
    jwtSecret: 'nuxtkoablog123abc' // token盐
  },
  plugins: [
    { src: '~plugins/axios' },
    { src: '~plugins/mavon-editor', ssr: false },
    { src: '~plugins/element-ui' }
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#04acf7',
    height: '4px',
    failedColor: 'red'
  },
  /*
   ** Build configuration
   */
  build: {
    vendor: ['axios','element-ui'],
    /*
     ** Run ESLINT on save
     */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  router: {
    middleware: 'adminAuth'
  },
  render: {
    bundleRenderer: {
      cache: require('lru-cache')({
        max: 1000,
        maxAge: 1000 * 60 * 15
      })
    }
  }
}
