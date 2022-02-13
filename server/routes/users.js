/**
 * @description /users 路由文件夹，示例
 * @author Uni
 * @since 1.0
 */

const router = require('koa-router')()
const {
    handlePostUserRegister,
    handlePostUserLogin,
    handlePutUserName,
    handlePutPassword,
    handlePutMemo,
} = require('../controllers/users')

router.prefix('/api/users')

router.post('/', handlePostUserRegister)
router.post('/login', handlePostUserLogin)
router.put('/userName', handlePutUserName) // TODO 要考虑B端
router.put('/password', handlePutPassword)
router.put('/memo', handlePutMemo)

module.exports = router
