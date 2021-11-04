/**
 * @description mongoose models
 */


const { Schema, model } = require('./connect')


/************************ define mongoose Schema  ---  begin **************/

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


const socketSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    sid: String
})

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

// TODO: friend schema
const friendSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    femail: Array
});


/************************ define mongoose Schema  ---  end **************/
const UserModel = model("Users", userSchema)
const SocketModel = model("Sockets", socketSchema);
const TipModel = model("Tips", tipSchema);
const FriendModel = model("Friends", friendSchema);


module.exports = {
    UserModel,
    SocketModel,
    TipModel,
    FriendModel
}


