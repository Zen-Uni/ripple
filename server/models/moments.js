/**
 * @description 动态的Schema设计
 * @author Uni
 * @since 1.0
 */

const { Schema, model } = require('./db')
const User = require('./users')

const MomentSchema = new Schema({
    __v: {
        select: false
    },
    img_url: {
        type: [
            {
                type: String
            }
        ],
        required: false
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
        select: false
    },
    text: String,
    likers: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: User
            }
        ],
        select: false
    }
}, { timestamps: true })

const Moment = model('Moment', MomentSchema)

module.exports = Moment