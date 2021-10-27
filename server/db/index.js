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
    from: {
        type: String
    },
    to: {
        type: String
    },
    status: {
        type: Number,
        default: 0
    }
})




/************************ define mongoose Schema  ---  end **************/
const UserModel = model("Users", userSchema)
const SocketModel = model("Sockets", socketSchema);


module.exports = {
    UserModel,
    SocketModel
}


