/**
 * @description 动态相关路由
 * @author Uni
 * @since 1.0
 */

const { post, listMoments, like } = require('../controllers/moments')
const { auth } = require('../middleware/auth')

const router = require('koa-router')()

router.prefix('/moments')

router.post('/post', auth, post)
router.get('/list', auth, listMoments)   // 等待 likers 后优化
router.patch('/:id/like', auth, like)

module.exports = router
