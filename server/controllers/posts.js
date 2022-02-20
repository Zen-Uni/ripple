/**
 * @description 与 posts 相关的控制器
 * @author Hans
 * @since 1.0
 */

const {
    Post,
    PostComment,
    PostReport,
    User,
    Friend,
} = require('../database/models')
const {
    Types: { ObjectId },
} = require('../database')
const { CODES_POSTS } = require('../const/codes')

const checkIsFriends = async (first, second) => {
    const friends = await Friend.find({
        $or: [
            {
                subject: first,
                object: second,
            },
            {
                subject: second,
                object: first,
            },
        ],
    })
    if (friends.length === 0) return false
    return true
}

class PostsCtl {
    async handleGetAllPosts(ctx, next) {
        const {
            sub,
            request: {
                body: { page, pageSize },
            },
        } = ctx
        const mapFriends = new Map()
        ;(
            await Friend.aggregate()
                .match({
                    $or: [
                        { subject: new ObjectId(sub) },
                        { object: new ObjectId(sub) },
                    ],
                    status: 1,
                })
                .project('-_id subject object')
                .exec()
        ).forEach((v) => {
            mapFriends.set(v.subject, 1)
            mapFriends.set(v.object, 1)
        })
        const friends = []
        mapFriends.forEach((v, key) => friends.push(key))
        friends.map((v) => new ObjectId(v))
        const posts = await Post.find({
            subject: { $in: friends },
        })
            .sort('-_id')
            .select('-__v')
            .skip(page * pageSize)
            .limit(pageSize)
            .exec()
        ctx.body = {
            code: CODES_POSTS.SUCCESS,
            msg: '查询相关动态成功',
            data: posts,
        }
    }

    async handlePostPost(ctx, next) {
        const {
            sub,
            request: {
                body: { type, text, urls, links },
            },
        } = ctx
        switch (type) {
            case 'text': {
                const newPost = await new Post({
                    subject: new ObjectId(sub),
                    time: new Date(),
                    type,
                    content: text,
                }).save()
                const data = { ...newPost._doc }
                delete data.__v
                ctx.body = {
                    code: CODES_POSTS.SUCCESS,
                    msg: '发布纯文本内容动态成功',
                    data,
                }
                return
            }
            case 'img': {
                const newPost = await new Post({
                    subject: new ObjectId(sub),
                    time: new Date(),
                    type,
                    content: text + '\n' + urls.join('\n'),
                }).save()
                delete newPost.__v
                ctx.body = {
                    code: CODES_POSTS.SUCCESS,
                    msg: '发布图文内容动态成功',
                    data: newPost,
                }
                return
            }
            case 'video': {
                const newPost = await new Post({
                    subject: new ObjectId(sub),
                    time: new Date(),
                    type,
                    content: text + '\n' + urls.join('\n'),
                }).save()
                delete newPost.__v
                ctx.body = {
                    code: CODES_POSTS.SUCCESS,
                    msg: '发布视频内容动态成功',
                    data: newPost,
                }
                return
            }
            default:
                ctx.status = 412
                ctx.body = {
                    code: CODES_POSTS.ERROR_TYPE_WRONG,
                    msg: '动态类型错误',
                }
        }
    }

    async handleGetPosts(ctx, next) {
        const {
            sub,
            params: { userId },
            request: {
                body: { page, pageSize },
            },
        } = ctx
        if ((await User.findById(userId)) === null) {
            ctx.status = 412
            ctx.body = {
                code: CODES_POSTS.ERROR_USER_NOT_EXIST,
                msg: '目标用户不存在',
            }
            return
        }
        if (sub !== userId && checkIsFriends(sub, userId)) {
            ctx.status = 412
            ctx.body = {
                code: CODES_POSTS.ERROR_NOT_FRIENDS,
                msg: '该用户无法查询目标用户的动态',
            }
            return
        }
        const posts = await Post.find({
            subject: userId,
        })
            .sort('-time')
            .select('-__v')
            .skip(page * pageSize)
            .limit(pageSize)
            .exec()
        ctx.body = {
            code: CODES_POSTS.SUCCESS,
            msg: `查询用户${userId}的动态成功`,
            date: posts,
        }
    }

    async handleDeletePost(ctx, next) {
        const {
            sub,
            params: { postId },
        } = ctx
        const post = await Post.findById(postId).exec()
        if (post.subject.toString() !== sub) {
            ctx.status = 412
            ctx.body = {
                code: CODES_POSTS.SUCCESS,
                msg: '该用户无法删除该动态',
            }
            return
        }
        await Post.findByIdAndDelete(postId).exec()
        ctx.body = {
            code: CODES_POSTS.SUCCESS,
            msg: '动态删除成功',
        }
    }

    async handlePutPostLike(ctx, next) {
        const {
            sub,
            params: { postId },
        } = ctx
        const post = await Post.findById(postId).exec()
        if (
            post.subject.toString() !== sub &&
            !checkIsFriends(sub, post.subject.toString())
        ) {
            ctx.status = 412
            ctx.body = {
                code: CODES_POSTS.ERROR_NOT_FRIENDS,
                msg: '该用户无法查询点赞该动态',
            }
            return
        }
        const index = post.likes.indexOf(new ObjectId(sub))
        if (index === -1) {
            post.likes.push(new Object(sub))
            await Post.findByIdAndUpdate(postId, post)
        }
        ctx.body = {
            code: CODES_POSTS.SUCCESS,
            msg: `点赞动态${postId}成功`,
        }
    }

    async handlePutPostUnlike(ctx, next) {
        const {
            sub,
            params: { postId },
        } = ctx
        const post = await Post.findById(postId).exec()
        if (
            post.subject.toString() !== sub &&
            !checkIsFriends(sub, post.subject.toString())
        ) {
            ctx.status = 412
            ctx.body = {
                code: CODES_POSTS.ERROR_NOT_FRIENDS,
                msg: '该用户无法查询取消点赞该动态',
            }
            return
        }
        const index = post.likes.indexOf(new ObjectId(sub))
        if (index !== -1) {
            post.likes.splice(index, 1)
            await Post.findByIdAndUpdate(postId, post)
        }
        ctx.body = {
            code: CODES_POSTS.SUCCESS,
            msg: `取消点赞动态${postId}成功`,
        }
    }

    async handlePostComment(ctx, next) {
        const {
            sub,
            params: { postId },
            request: {
                body: { object, content },
            },
        } = ctx
        // TODO 检查object用户是否存在
        await new PostComment({
            subject: new ObjectId(sub),
            object: new ObjectId(object),
            target: new ObjectId(postId),
            time: new Date(),
            content,
        }).save()
        ctx.body = {
            code: CODES_POSTS.SUCCESS,
            msg: `评论${postId}成功`,
        }
    }

    async handleDeleteComment(ctx, next) {
        const {
            sub,
            params: { commentId },
        } = ctx
        const comment = await PostComment.findById(commentId).exec()
        if (comment === null) {
            ctx.status = 412
            ctx.body = {
                code: CODES_POSTS.ERROR_COMMENT_NOT_EXIST,
                msg: '该评论不存在',
            }
            return
        }
        if (comment.subject.toString() !== sub) {
            ctx.status = 412
            ctx.body = {
                code: CODES_POSTS.ERROR_SUBJECT_WRONG,
                msg: '该用户无法删除该评论',
            }
            return
        }
        await PostComment.findByIdAndDelete(commentId).exec()
        ctx.body = {
            code: CODES_POSTS.SUCCESS,
            msg: `删除评论${commentId}成功`,
        }
    }

    async handlePostReportPost(ctx, next) {
        const {
            sub,
            params: { postId },
            request: {
                body: { content },
            },
        } = ctx
        if ((await Post.findById(postId).exec()) === null) {
            ctx.status = 412
            ctx.body = {
                code: CODES_POSTS.ERROR_POST_NOT_EXIST,
                msg: '该动态不存在',
            }
            return
        }
        await new PostReport({
            subject: new ObjectId(sub),
            post: new ObjectId(postId),
            status: 12,
            content,
        }).save()
        ctx.body = {
            code: CODES_POSTS.SUCCESS,
            msg: `提交对${postId}的举报成功`,
        }
    }
}

module.exports = new PostsCtl()
