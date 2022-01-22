/**
 * @description 批量读取路由文件，自动化注册中间件
 * @author Uni
 * @since 1.0
 */

const fs = require('fs')

module.exports = app => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return 
    const router = require(`./${file}`)
    app.use(router.routes()).use(router.allowedMethods())
  })
}