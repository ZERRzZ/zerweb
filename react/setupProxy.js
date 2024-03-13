const proxy = require('http-proxy-middleware')

module.exports = app => {

  app.use(
    proxy('/api', { // 匹配 api 路径
      target: 'http://localhost:5000', // 配置转发地址
      changeOrigin: true, // 控制请求头 host 的值, 为 true 时改变为 5000, 为 false 时不变
      pathRewrite: { '^/api': '' } // 去除请求前缀，保证交给后台服务器的是正常地址
    })
  )

}