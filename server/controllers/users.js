const { User, Captcha } = require('../database/models')
const crypto = require('crypto')
const validator = require('validator')
const { CODES_CAPTCHAS, CODES_USERS } = require('../const/codes')
const { sign } = require('../utils/jwt')
const {
    Types: { ObjectId },
} = require('../database')
const { gainIo } = require('../socket.io')

const md5 = (data) => crypto.createHash('md5').update(data).digest('hex')
class UsersCtl {
    handleError(ctx, next) {
        const id = ctx.params.id
        if (id > 10) ctx.throw(412, '条件错误：输入的 id 应该小于等于 10')

        ctx.body = `输入大于 10 的 id 试试康, 当前 id 为: ${id}`
    }

    handleParameter(ctx, next) {
        // TODO 补充校验参数
        ctx.verifyParams({
            username: {
                type: 'string',
                require: true,
            },
            password: {
                type: 'string',
                require: true,
            },
        })

        ctx.body = ctx.request.body
    }

    async handlePostUserRegister(ctx, next) {
        const {
            request: {
                body: { email, userName, password, captcha },
            },
        } = ctx
        const lastRelatedCaptcha = (
            await Captcha.find({
                email,
                description: 'for user register',
            })
                .sort('-_id')
                .limit(1)
                .exec()
                .catch(() => [undefined])
        )[0]
        if (lastRelatedCaptcha === undefined) {
            ctx.status = 412
            ctx.body = {
                code: CODES_CAPTCHAS.ERROR_CAPTCHA_EXPIRE_OR_NOT_EXIST_BEFORE,
                msg: '验证码过期, 或从未被创建过',
            }
            return
        }
        if (lastRelatedCaptcha.value !== captcha) {
            ctx.status = 412
            ctx.body = {
                code: CODES_CAPTCHAS.ERROR_CAPTCHA_WRONG,
                msg: '验证码错误',
            }
            return
        }
        const [e] = await new User({
            email,
            userName,
            password: md5(password),
            createDate: new Date(),
        })
            .save()
            .then((v) => [null, v])
            .catch((e) => [e, null])
        if (e) {
            if (encodeURIComponent.code === 11000) {
                ctx.status = 412
                ctx.body = {
                    code: CODES_USERS.ERROR_EMAIL_EXIST,
                    msg: `${email} 已被注册`,
                }
                return
            } else {
                e.res = {
                    status: 500,
                    body: {
                        code: CODES_USERS.ERROR_DATABASE,
                        msg: `${email} 注册失败`,
                    },
                }
                throw e
            }
        }
        ctx.body = {
            code: CODES_CAPTCHAS.SUCCESS,
            msg: `${email} 注册成功`,
        }
    }

    async handlePostUserLogin(ctx, next) {
        const {
            request: {
                body: { email, password },
            },
        } = ctx
        const user = await User.findOne({
            email,
        })
            .exec()
            .catch(() => null)
        if (user === null) {
            ctx.status = 412
            ctx.body = {
                code: CODES_USERS.ERROR_USER_NOT_EXIST,
                msg: '该用户不存在',
            }
            return
        }
        if (user.password !== md5(password)) {
            ctx.status = 412
            ctx.body = {
                code: CODES_USERS.ERROR_PASSWORD_WRONG,
                msg: '密码错误',
            }
            return
        }
        ctx.body = {
            code: CODES_USERS.SUCCESS,
            msg: '登录成功',
            data: {
                jwt: await sign(user._id),
            },
        }
    }

    async handlePutUserName(ctx, next) {
        const {
            sub,
            request: {
                body: { userName },
            },
        } = ctx
        await User.findByIdAndUpdate(sub, {
            userName,
        })
            .exec()
            .catch((e) => {
                e.res = {
                    status: 500,
                    body: {
                        code: CODES_USERS.ERROR_DATABASE,
                        msg: '用户名更改失败',
                    },
                }
                throw e
            })
        ctx.body = {
            code: CODES_USERS.SUCCESS,
            msg: `用户名已更改为${userName}`,
        }
    }

    async handlePutPassword(ctx, next) {
        const {
            sub,
            request: {
                body: { oldPassword, newPassword },
            },
        } = ctx
        const user = await User.findById(sub)
            .exec()
            .catch(() => null)
        if (user === null || user.password !== md5(oldPassword)) {
            ctx.status = 412
            ctx.body = {
                code: CODES_USERS.ERROR_PASSWORD_WRONG,
                msg: '旧密码错误',
            }
            return
        }
        await User.findByIdAndUpdate(sub, {
            password: md5(newPassword),
        })
            .exec()
            .catch((e) => {
                e.res = {
                    status: 500,
                    body: {
                        code: CODES_USERS.ERROR_DATABASE,
                        msg: '密码更改失败',
                    },
                }
                throw e
            })
        ctx.body = {
            code: CODES_USERS.SUCCESS,
            msg: '密码已更改',
        }
    }

    async handlePutMemo(ctx, next) {
        const {
            sub,
            request: {
                body: { memo },
            },
        } = ctx
        await User.findByIdAndUpdate(sub, {
            memo,
        })
            .exec()
            .catch((e) => {
                e.res = {
                    status: 500,
                    body: {
                        code: CODES_USERS.ERROR_DATABASE,
                        msg: '个人签名更改失败',
                    },
                }
                throw e
            })
        ctx.body = {
            code: CODES_USERS.SUCCESS,
            msg: '个人签名更改成功',
        }
    }
}

module.exports = new UsersCtl()
