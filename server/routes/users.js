/**
 * @description /users 路由文件夹，示例
 * @author Uni
 * @since 1.0
 */

const router = require('koa-router')()
const { getCaptcha } = require('../controllers/tips')
const { create, delete: del, login, upload, modify, retrieve, request, search, response } = require('../controllers/users')
const { auth, checkOwner } = require('../middleware/auth')

router.prefix('/users')

router.get('/captcha', getCaptcha)
router.post('/register', create)
router.post('/login', login)

/**
 * @description 需 auth 校验的接口
 */
router.patch('/:id/modify', auth, checkOwner, modify)
router.post('/upload', auth, upload)
router.get('/search', auth, search)
// 好友请求相关
router.post('/request', auth, request)
router.patch('/response', auth, response)
// 辅助接口
router.get('/retrieve', retrieve)
router.delete('/delete', del)    // TODO: 删除鉴权优化, checkOwner


module.exports = router
