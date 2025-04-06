const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    port: 3000, // 将开发服务器端口改为 3000
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端地址
        changeOrigin: true, // 是否改变请求源
        // pathRewrite: { '^/api': '' }, // 如果后端接口路径不包含 `/api`，可以通过此配置移除
      },
    },
  },
};
