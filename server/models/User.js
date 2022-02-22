/**
 * @description User模型
 * @author yun
 */
const { Schema, Mongoose } = require("../database/mongo");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  createAt: {
    type: Date,
    required: true,
  },
});
const User = Mongoose.model("User", userSchema);

module.exports = User;
