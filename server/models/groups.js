/**
 * @description 群聊 Schema 设计
 * @author Uni
 * @since 1.0
 */

const { Schema, model } = require('./db')
const User = require('./users')

const GroupSchema = new Schema({
    __v: {
        select: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    headline: {
        type: String,
        select: false
    },
    name: {
        type: String,
        required: true
    }
})

const Group = module('Group', GroupSchema)

module.exports = Group