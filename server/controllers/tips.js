/**
 * @description 消息验证相关的控制器
 * @author Uni
 * @since
 */
const Tip = require("../models/tips")
const { createCaptcha, createOptions, sendMail } = require("../utils/mailer")



class TipCtl {

    async getCaptcha(ctx, next) {
        const { email } = ctx.query
        const res = await Tip.find({ email })
        const captcha = createCaptcha()
        let tip = null

        if (!res.length) {
            tip = await new Tip({
                email,
                captcha
            })

            tip.save()
        }  else {
            await Tip.findOneAndUpdate({ email }, { captcha })
        }
        try {
            const options  = createOptions(email, captcha)
            ctx.body = await sendMail(options)
        } catch(err) {
            ctx.throw(412, err)
        }
    }

}

module.exports = new TipCtl()