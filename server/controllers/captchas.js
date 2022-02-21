const { Captcha } = require('../database/models')
const validator = require('validator')
const { CODES_CAPTCHAS } = require('../const/codes')
const { sendMail } = require('../utils/mail')

const gainRandomStr = (len) =>
    new Array(len)
        .fill(null)
        .map(() => Math.random().toString(36).slice(-1))
        .join('')

class CaptchaCtl {
    async handlePostCaptcha(ctx, next) {
        const {
            request: {
                body: { email },
            },
        } = ctx
        if (!validator.isEmail(email)) {
            ctx.status = 412
            ctx.body = {
                code: CODES_CAPTCHAS.ERROR_EMAIL_FORMAT_WRONG,
                msg: '邮箱格式错误',
            }
            return
        }
        const captcha = new Captcha({
            value: gainRandomStr(6),
            description: 'for user register',
            email,
            createdAt: new Date(),
        })
        await captcha.save().catch((e) => {
            e.res = {
                status: 500,
                body: {
                    code: CODES_CAPTCHAS.ERROR_CAPTCHA_NOT_SAVE,
                    msg: '验证码生成失败',
                },
            }
            throw e
        })
        await sendMail(email, 'Ripple Register Captcha | Ripple注册验证码', {
            text: `You are registering for a Ripple account | 您正在注册Ripple账户...\nCaptcha | 注册码: ${captcha.value}`,
        }).catch((e) => {
            e.res = {
                status: 500,
                body: {
                    code: CODES_CAPTCHAS.ERROR_OTHER,
                    msg: '验证码发送失败',
                },
            }
            throw e
        }) // TODO 验证码邮件HTML样式
        ctx.body = {
            code: CODES_CAPTCHAS.SUCCESS,
            msg: '验证码发送成功, 有效时间为10分钟',
        }
    }
}

module.exports = new CaptchaCtl()
