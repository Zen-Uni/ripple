/**
 * @description 邮箱、验证码相关工具
 * @author Uni
 * @since 1.0
 */

const { mailTransport } = require("../config/config")
const { ErrorModel, Errorno, Successno, SuccessModel } = require("../config/model")

// 生成 6 位随机数字字符串验证码
const createCaptcha = () => Math.random().toString().slice(-6)

const createOptions = (email, captcha) => {
    const options = {
        from        : 'we_found_404@163.com',
        to          : email,
    
        subject        : '欢迎使用 Ripple',
        text          : '用户注册邮箱验证码',
        html           : `<p>你好，这是一封来自 Ripple 的验证码！你的验证码是：</p><h1>${captcha}</h1>`, 
    }

    return options
}

const sendMail = (options) => {
    return new Promise((resolve, reject) => {
        mailTransport.sendMail(options, err => {
            if (err) {
                console.log(err)
                reject(new ErrorModel(Errorno.send_email.code, Errorno.send_email.msg))
            } 
            console.log(Successno.send_email)
            resolve(new SuccessModel(Successno.send_email))
        })
    })
}

module.exports = {
    createCaptcha,
    sendMail,
    createOptions
}