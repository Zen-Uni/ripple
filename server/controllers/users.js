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
    async authVerify(ctx) {
        const user = await User.findById(ctx.state.user.id).select('+avatar_url +headline')
        ctx.body = user
    }

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
        console.log('bingooooo')
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
            remark_msg: {
                type: 'string',
                required: false
            },
            request_id: {
                type: 'string',
                required: true
            }
        })
        ctx.request.body.user_id = ctx.state.user.id
        const { user_id, request_id } = ctx.request.body
        const conditional = {
            user_id,
            request_id,
            type_id: TIP_CODE.user
        }
        // TODO: 错误异常优化
        const exist = await Tip.findOne()
        if (!exist) {
            const relation = await new Tip({
                type_id: TIP_CODE.user,
                ...ctx.request.body
            }).save()
            ctx.body = new SuccessModel(relation, Successno.user_request_success)
        } else {
            const relation = await Tip.findOneAndUpdate(conditional, {
                ...ctx.request.body
            })
            ctx.body = new SuccessModel({
                ...relation,
                ...ctx.request.body
            }, Successno.user_request_success)
        }
        
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
            },
            status: {
                type: 'number',
                required: true
            }
        })

        ctx.request.body.request_id = ctx.state.user.id
        const { request_id, user_id, type_id, status } = ctx.request.body
        // TODO: 复杂逻辑优化
        await Tip.findOneAndUpdate({
            request_id, 
            user_id,
            type_id
        }, {
            status
        })

        if (status === 1) {
            const me = await User.findById(ctx.state.user.id).select('+friends')
            if (!me.friends.map(id => id.toString()).includes(user_id)) {
                me.friends.push(user_id)
                me.save()
            }
            const user = await User.findById(user_id).select('+friends')
            if (!user.friends.map(id => id.toString()).includes(ctx.state.user.id)) {
                user.friends.push(ctx.state.user.id)
                user.save()
            }
            ctx.body = new SuccessModel({
                user_id
            }, Successno.user_response_agree)
            return
        }
        ctx.body = new SuccessModel({
            user_id
        }, Successno.user_response_disagress)
    }

    handleError(ctx, next) {
        const id = ctx.params.id
        if (id > 10) ctx.throw(412, "条件错误：输入的 id 应该小于等于 10")

        ctx.body = `输入大于 10 的 id 试试康, 当前 id 为: ${id}`
    }

    // 辅助接口对应的控制器
    async retrieve(ctx, next) {
        // mongoose 返回值测试
        const user = await User.findOne({email: '13670210824@163.com'})
        console.log('user------', user.__proto__)
        console.log('keys     --------- ',Object.keys(user))
        console.log(Object.getOwnPropertyDescriptors(user))
        console.log('stringify ----- ',JSON.stringify( user))
        console.log('shallowClone ------- ', {...user})
        // console.log('User ------- ', User)
        // console.log(Object.getOwnPropertyDescriptors(user))
        // console.log(user)
        // for (const item of user) {
        //     console.log(item)
        // }
        // const test = JSON.parse(JSON.stringify(user))
        // console.log(Object.keys(test))
        // console.log(user.__proto__)
        ctx.body = await User.find().select("+friends +moments")
    }

    async delete(ctx, next) {
        const { email } = ctx.query
        console.log(email)
        const user = await User.findOneAndRemove({ email })
        // for (const item in user) {
        //     console.log(item)
        // }
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.status = 204
    }

}

module.exports = new UsersCtl()