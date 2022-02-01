/**
 * @description 与 users 相关的控制器
 * @author Uni
 * @since 1.0
 */

 const { ErrorModel, Errorno, SuccessModel, Successno, TIP_CODE } = require("../config/model")
 const Tip = require("../models/tips")
 const User = require("../models/users")
 const { createToken } = require("../utils/token")
 const path = require('path')
class UsersCtl {
    // TODO: verify 抽象优化
    async create(ctx, next) {
        ctx.verifyParams({
            username: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            },
            email: {
                type: 'string',
                required: true
            },
            captcha: {
                type: 'string',
                required: true
            }
        })
        const { username, email, password, captcha } = ctx.request.body
            
        try {
            // TODO: findOne 优化
            const check_res = await Tip.find({ email, captcha })
            if (!check_res.length) {
                ctx.status = 404
                ctx.body = new ErrorModel(Errorno.check_captcha.code, Errorno.check_captcha.msg)
                return 
            }
            // TODO: bug, 如果验证码和占用验证逻辑问题
            const check_user_res = await User.find({ email })
            
            if (check_user_res.length) {
                ctx.status = 409
                ctx.body = new ErrorModel(Errorno.check_user_exist.code, Errorno.check_user_exist.msg)
                return
            }

            const user = await new User({
                email, 
                password,
                username
            }).save()
            const token = createToken(user._id, user.username)
            ctx.body = new SuccessModel({ token }, Successno.register_success)
            
        } catch (err) {
            // TODO: 错误上报优化
            ctx.throw(500, "未知错误")
        }
    }

    async login(ctx, next) {
        try {
            const user = await User.findOne(ctx.request.body)
            if (!user) {
                ctx.status = 404
                ctx.body = new ErrorModel(Errorno.check_login.code, Errorno.check_login.msg)
                return 
            }
            const token = createToken(user._id, user.username)
            user._doc.token = token
            ctx.body = new SuccessModel(user, Successno.login_success)
        } catch(err) {  
            // TODO: 错误上报优化
            console.log(err)
            ctx.throw(500, "未知错误")
        }
    }

    async modify(ctx, next) {
        // TODO: 校验优化 
        ctx.verifyParams({
            username: {
                type: 'string',
                required: false
            },
            password: {
                type: 'string',
                required: false
            },
            headling: {
                type: 'string',
                required: false
            },
            avatar_url: {
                type: 'string',
                required: false
            },
            id: {
                type: 'string',
                required: true
            }
        })

        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = new SuccessModel(ctx.request.body, Successno.user_modify_success);
    }

    async upload(ctx, next) {
        const file = ctx.request.files.file
        const basename = path.basename(file.path)
        const url = `${ctx.origin}/uploads/${basename}`
        ctx.body = new SuccessModel({ url }, Successno.create_img_url)
    }

    async search(ctx, next) {
        // TODO: 校验优化
        ctx.verifyParams({
            email: {
                type: 'string',
                required: true
            }
        })
        const { email } = ctx.request.body
        const user = await User.findOne(email).select("+avatar_url +headline")
        if (!user) {
            ctx.body = new ErrorModel(Errorno.search_user.code, Errorno.search_user.msg)
            return
        }

        ctx.body = new SuccessModel(user)
    }

    async request(ctx, next) {
        // TODO: 校验优化
        ctx.verifyParams({
            id: {
                type: 'string',
                required: true
            },
            remark_msg: {
                type: 'string',
                required: false
            },
            request_id: {
                type: 'string',
                required: true
            }
        })

        // TODO: 同一请求更新处理
        ctx.request.body.user_id = ctx.params.id
        const relation = await new Tip({
            // TODO：消息码优化
            type_id: TIP_CODE.user,
            ...ctx.request.body
        }).save()
        ctx.body = new SuccessModel(relation, "好友请求发送成功")
    }

    async response(ctx, next) {
        // TODO: 校验优化
        ctx.verifyParams({
            user_id: {
                type: 'string',
                required: true
            },
            type_id: {
                type: 'number',
                required: true
            }
        })

        // TODO: 2.2
    }

    handleError(ctx, next) {
        const id = ctx.params.id
        if (id > 10) ctx.throw(412, "条件错误：输入的 id 应该小于等于 10")

        ctx.body = `输入大于 10 的 id 试试康, 当前 id 为: ${id}`
    }

    // 辅助接口对应的控制器
    async retrieve(ctx, next) {
        ctx.body = await User.find()
    }

    async delete(ctx, next) {
        const { email } = ctx.query
        const user = await User.findOneAndRemove({ email })
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.status = 204
    }

}

module.exports = new UsersCtl()