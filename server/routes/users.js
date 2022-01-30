/**
 * @description /users 路由文件夹，示例
 * @author Uni
 * @since 1.0
 */

const router = require('koa-router')()
const { getCaptcha } = require('../controllers/tips')
const { create, delete: del } = require('../controllers/users')

router.prefix('/users')

router.get('/captcha', getCaptcha)
router.post('/register', create)
router.delete('/delete', del)    // TODO: 删除鉴权优化


module.exports = router
