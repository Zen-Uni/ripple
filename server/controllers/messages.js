/**
 * @description 与 messages 相关的控制器
 * @author Hans
 * @since 1.0
 */

const {
    User,
    Group,
    Member,
    UserMessage,
    GroupMessage,
    GroupMessageRecord,
} = require('../database/models')
const { CODE_MESSAGES } = require('../const/codes')
const {
    Types: { ObjectId },
} = require('../database')
const {
    distributeUserMessage,
    distributeGroupMessage,
    distributeReadUserMessages,
    distributeReadGroupMessages,
    distributeRecallUserMessages,
    distributeRecallGroupMessages,
} = require('../socket.io/distributors/messages')

class UserMessagesCtl {
    async getRecent(ctx, next) {
        const { sub } = ctx
        const userMessages = await UserMessage.populate(
            await UserMessage.aggregate()
                .match({
                    receiver: new ObjectId(sub),
                    status: { $in: [0, 10] },
                })
                .group({
                    _id: '$sender',
                    sender: { $last: '$sender' },
                    messages: { $push: '$$CURRENT' },
                })
                .project('-_id -messages.__v')
                .exec(),
            { path: 'sender', select: 'email username avatarUrl' },
        )
        const groupMessages = await GroupMessageRecord.aggregate()
            .match({
                receiver: new ObjectId(sub),
            })
            .lookup({
                from: 'group_messages',
                let: {
                    group_message_record_since: '$since',
                    group_message_record_group: '$group',
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $gte: [
                                            '$_id',
                                            '$$group_message_record_since',
                                        ],
                                    },
                                    {
                                        $eq: [
                                            '$group',
                                            '$$group_message_record_group',
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'messages',
            })
            .project('-_id -__v -receiver -since -messages.__v')
            .exec()
        ctx.body = {
            code: CODE_MESSAGES.SUCCESS,
            msg: '获取最近消息成功',
            data: {
                userMessages,
                groupMessages,
            },
        }
    }
    async getUserMessages(ctx, next) {
        const {
            sub,
            params: { userId },
            request: {
                body: { page, pageSize },
            },
        } = ctx
        // TODO 目标用户不存在
        const messages = await UserMessage.find({
            $or: [
                {
                    sender: sub,
                    receiver: userId,
                },
                {
                    sender: userId,
                    receiver: sub,
                },
            ],
        })
            .sort('-_id')
            .select('-_id -__v')
            .skip(page * pageSize)
            .limit(pageSize)
            .exec()
        ctx.body = {
            code: CODE_MESSAGES.SUCCESS,
            mas: '查询单聊消息成功',
            data: messages,
        }
    }
    async postUserMessage(ctx, next) {
        const {
            sub,
            request: {
                body: { content },
            },
            params: { userId },
        } = ctx
        if ((await User.findById(sub).exec()) === null) {
            ctx.status = 412
            ctx.body = {
                code: CODE_MESSAGES.ERROR_RECEIVER_NOT_EXIST,
                msg: '接收者不存在',
            }
            return
        }
        if (content === undefined || content === null || content === '') {
            ctx.status = 412
            ctx.body = {
                code: CODE_MESSAGES.ERROR_CONTENT_LACK,
                msg: '消息内容不能为空',
            }
            return
        }
        const userMessage = await new UserMessage({
            sender: sub,
            receiver: userId,
            time: new Date(),
            content,
            status: 0,
            type: 'text',
        })
        await userMessage.save()
        const msg = { ...userMessage._doc }
        delete msg.__v
        distributeUserMessage(userId, msg)
        ctx.body = {
            code: CODE_MESSAGES.SUCCESS,
            mas: '单聊消息发送成功',
        }
    }
    async putUserMessage(ctx, next) {
        const {
            sub,
            params: { userMessageId },
            request: {
                query: { isBoundary },
                body: { status },
            },
        } = ctx
        const targetMessage = await UserMessage.findById(userMessageId).exec()
        if (targetMessage === null) {
            ctx.status = 412
            ctx.body = {
                code: CODE_MESSAGES.ERROR_MESSAGE_NOT_EXIST,
                msg: '单聊消息不存在',
            }
            return
        }
        switch (status) {
            case 1:
                if (targetMessage.receiver.toString() !== sub) {
                    ctx.status = 412
                    ctx.body = {
                        code: CODE_MESSAGES.ERROR_RECEIVER_WRONG,
                        msg: '该用户不是消息的接收者',
                    }
                    return
                }
                if (isBoundary) {
                    const { modifiedCount } = await UserMessage.updateMany(
                        { _id: { $lte: targetMessage._id } },
                        { status },
                    ).exec()
                    const userMessageIds = (
                        await UserMessage.find({
                            _id: { $lte: targetMessage._id },
                        })
                            .select('_id')
                            .exec()
                    ).map((v) => v._id)
                    distributeReadUserMessages(
                        targetMessage.receiver,
                        userMessageIds,
                    )
                    ctx.body = {
                        code: CODE_MESSAGES.SUCCESS,
                        msg: `已将${modifiedCount}条消息标记为已读`,
                    }
                    return
                }
                await targetMessage.updateOne({ status }).exec()
                distributeReadUserMessages(targetMessage.receiver, [
                    targetMessage._id,
                ])
                ctx.body = {
                    code: CODE_MESSAGES.SUCCESS,
                    msg: '已将消息标记为已读',
                }
                return
            case 10:
            case 11:
                if (targetMessage.sender.toString() !== sub) {
                    ctx.status = 412
                    ctx.body = {
                        code: CODE_MESSAGES.ERROR_SENDER_WRONG,
                        msg: '该用户不是消息的发送者',
                    }
                    return
                }
                await targetMessage.updateOne({ status }).exec()
                distributeRecallUserMessages(targetMessage.receiver, [
                    targetMessage._id,
                ])
                ctx.body = {
                    code: CODE_MESSAGES.SUCCESS,
                    msg: '已撤回消息',
                }
                return
            default:
                ctx.status = 412
                ctx.body = {
                    code: CODE_MESSAGES.ERROR_STATUS_NOT_EXIST,
                    msg: `消息状态无法更新为${status}`,
                }
                return
        }
    }
    async getGroupMessages(ctx, next) {
        const {
            sub,
            params: { groupId },
            request: {
                body: { page, pageSize },
            },
        } = ctx
        const member = await Member.findOne({
            member: sub,
            group: groupId,
        }).exec()
        if (member === null || member.status !== 1) {
            ctx.status = 412
            ctx.body = {
                code: CODE_MESSAGES.ERROR_NOT_GROUP_MEMBER,
                msg: '该用户不是群成员',
            }
            return
        }
        const groupMessages = await GroupMessage.find({
            group: groupId,
        })
            .sort('-_id')
            .select('-_id -__v')
            .skip(page * pageSize)
            .limit(pageSize)
            .exec()
        ctx.body = {
            code: CODE_MESSAGES.SUCCESS,
            mas: '查询群聊消息成功',
            data: groupMessages,
        }
    }
    async postGroupMessage(ctx, next) {
        const {
            sub,
            request: {
                body: { content },
            },
            params: { groupId },
        } = ctx
        if ((await Group.findById(groupId).exec()) === null) {
            ctx.status = 412
            ctx.body = {
                code: CODE_MESSAGES.ERROR_GROUP_NOT_EXIST,
                msg: '群不存在',
            }
            return
        }
        if (content === undefined || content === null || content === '') {
            ctx.status = 412
            ctx.body = {
                code: CODE_MESSAGES.ERROR_CONTENT_LACK,
                msg: '消息内容不能为空',
            }
            return
        }
        const groupMessage = await new GroupMessage({
            sender: sub,
            group: groupId,
            time: new Date(),
            content,
            status: 0,
            type: 'text',
        })
        await groupMessage.save()
        const msg = { ...groupMessage._doc }
        delete msg.__v
        distributeGroupMessage(groupId, msg) // TODO 失败时回滚
        ctx.body = {
            code: CODE_MESSAGES.SUCCESS,
            mas: '群聊消息发送成功',
        }
    }
    async putGroupMessage(ctx, next) {
        const {
            sub,
            params: { groupMessageId },
            request: {
                query: { isBoundary },
                body: { status },
            },
        } = ctx
        const targetMessage = await GroupMessage.findById(groupMessageId).exec()
        if (targetMessage === null) {
            ctx.status = 412
            ctx.body = {
                code: CODE_MESSAGES.ERROR_MESSAGE_NOT_EXIST,
                msg: '群聊消息不存在',
            }
            return
        }
        switch (status) {
            case 1:
                if (isBoundary) {
                    const { modifiedCount } = await GroupMessage.updateMany(
                        { _id: { $lte: targetMessage._id } },
                        { status },
                    ).exec()
                    const groupMessageIds = (
                        await UserMessage.find({
                            _id: { $lte: targetMessage._id },
                        })
                            .select('_id')
                            .exec()
                    ).map((v) => v._id)
                    distributeReadGroupMessages(
                        targetMessage.group,
                        groupMessageIds,
                    )
                    ctx.body = {
                        code: CODE_MESSAGES.SUCCESS,
                        msg: `已将${modifiedCount}条消息标记为已读`,
                    }
                    return
                }
                await targetMessage.updateOne({ status }).exec()
                distributeReadGroupMessages(targetMessage.group, [
                    targetMessage._id,
                ])

                ctx.body = {
                    code: CODE_MESSAGES.SUCCESS,
                    msg: '已将消息标记为已读',
                }
                return
            case 10:
            case 11:
                await targetMessage.updateOne({ status }).exec()
                distributeRecallGroupMessages(targetMessage.group, [
                    targetMessage._id,
                ])
                ctx.body = {
                    code: CODE_MESSAGES.SUCCESS,
                    msg: '已撤回消息',
                }
                return
            default:
                ctx.status = 412
                ctx.body = {
                    code: CODE_MESSAGES.ERROR_STATUS_NOT_EXIST,
                    msg: `消息状态无法更新为${status}`,
                }
                return
        }
    }
}

module.exports = new UserMessagesCtl()
