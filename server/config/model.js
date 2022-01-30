/**
 * @description 一些配置信息和信息模型
 * @author Uni
 * @since 1.0
 */

class BasicModel {
    constructor(data, msg) {
        if (typeof data === 'string') {
            this.msg = data
            data = null
            msg = null
        }

        if (data) {
            this.data = data
        }

        if (msg) {
            this.msg = msg
        }
    }
}

class SuccessModel extends BasicModel {
    constructor(data, msg) {
        super(data, msg)
        this.code = 1
    }
}

class ErrorModel extends BasicModel {
    constructor(data, msg) {
        super(data, msg)
        this.code = 0
    }
}


const Errorno = {
    send_email: {
        code: 10001,
        msg: "邮箱发送失败，请校验邮箱正确性"
    },
    check_captcha: {
        code: 10002,
        msg: "验证码错误"
    },
    check_user_exist: {
        code: 10003,
        msg: "邮箱已被占用"
    }

}

const Successno = {
    send_email: "验证码发送成功",
    register_success: "注册成功"
}

module.exports = {
    SuccessModel,
    ErrorModel,
    Errorno,
    Successno
}