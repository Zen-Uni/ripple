/**
 * @description /relations动态路由
 * @author Hans
 * @since 1.0
 */

const router = require('koa-router')()
const {
    handleGetRelations,
    handleGetSearchRelations,
    handleGetSearchUsers,
    handleGetSearchGroups,
    handlePostFriend,
    handlePutFriend,
    handleDeleteFriend,
    handlePostGroup,
    handlePutGroup,
} = require('../controllers/relations')

router.prefix('/api/relations')

router.get('/', handleGetRelations)
router.get('/search', handleGetSearchRelations)
router.get('/users/search', handleGetSearchUsers)
router.get('/groups/search', handleGetSearchGroups)
router.post('/friends', handlePostFriend)
router.put('/friends/:userId', handlePutFriend)
router.delete('/friends/:userId', handleDeleteFriend)
router.post('/groups', handlePostGroup)
router.put('/groups/:groupId', handlePutGroup)

module.exports = router
