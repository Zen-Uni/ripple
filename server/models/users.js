/**
 * @description 用户模型
 * @author Uni
 * @since 1.0
 */

const { Schema, model } = require('./db')


const userSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    email: { 
        type: String, 
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar_url: {
        type: String,
        select: false
    },
    headline: {
        type: String,
        select: false
    },
    friends: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        select: false
    },
    moments: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Moment'
            }
        ],
        select: false
    },
    groups: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Group'
            }
        ],
        select: false
    },
    socket_id: String
}, { timestamps: true })

const User = model('User', userSchema)

module.exports = User