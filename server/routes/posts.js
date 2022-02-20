/**
 * @description /posts动态路由
 * @author Hans
 * @since 1.0
 */

const router = require('koa-router')()
const {
    handleGetAllPosts,
    handlePostPost,
    handleGetPosts,
    handleDeletePost,
    handlePutPostLike,
    handlePutPostUnlike,
    handlePostComment,
    handleDeleteComment,
    handlePostReportPost,
} = require('../controllers/posts')

router.prefix('/api/posts')

router.get('/', handleGetAllPosts)
router.post('/', handlePostPost)
router.get('/users/:userId', handleGetPosts)
router.delete('/:postId', handleDeletePost)
router.put('/:postId/like', handlePutPostLike)
router.put('/:postId/unlike', handlePutPostUnlike)
router.post('/:postId/comments', handlePostComment)
router.delete('/comments/:commentId', handleDeleteComment)
router.post('/:postId/reports', handlePostReportPost)

module.exports = router
