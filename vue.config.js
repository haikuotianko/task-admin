const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // hot: true,
    // disableHostCheck: true,
    // host: 'localhost',
    // port: 8080,
    https: false,
    // 设置代理
    proxy: {
      '/api': {
        // 目标 API 地址
        target: 'http://test.zizhuxitong.com',
        // 如果要代理 websockets
        // ws: true,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
})
