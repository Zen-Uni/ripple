/**
 * @description Sign router's controller
 */

const { UserModel } = require("../db/index");
const { dispatchToken, parseToken } = require("../utils/jwt");
const { ErrorModel, SuccessfulModel } = require("../utils/ResultModel");
 
// email check
const emailCheck = (email) => {
    return new Promise(async (resolve, reject) => {
        const res = await UserModel.findOne({email}).exec();
        if (res === null) {
            resolve(new SuccessfulModel("邮箱可用"));
        } else {
            resolve(new ErrorModel("邮箱不可用"));
        }
    })
}


// user register
const userRegister =  (userMsg) => {
    const User = new UserModel(userMsg);
    return new Promise(async (resolve, reject) => {
       try {
        await User.save();
        const { email } = userMsg;
        const token = await dispatchToken(email);
        const res = new SuccessfulModel({token}, "用户注册成功");

        resolve(res);
       } catch (err) {
           console.log(err);
           console.log("该用户已存在");
           resolve(new ErrorModel("该用户已存在"));
       }
    })   
}


// user login
const userLogin = (userMsg) => {
    return new Promise(async (resolve, reject) => {
        const res = await UserModel.findOne(userMsg).exec();
        if (res == null) {
            resolve(new ErrorModel("尚未注册"));
        } else {
            const { email } = userMsg;
            const token = await dispatchToken(email);
            resolve(new SuccessfulModel({token}, "登陆成功"))
        }

    })
}


// token check
const tokenCheck = (token) => {
    return new Promise(async(resolve, reject) => {
        const res = parseToken(token);
        if (res.code) {
            resolve(res);
        } 
        else {
            try {
                const {  data } = res;
                resolve(data);
            } catch {
                resolve(new ErrorModel("解析 token 失败"))
            }
        }
       
    })
}

module.exports = {
    emailCheck,
    userRegister,
    userLogin,
    tokenCheck
}