const router = require('koa-router')()
const {
    User,
    Group,
    Member,
    UserMessage,
    GroupMessage,
    GroupMessageRecord,
} = require('../database/models')
const { sign } = require('../utils/jwt')
const {
    Types: { ObjectId },
} = require('mongoose')

module.exports = async (app) => {
    router.prefix('/api/test')

    router.post('/newUser', async (ctx, next) => {
        const {
            request: {
                body: { userName },
            },
        } = ctx
        const lastUser = await User.find({}).sort('-_id').limit()
        const email =
            lastUser[0] === undefined ? 1 : Number(lastUser[0].email) + 1
        const newUser = await new User({
            email,
            password: 'xxx',
            username: userName + email,
            createDate: new Date(),
            avatarUrl: null,
        }).save()
        ctx.body = {
            msg: '测试：新建用户成功',
            token: await sign(newUser._id),
        }
    })

    router.get('/newUserToken/:userId', async (ctx, next) => {
        const {
            params: { userId },
        } = ctx
        if ((await User.findById(userId)) === null) {
            ctx.body = {
                msg: '测试：目标用户不存在',
            }
            return
        }
        ctx.body = {
            msg: '测试：获取用户新token成功',
            token: await sign(userId),
        }
    })

    router.post('/newGroup', async (ctx, next) => {
        const {
            sub,
            request: {
                body: { groupName },
            },
        } = ctx
        await new Group({
            creator: sub,
            groupName,
        }).save()
        ctx.body = {
            msg: '测试：新建群聊成功',
        }
    })

    router.put('/becomeNewMember', async (ctx, next) => {
        const {
            sub,
            request: {
                body: { member, group },
            },
        } = ctx
        await new Member({
            member,
            group,
            time: {
                apply: new Date(),
                reply: new Date(),
            },
            status: 1,
        }).save()
        await new GroupMessageRecord({
            receiver: member,
            group,
            since: new ObjectId(0),
        }).save()
        const io = require('../socket.io/index').gainIo()
        const userRoomsSet = io.of('/').adapter.rooms.get('user:' + member)
        userRoomsSet !== undefined &&
            userRoomsSet.forEach((v) => {
                io.of('/')
                    .adapter.rooms.get('group:' + group)
                    .add(v)
            })
        ctx.body = {
            msg: '测试：添加群成员成功',
        }
    })

    app.use(router.routes()).use(router.allowedMethods())
}
