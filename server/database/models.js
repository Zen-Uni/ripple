const {
    Schema,
    Types: { ObjectId },
    model,
} = require('./')

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    userName: String,
    createDate: Date,
    avatarUrl: String,
})

const groupSchema = new Schema({
    creator: { type: ObjectId, ref: 'User' },
    admins: [{ type: ObjectId, ref: 'User' }],
    groupName: String,
    avatarUrl: String,
})

const friendSchema = new Schema({
    subject: { type: ObjectId, ref: 'User' },
    object: { type: ObjectId, ref: 'User' },
    time: {
        apply: Date,
        reply: Date,
    },
    status: {
        type: Number,
        enum: [0, 1, 2], // 0object未处理 1object已同意 2object已拒绝
    },
    tip: String,
    memo: String,
})

const memberSchema = new Schema({
    member: { type: ObjectId, ref: 'User' },
    group: { type: ObjectId, ref: 'Group' },
    time: {
        apply: Date,
        reply: Date,
    },
    status: {
        type: Number,
        enum: [0, 1, 2], // 0未处理 1已同意 2已拒绝
    },
    tip: String,
    memo: String,
})

const userMessageSchema = new Schema({
    sender: { type: ObjectId, ref: 'User' },
    receiver: { type: ObjectId, ref: 'User' },
    time: Date,
    content: String,
    status: { type: Number, enum: [0, 1, 10, 11] }, // 0未读 1已读 10未读已撤回 11已读已撤回
    type: {
        type: String,
        enum: ['text', 'img', 'video'],
    },
})

const groupMessageSchema = new Schema({
    sender: { type: ObjectId, ref: 'User' },
    group: { type: ObjectId, ref: 'Group' },
    time: Date,
    content: String,
    status: { type: Number, enum: [0, 1, 10, 11] }, // 0未读 1已读 10未读已撤回 11已读已撤回
    type: {
        type: String,
        enum: ['text', 'img', 'video'],
    },
})

const groupMessageRecordSchema = new Schema({
    receiver: { type: ObjectId, ref: 'User' },
    group: { type: ObjectId, ref: 'Group' },
    since: { type: ObjectId, ref: 'GroupMessage' },
})

module.exports = {
    User: model('User', userSchema, 'users'),
    Group: model('Group', groupSchema, 'groups'),
    Friend: model('Friend', friendSchema, 'friends'),
    Member: model('Member', memberSchema, 'members'),
    UserMessage: model('UserMessage', userMessageSchema, 'user_messages'),
    GroupMessage: model('GroupMessage', groupMessageSchema, 'group_messages'),
    GroupMessageRecord: model(
        'GroupMessageRecord',
        groupMessageRecordSchema,
        'group_message_records',
    ),
}
