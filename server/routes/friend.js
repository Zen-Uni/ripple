/**
 * @description friend request route
 */

const { handleFriendReq, handleReqList } = require('../controller/friend');

const router = require('koa-router')()

router.prefix('/api/friend');

// 好友请求
router.post('/request', async (ctx, next) => {
    const { to } = ctx.request.body;
    const token = ctx.headers.authorization;
    ctx.body = await handleFriendReq(to, token);
})


// 查询好友请求消息
router.get("/req-list", async (ctx, next) => {
    const token = ctx.headers.authorization;
    ctx.body = await handleReqList(token);
})


module.exports = router;