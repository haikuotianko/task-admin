const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
  ? './'
  : '/',
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
  },
  // 去掉map文件 -- 错误定位代码文件
  productionSourceMap: false,
  // 打包配置
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      const random = '?' + '[contenthash]'
      // 清除css，js版本号
      config.output.filename('js/[name].js' + random).end()
      config.output.chunkFilename('js/[name].js' + random).end()
      // 为生产环境修改配置...
      config.plugin('extract-css').tap(args => [{
        filename: 'css/[name].css' + random,
        chunkFilename: 'css/[name].css' + random
      }])
    }
  }
})
