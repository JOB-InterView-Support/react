const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // localhost:8000로의 요청
  app.use(
    '/camera',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );

  // localhost:8080으로의 요청
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};
