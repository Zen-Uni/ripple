/**
 * @description 与 relations 相关的控制器
 * @author Hans
 * @since 1.0
 */

const { User, Group, Friend, Member } = require('../database/models')
const { CODES_RELATIONS } = require('../const/codes')
const {
    Types: { ObjectId },
} = require('../database')
const { gainIntersection, gainArr1DifferentSet } = require('../utils/helper')

const searchUsers = async (keyword) =>
    await User.find({
        $or: [
            { email: new RegExp(keyword) },
            { userName: new RegExp(keyword) },
        ],
    })
        .select('-password -__v')
        .exec()

const searchGroups = async (keyword) =>
    await Group.find({
        groupName: new RegExp(keyword),
    })
        .select('-__v')
        .exec()

const searchFriends = async (sub, keyword) => {
    const friends = []
    ;(
        await Friend.find({
            subject: new ObjectId(sub),
            status: { $in: [1, 11] },
        })
            .populate({
                path: 'object',
                match: { email: new RegExp(keyword) },
                select: '-password -__v',
            })
            .select('object -_id')
            .exec()
    ).forEach((v) => {
        if (v.object !== null) friends.push(v.object)
    })
    return friends
}

const searchJoinedGroups = async (sub, keyword) =>
    await Member.find({
        member: new ObjectId(sub),
    })
        .populate({
            path: 'group',
            match: new RegExp(keyword),
            select: '-__v',
        })
        .select('-__v')
        .exec()

class RelationsCtl {
    async handleGetRelations(ctx, next) {
        const { sub } = ctx
        const friends = (
            await Friend.find({
                subject: new ObjectId(sub),
                status: { $in: [1, 11] },
            })
                .select('object')
                .populate({ path: 'object', select: '-password -__v' })
                .select('email userName avatarUrl')
                .exec()
        ).map((v) => v.object)
        const groups = await Member.find({
            member: new ObjectId(sub),
        })
            .populate({
                path: 'group',
                select: '-__v',
            })
            .select('-__v')
            .exec()
        ctx.body = {
            code: CODES_RELATIONS.SUCCESS,
            msg: '通讯录查询成功',
            data: { friends, groups },
        }
    }

    async handleGetSearchRelations(ctx, next) {
        const {
            sub,
            request: {
                body: { keyword },
                query: { isGlobal },
            },
        } = ctx
        if (isGlobal) {
            const users = await searchUsers(keyword)
            const groups = await searchGroups(keyword)
            ctx.body = {
                code: CODES_RELATIONS.SUCCESS,
                msg: '搜索成功',
                data: { users, groups },
            }
            return
        }
        const friends = await searchFriends(sub, keyword)
        const groups = await searchJoinedGroups(sub, keyword)
        ctx.body = {
            code: CODES_RELATIONS.SUCCESS,
            msg: '搜索成功',
            data: { friends, groups },
        }
    }

    async handleGetSearchUsers(ctx, next) {
        const {
            sub,
            request: {
                body: { keyword },
                query: { isGlobal },
            },
        } = ctx
        if (isGlobal) {
            const friends = await searchUsers(keyword)
            ctx.body = {
                code: CODES_RELATIONS.SUCCESS,
                msg: '用户搜索成功',
                data: friends,
            }
            return
        }
        const friends = await searchFriends(sub, keyword)
        ctx.body = {
            code: CODES_RELATIONS.SUCCESS,
            msg: '用户搜索成功',
            data: friends,
        }
    }

    async handleGetSearchGroups(ctx, next) {
        const {
            sub,
            request: {
                body: { keyword },
                query: { isGlobal },
            },
        } = ctx
        if (isGlobal) {
            const groups = await searchGroups(keyword)
            ctx.body = {
                code: CODES_RELATIONS.SUCCESS,
                msg: '群聊搜索成功',
                data: groups,
            }
            return
        }
        const groups = await searchJoinedGroups(sub, keyword)
        ctx.body = {
            code: CODES_RELATIONS.SUCCESS,
            msg: '群聊搜索成功',
            data: groups,
        }
    }

    async handlePostFriend(ctx, next) {
        const {
            sub,
            request: {
                body: { object, memo },
            },
        } = ctx
        Promise.all([
            await new Friend({
                subject: new ObjectId(sub),
                object: new ObjectId(object),
                time: { apply: new Date() },
                status: 0,
                memo,
            }).save(),
            await new Friend({
                subject: new ObjectId(object),
                object: new ObjectId(sub),
                time: { apply: new Date() },
                status: 0,
                memo,
            }).save(),
        ]).catch((e) => console.debug(e)) // TODO unique时选择更新
        ctx.body = {
            code: CODES_RELATIONS.SUCCESS,
            msg: '好友请求已创建',
        }
    }

    async handlePutFriend(ctx, next) {
        const {
            sub,
            params: { userId },
            request: {
                body: { type, tip },
            },
        } = ctx
        const friend = await Friend.findOne({
            subject: new ObjectId(sub),
            object: new ObjectId(userId),
        }).exec()
        if (friend === null) {
            ctx.status = 412
            ctx.body = {
                code: CODES_RELATIONS.ERROR_FRIEND_NOT_EXIST,
                msg: '好友或待处理好友申请不存在',
            }
            return
        }
        switch (type) {
            case 'tip':
                await Friend.findByIdAndUpdate(friend._id, {
                    tip,
                }).exec()
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: '好友备注修改成功',
                }
                return
            case 'agree':
                // TODO socket.io同步好友请求
                await Promise.all([
                    Friend.findOneAndUpdate(
                        {
                            subject: new ObjectId(sub),
                            object: new ObjectId(userId),
                        },
                        {
                            status: 11,
                        },
                    ),
                    Friend.findOneAndUpdate(
                        {
                            subject: new ObjectId(userId),
                            object: new ObjectId(sub),
                        },
                        {
                            status: 1,
                        },
                    ),
                ])
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: '好友请求已同意',
                }
                return
            case 'deny':
                await Promise.all([
                    Friend.findOneAndUpdate(
                        {
                            subject: new ObjectId(sub),
                            object: new ObjectId(userId),
                        },
                        {
                            status: 12,
                        },
                    ),
                    Friend.findOneAndUpdate(
                        {
                            subject: new ObjectId(userId),
                            object: new ObjectId(sub),
                        },
                        {
                            status: 2,
                        },
                    ),
                ])
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: '好友请求已拒绝',
                }
        }
    }

    async handleDeleteFriend(ctx, next) {
        const {
            sub,
            params: { userId },
            request: {
                body: { tip },
            },
        } = ctx
        const friends = await Friend.find({
            $or: [
                { subject: new ObjectId(sub), object: new ObjectId(userId) },
                { subject: new ObjectId(userId), object: new ObjectId(sub) },
            ],
            status: { $in: [1, 11] },
        }).exec()
        if (friends.length === 0) {
            ctx.status = 412
            ctx.body = {
                code: CODES_RELATIONS.ERROR_FRIEND_NOT_EXIST,
                msg: '好友不存在',
            }
            return
        }
        await Friend.deleteMany({
            _id: { $in: friends.map((v) => v._id) },
        }).exec()
        ctx.body = {
            code: CODES_RELATIONS.SUCCESS,
            msg: '好友删除成功',
        }
    }

    async handlePostGroup(ctx, next) {
        const {
            sub,
            request: {
                body: { groupName },
            },
        } = ctx
        let newGroup = await new Group({
            owner: new ObjectId(sub),
            admins: [new ObjectId(sub)],
            groupName,
        })
        await newGroup.save()
        await new Member({
            member: new ObjectId(sub),
            group: new ObjectId(newGroup._id),
            time: {
                apply: new Date(),
                reply: new Date(),
            },
            status: 1,
        }).save()
        newGroup = newGroup._doc
        delete newGroup.__v
        ctx.body = {
            code: CODES_RELATIONS.SUCCESS,
            msg: '群聊创建成功',
            data: newGroup,
        }
    }

    async handlePutGroup(ctx, next) {
        const {
            sub,
            params: { groupId },
            request: {
                body: { type, owner, groupName, members },
            },
        } = ctx
        const group = await Group.findById(groupId).exec()
        if (group === null) {
            ctx.status = 412
            ctx.body = {
                code: CODES_RELATIONS.ERROR_GROUP_NOT_EXIST,
                msg: '该群聊不存在',
            }
            return
        }
        switch (type) {
            case 'exit':
                await Member.findOneAndDelete({
                    member: new ObjectId(sub),
                    group: new ObjectId(groupId),
                }).exec()
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: '退出群聊成功',
                }
                return
            case 'disbandment':
                if (group.owner.toString() !== sub) {
                    ctx.status = 403
                    return
                }
                await Promise.all([
                    Group.findByIdAndDelete(groupId).exec(),
                    Member.deleteMany({
                        group: groupId,
                    }).exec(),
                ])
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: '该群解散成功',
                }
                return
            case 'transfer':
                if (group.owner.toString() !== sub) {
                    ctx.status = 403
                    return
                }
                await Group.findByIdAndUpdate(groupId, {
                    owner,
                    admins:
                        group.admins.indexOf(new ObjectId(sub)) === -1
                            ? group.admins.push(owner)
                            : undefined,
                }).exec()
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: '该群转让成功',
                }
                return
            case 'groupName':
                if (group.admins.indexOf(new ObjectId(sub)) === -1) {
                    ctx.status = 403
                    return
                }
                await Group.findByIdAndUpdate(groupId, {
                    groupName,
                }).exec()
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: '该群群名更改成功',
                }
                return
            case 'remove': {
                if (group.admins.indexOf(new ObjectId(sub)) === -1) {
                    ctx.status = 403
                    return
                }
                const results = await Promise.all(
                    members.map(
                        (v) =>
                            new Promise(async (resolve) => {
                                const user = await User.findById(v).exec()
                                if (user === null) {
                                    resolve([v, null])
                                    return
                                }
                                await Member.deleteOne({
                                    member: new ObjectId(user._id),
                                }).exec()
                                resolve([null, v])
                            }),
                    ),
                )
                await Group.findByIdAndUpdate(groupId, {
                    admins: gainArr1DifferentSet(
                        group.admins.map((v) => v.toString()),
                        members,
                    ).map((v) => new ObjectId(v)),
                }).exec()
                const fails = []
                results.forEach((v) => {
                    if (v[0] !== null) fails.push(v[0])
                })
                if (fails.length !== 0) {
                    ctx.body = {
                        code: CODES_RELATIONS.ERROR_INVITATION_FAIL,
                        msg: `${fails.length}人移除失败`,
                        data: fails,
                    }
                    return
                }
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: `${results.length}名成员移除成功`,
                }
                return
            }
            case 'invitation': {
                await User.find({
                    _id: { $in: members.map((v) => new ObjectId(v)) },
                }).exec()
                const results = await Promise.all(
                    members.map(
                        (v) =>
                            new Promise(async (resolve) => {
                                const user = await User.findById(v).exec()
                                if (user === null) {
                                    resolve([v, null])
                                    return
                                }
                                await new Member({
                                    member: new ObjectId(v),
                                    group: new ObjectId(groupId),
                                    time: {
                                        apply: new Date(),
                                        reply: new Date(),
                                    },
                                    status: 11,
                                    tip: user.userName,
                                })
                                    .save()
                                    .catch((e) => {
                                        if (e.code === 11000) return
                                    })
                                resolve([null, v])
                            }),
                    ),
                )
                const fails = []
                results.forEach((v) => {
                    if (v[0] !== null) fails.push(v[0])
                })
                if (fails.length !== 0) {
                    ctx.body = {
                        code: CODES_RELATIONS.ERROR_INVITATION_FAIL,
                        msg: `${fails.length}人邀请失败`,
                        data: fails,
                    }
                    return
                }
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: `${results.length}人邀请成功`,
                }
                return
            }
            default:
                ctx.status = 412
                ctx.body = {
                    code: CODES_RELATIONS.ERROR_TYPE_WRONG,
                    msg: '类型错误',
                }
        }
    }
}

module.exports = new RelationsCtl()
