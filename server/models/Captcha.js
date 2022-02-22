/**
 * @description Captcha模型
 * @author yun
 */
const { Schema, Mongoose } = require("../database/mongo");
const validator = require("validator");

const captchaSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique:true,
    validate:{
      validator:function(v){
        return validator.isEmail(v)
      },
      message:'{VALUE} is not a valid email' 
    }
  },
  captcha: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required:true,
    index: {
      expires: 300,
    },
  },
  // updateAt:{
  //   type:Date,
  //   required:true
  // }
});
const Captcha = Mongoose.model('Captcha',captchaSchema)

module.exports = Captcha
