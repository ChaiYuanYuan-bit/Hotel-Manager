const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
    app.use(//遇见api1前缀的请求，就会触发该代理
        createProxyMiddleware('/api1',{
            target:'http://localhost:5000',//请求转发给谁
            changeOrigin:true,//控制服务器收到的请求头中Host字段的值
            pathRewrite:{'^/api1':''}//重写请求路径
        }),
    )
}