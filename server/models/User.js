/**
 * @description User Schema
 * @author Airbo
 * @since 1.0
 */

var { mongoose, db, Schema } = require("./index");

var userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    unique: true
  },
  createDate: Date,
  avatarUrl: String,
});

module.exports = mongoose.model("User", userSchema);
