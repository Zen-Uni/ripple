/**
 * @description /users 路由文件夹，示例
 * @author Uni
 * @since 1.0
 */

const router = require('koa-router')()
const { index, bar, handleError, handleParameter } = require('../controllers/users')


router.prefix('/users')

router.get('/', index)
router.get('/:id', handleError)
router.get('/bar', bar)

router.post('/param', handleParameter)


module.exports = router
