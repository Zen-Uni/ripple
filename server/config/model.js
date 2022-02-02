/**
 * @description 一些配置信息和信息模型
 * @author Uni
 * @since 1.0
 */

const TIP_CODE = {
    captcha: 0,
    user: 1,
    group: 2
}

const STATUS_CODE = {
    agree: 1,
    disagree: 2
}

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
    },
    check_login: {
        code: 10004,
        msg: "用户名或密码错误"
    },
    search_user: {
        code: 10005,
        msg: "没有该用户"
    },
    post_moment_fail: {
        code: 10006,
        msg: "不能发布空动态"
    }
}

const Successno = {
    send_email: "验证码发送成功",
    register_success: "注册成功",
    login_success: "登录成功",
    create_img_url: "图像地址分发成功",
    user_modify_success: "个人信息修改成功",
    user_request_success: "好友请求发送成功",
    user_response_agree: "好友添加成功",
    user_response_disagress: "已拒绝",
    post_moment_success: "动态发布成功",
    list_moment_success: "获取动态列表成功",
    like_moment_success: "点赞成功",
    dislike_moment_success: "取消点赞成功"
}

module.exports = {
    SuccessModel,
    ErrorModel,
    Errorno,
    Successno,
    TIP_CODE,
    STATUS_CODE
}