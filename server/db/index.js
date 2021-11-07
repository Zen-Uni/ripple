/**
 * @description mongoose models
 */


const { Schema, model } = require('./connect')


/************************ define mongoose Schema  ---  begin **************/

// user table
const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    username: String,
    password: {
        type: String,
        select: false
    },
    avatar: {
        type: String,
        default: '/0.jpg'
    }
});

// socket message table, use to store user's websocket id
const socketSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    sid: String
})
// tip table, use to store user's friend request
const tipSchema = new Schema({
    fromEmail: {
        type: String
    },
    toEmail: {
        type: String
    },
    status: {
        type: Number,
        default: 0
    }
})
// friend table, use to store user's relationship
const friendSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    femail: Array
});

// message schema, use to store uses' history message by communication
const messageSchema = new Schema({
    from: String,
    to: String,
    createTime: {
        type: Date,
        default: Date.now,
        index: true
    },
    content: String
})


/************************ define mongoose Schema  ---  end **************/
const UserModel = model("Users", userSchema)
const SocketModel = model("Sockets", socketSchema);
const TipModel = model("Tips", tipSchema);
const FriendModel = model("Friends", friendSchema);
const MessageModel = model("messages", messageSchema);

module.exports = {
    UserModel,
    SocketModel,
    TipModel,
    FriendModel,
    MessageModel
}


