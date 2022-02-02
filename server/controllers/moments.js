/**
 * @description 动态相关控制器
 * @author Uni
 * @since 1.0
 */

const { ErrorModel, Errorno, SuccessModel, Successno } = require("../config/model")
const Moment = require("../models/moments")
const User = require("../models/users")

class MomentCtl {
    async post(ctx, next) {
        ctx.verifyParams({
            text: {
                type: 'string',
                required: false
            },
            img_url: {
                type: 'array',
                required: false
            }
        })
        const { text, img_url } = ctx.request.body
        if (!text?.trim() && img_url.length === 0) {
            ctx.status = 412
            ctx.body = new ErrorModel(Errorno.post_moment_fail.code, Errorno.post_moment_fail.msg)
            return 
        }
        const moment = await new Moment({
            ...ctx.request.body,
            user_id: ctx.state.user.id
        }).save()
        const user = await User.findById(ctx.state.user.id).select('+moments')
        if (!user.moments.map(id => id.toString()).includes(moment._id)) {
            user.moments.push(moment._id)
            user.save()
        }

        ctx.body = new SuccessModel(moment,Successno.post_moment_success)
    }

    async listMoments(ctx, next) {
        const { per_page = 10 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const { id } = ctx.state.user
        const user = await User.findById(id).select('+friends').populate('friends')
        const ids = user.friends.map(item => {
            return item._id
        })
        ids.push(id)
        const moments = await Moment.find({
            user_id: {
                $in: ids
            }
        })
        .select('+likers')
        .populate('likers')
        .sort({'_id': -1})
        .limit(perPage)
        .skip(page * perPage)

        const me = await User.findById(id).select('+friends').populate('friends')

        me.friends.push({
            _id: me._id,
            email: me.email,
            username: me.username,
            createdAt: me.createdAt,
            updatedAt: me.updatedAt
        })
        // TODO: 优化给自己点赞的逻辑顺序
        const res = moments.map((moment) => {
            const likerId = moment.likers.map((item) => item._id.toString())
            // console.log(me.friends)
            const likersId = me.friends.filter(item => {
                // console.log(item)
                return likerId.indexOf(item._id.toString()) !== -1 
            })
            return {
                ...moment._doc,
                likers: likersId
            }
        })

        ctx.body = new SuccessModel(res, Successno.list_moment_success)
    }

    async like(ctx,next) {
        ctx.verifyParams({
            id: {
                type: 'string',
                required: true
            }
        })
        const { id } = ctx.params
        const moment = await Moment.findById(id).select('+likers')
        if (!moment.likers.map(id => id.toString()).includes(ctx.state.user.id)) {
            console.log('like')
            
            moment.likers.push(ctx.state.user.id)
            moment.save()
            ctx.status = 200
            ctx.body = new SuccessModel(Successno.like_moment_success)
            return
        } else {
            const index = moment.likers.map(id => id.toString()).indexOf(ctx.state.user.id);
            if (index > -1) {
                moment.likers.splice(index, 1);
                moment.save();
            }
            ctx.status = 200
            ctx.body = new SuccessModel(Successno.dislike_moment_success)
            return
        }
    }
}


module.exports = new MomentCtl()