/**
 * @description 消息相关 Schema 设计
 * @author Uni
 * @since 1.0
 */

const { Schema, model } = require('./db')
// const User = require('./users')

const TipSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    type_id: {
        type: Number,      // TODO:  0: 邮箱验证码, 
        select: false
    },
    status: {
        type: Number,     // TODO: 0: 未处理的新消息, 1: 接受, 2: 拒绝 
        default: 0,
        select: false
    },
    email: {
        type: String,
        select: false
    },
    captcha: {
        type: String,
        select: false
    }
}, { timestamps: true })

const Tip = model('Tip', TipSchema)

module.exports = Tip