const { ErrorModel, Errorno, SuccessModel, Successno } = require("../config/model")
const Tip = require("../models/tips")
const User = require("../models/users")
const { createToken } = require("../utils/token")

/**
 * @description 与 users 相关的控制器
 * @author Uni
 * @since 1.0
 */
// const checkCaptcha = (email, captcha) => {
//     return new Promise((resolve, reject) => {
//         const res = Tip.find({ email, captcha })
//         if (!res) {
//             reject(new ErrorModel(Errorno.check_captcha.msg, Errorno.check_captcha.code))
//         } 
//         reject()
//     })
// }
class UsersCtl {
    async create(ctx, next) {
        ctx.verifyParams({
            username: {
                type: 'string',
                require: true
            },
            password: {
                type: 'string',
                require: true
            },
            email: {
                type: 'string',
                require: true
            },
            captcha: {
                type: 'string',
                require: true
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
            const token = createToken(user._id, username)
            ctx.body = new SuccessModel({ token }, Successno.register_success)
            
        } catch (err) {
            ctx.throw(500, "未知错误")
        }
    }

    async delete(ctx, next) {
        const { email } = ctx.query
        const user = await User.findOneAndRemove({ email })
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.status = 204
    }


    handleError(ctx, next) {
        const id = ctx.params.id
        if (id > 10) ctx.throw(412, "条件错误：输入的 id 应该小于等于 10")

        ctx.body = `输入大于 10 的 id 试试康, 当前 id 为: ${id}`
    }

    handleParameter(ctx, next) {
        ctx.verifyParams({
            username: {
                type: 'string',
                require: true
            },
            password: {
                type: 'string',
                require: true
            }
        })

        ctx.body =  ctx.request.body
    }
}

module.exports = new UsersCtl()