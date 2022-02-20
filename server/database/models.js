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
    owner: { type: ObjectId, ref: 'User' },
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
        enum: [0, 1, 2, 11, 12], // 0object未处理 1object已同意 2object已拒绝 11subject被同意 12subject被拒绝
    },
    tip: String,
    memo: String,
})
friendSchema.index({ subject: 1, object: 1 }, { unique: true })

const memberSchema = new Schema({
    member: { type: ObjectId, ref: 'User' },
    group: { type: ObjectId, ref: 'Group' },
    time: {
        apply: Date,
        reply: Date,
    },
    status: {
        type: Number,
        enum: [0, 1, 2, 11], // 0未处理 1已同意 2已拒绝 11被邀请
    },
    tip: String,
    memo: String,
})
memberSchema.index({ member: 1, group: 1 }, { unique: true })

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

const captchaSchema = new Schema({
    value: String,
    description: String,
    email: String,
    createdAt: { type: Date, expires: 600 },
})

const postSchema = new Schema({
    subject: { type: ObjectId, ref: 'User' },
    time: Date,
    type: {
        type: String,
        enum: ['text', 'img', 'video', 'group'], // text纯文本 img图文(img:url) video视频(video:url) group(link:group_id)
    },
    content: String,
    likes: [ObjectId],
})

const postCommentSchema = new Schema({
    subject: { type: ObjectId, ref: 'User' },
    object: { type: ObjectId, ref: 'User' },
    target: { type: ObjectId, ref: 'Post' },
    time: Date,
    content: String,
})

const postReportSchema = new Schema({
    subject: { type: ObjectId, ref: 'User' },
    post: { type: ObjectId, ref: 'Post' },
    handler: { type: ObjectId, ref: 'User' },
    status: { type: Number, enum: [0, 1, 10, 11, 12] }, // 0正常 1被举报隐藏 10被举报受理不通过 11被举报受理通过 12被举报未受理
    content: String,
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
    Captcha: model('Captcha', captchaSchema, 'captchas'),
    Post: model('Post', postSchema, 'posts'),
    PostComment: model('PostComment', postCommentSchema, 'post_comments'),
    PostReport: model('PostReport', postReportSchema, 'post_reports'),
}
