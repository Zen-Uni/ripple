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
                .catch((e) => {
                    e.res = {
                        status: 500,
                        body: {
                            code: CODES_RELATIONS.ERROR_DATABASE,
                            msg: '好友获取失败',
                        },
                    }
                    throw e
                })
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
            .catch((e) => {
                e.res = {
                    status: 500,
                    body: {
                        code: CODES_RELATIONS.ERROR_DATABASE,
                        msg: '群聊获取失败',
                    },
                }
                throw e
            })
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
            })
                .save()
                .catch((e) => {
                    throw e
                }),
            await new Friend({
                subject: new ObjectId(object),
                object: new ObjectId(sub),
                time: { apply: new Date() },
                status: 0,
                memo,
            })
                .save()
                .catch((e) => {
                    throw e
                }),
        ]).catch((e) => {
            // TODO unique时换成Update操作
            e.res = {
                status: 500,
                body: {
                    code: CODES_RELATIONS.ERROR_DATABASE,
                    msg: '好友请求创建失败',
                },
            }
            throw e
        })
        ctx.body = {
            code: CODES_RELATIONS.SUCCESS,
            msg: '好友请求创建成功',
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
        })
            .exec()
            .catch(() => null)
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
                })
                    .exec()
                    .catch((e) => {
                        e.res = {
                            status: 500,
                            body: {
                                code: CODES_RELATIONS.ERROR_DATABASE,
                                msg: '好友备注修改失败',
                            },
                        }
                        throw e
                    })
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
                    )
                        .exec()
                        .catch((e) => {
                            throw e
                        }),
                    Friend.findOneAndUpdate(
                        {
                            subject: new ObjectId(userId),
                            object: new ObjectId(sub),
                        },
                        {
                            status: 1,
                        },
                    )
                        .exec()
                        .catch((e) => {
                            throw e
                        }),
                ]).catch((e) => {
                    e.res = {
                        status: 500,
                        body: {
                            code: CODES_RELATIONS,
                            msg: '好友请求同意失败',
                        },
                    }
                    throw e
                })
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: '好友请求同意成功',
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
                    )
                        .exec()
                        .catch((e) => {
                            throw e
                        }),
                    Friend.findOneAndUpdate(
                        {
                            subject: new ObjectId(userId),
                            object: new ObjectId(sub),
                        },
                        {
                            status: 2,
                        },
                    )
                        .exec()
                        .catch((e) => {
                            throw e
                        }),
                ]).catch((e) => {
                    e.res = {
                        status: 500,
                        body: {
                            code: CODES_RELATIONS,
                            msg: '好友请求拒绝失败',
                        },
                    }
                    throw e
                })
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: '好友请求拒绝成功',
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
        })
            .exec()
            .catch(() => [])
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
        })
            .exec()
            .catch((e) => {
                e.res = {
                    status: 500,
                    body: {
                        code: CODES_RELATIONS.ERROR_DATABASE,
                        msg: '好友删除失败',
                    },
                }
                throw e
            })
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
        try {
            let newGroup = await new Group({
                owner: new ObjectId(sub),
                admins: [new ObjectId(sub)],
                groupName,
            })
            await newGroup.save().catch((e) => {
                throw e
            })
            await new Member({
                member: new ObjectId(sub),
                group: new ObjectId(newGroup._id),
                time: {
                    apply: new Date(),
                    reply: new Date(),
                },
                status: 1,
            })
                .save()
                .catch((e) => {
                    throw e
                })
            newGroup = newGroup._doc
            delete newGroup.__v
            ctx.body = {
                code: CODES_RELATIONS.SUCCESS,
                msg: '群聊创建成功',
                data: newGroup,
            }
        } catch (e) {
            e.res = {
                status: 500,
                body: {
                    code: CODES_RELATIONS.ERROR_DATABASE,
                    msg: '群聊创建失败',
                },
            }
            throw e
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
        const group = await Group.findById(groupId)
            .exec()
            .catch(() => null)
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
                })
                    .exec()
                    .catch((e) => {
                        e.res = {
                            status: 500,
                            body: {
                                code: CODES_RELATIONS.ERROR_DATABASE,
                                msg: '退出该群失败',
                            },
                        }
                        throw e
                    })
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: '退出该群成功',
                }
                return
            case 'disbandment':
                if (group.owner.toString() !== sub) {
                    ctx.status = 403
                    return
                }
                await Promise.all([
                    Group.findByIdAndDelete(groupId)
                        .exec()
                        .catch((e) => {
                            throw e
                        }),
                    Member.deleteMany({
                        group: groupId,
                    })
                        .exec()
                        .catch((e) => {
                            throw e
                        }),
                ]).catch((e) => {
                    e.res = {
                        status: 500,
                        body: {
                            code: CODES_RELATIONS.ERROR_DATABASE,
                            msg: '该群解散失败',
                        },
                    }
                    throw e
                })
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
                })
                    .exec()
                    .catch((e) => {
                        e.res = {
                            status: 500,
                            body: {
                                code: CODES_RELATIONS.ERROR_DATABASE,
                                msg: '该群转让失败',
                            },
                        }
                        throw e
                    })
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
                })
                    .exec()
                    .catch((e) => {
                        e.res = {
                            status: 500,
                            body: {
                                code: CODES_RELATIONS.ERROR_DATABASE,
                                msg: '该群群名更改失败',
                            },
                        }
                        throw e
                    })
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
                                const user = await User.findById(v)
                                    .exec()
                                    .catch(() => null)
                                if (user === null) {
                                    resolve([v, null])
                                    return
                                }
                                await Member.deleteOne({
                                    member: new ObjectId(user._id),
                                })
                                    .exec()
                                    .catch(() => resolve([v, null]))
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
                        msg: `有${fails.length}人移除失败`,
                        data: fails,
                    }
                    return
                }
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: `共${results.length}名成员移除成功`,
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
                                const user = await User.findById(v)
                                    .exec()
                                    .catch(() => null)
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
                                        resolve([v, null])
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
                        msg: `有${fails.length}人邀请失败`,
                        data: fails,
                    }
                    return
                }
                ctx.body = {
                    code: CODES_RELATIONS.SUCCESS,
                    msg: `共${results.length}人邀请成功`,
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
