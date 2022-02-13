/**
 * @description /messages 消息路由
 * @author Hans
 * @since 1.0
 */

const router = require('koa-router')()
const {
    getRecent,
    getUserMessages,
    postUserMessage,
    putUserMessage,
    getGroupMessages,
    postGroupMessage,
    putGroupMessage,
} = require('../controllers/messages')

router.prefix('/api/messages')

router.get('/', getRecent)
router.get('/users/:userId', getUserMessages)
router.post('/users/:userId', postUserMessage)
router.put('/:userMessageId/users', putUserMessage)
router.get('/groups/:groupId', getGroupMessages)
router.post('/groups/:groupId', postGroupMessage)
router.put('/:groupMessageId/groups', putGroupMessage)

module.exports = router
