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
    password: String,
    avatar: {
        type: String,
        default: ''
    }
})




/************************ define mongoose Schema  ---  end **************/
const UserModel = model("Users", userSchema)



module.exports = {
    UserModel
}


