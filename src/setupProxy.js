/**file: setupProxy.js
 * 这个文件是create-react-app命令创建的项目(主要是包含了react-scripts包)会自动识别的文件
 * 相当于react-scripts支持了http-proxy-middleware, 用于服务端
 */
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(createProxyMiddleware('/api',
    {
      target: "https://www.mxnzp.com",
      changeOrigin: true,
    },
  ),
  createProxyMiddleware('/our',
    {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      pathRewrite:{
        "^/our":""
      }
    }
    )
  )
}