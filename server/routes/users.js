/**
 * @description /users 路由文件夹，示例
 * @author Uni
 * @since 1.0
 */

const router = require('koa-router')()
const { captcha, register,uploadAvatar,login,handleError, handleParameter } = require('../controllers/users')

router.prefix('/api/users')

router.get('/captcha',captcha)
router.post('/register',register)
router.post('/login',login)
router.post('/upload',uploadAvatar)

// router.get('/:id', handleError)

router.post('/param', handleParameter)


module.exports = router
