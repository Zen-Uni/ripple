/**
 * @description about user search friends, add friends and so on
 */

const { UserModel, TipModel, SocketModel } = require("../db");

// const EventEmitter = require('events').EventEmitter;
// const emitter = new EventEmitter();

const { parseToken } = require("../utils/jwt");
const { ErrorModel, SuccessfulModel } = require("../utils/ResultModel");


// search user by email
const handleSearchUser = (email) => {
    return new Promise(async (resolve, reject) => {
        const res = await UserModel.findOne({
            email
        }).exec();

        if (res == null) {
            resolve(new ErrorModel("该用户不存在"));
        } else {
            resolve(new SuccessfulModel(res, "查询成功"))
        }
    })
}

// 好友请求发送
const handleFriendReq = (to, token) => {
    const { data } = parseToken(token);
    const { email } = data;
    return new Promise(async(resolve, reject) => {
        const findRes = await TipModel.findOne({
            fromEmail: email,
            toEmail: to,
            status: 2
        }).exec();
        console.log(findRes);
        if (findRes == null) {
            const tip = new TipModel({
                fromEmail: email,
                toEmail: to
            });
           try {
                await tip.save();
                console.log(to);
                const {sid} = await SocketModel.findOne({
                    email: to
                }).exec();

                console.log(sid);
                resolve(new SuccessfulModel({sid}, "好友请求已发送"));
           } catch (err){
                console.log(err);
                resolve(new ErrorModel("好友请求发送失败"));
           }
        } else {
            resolve(new ErrorModel("对方已是好友"));
        }
    })
}

// 获取好友请求列表
const handleReqList = token => {
    const { data } = parseToken(token);
    const { email } = data;

    return new Promise(async(resolve, reject) => {
        const res = await TipModel.find({
            toEmail: email,
            status: 0
        }).distinct("fromEmail").exec();

        const ans = [];
        for (const item of res) {
            const { avatar, username, email } = await UserModel.findOne({
                email: item
            }).exec();

            const obj = {
                avatar,
                username,
                email
            };

            ans.push(obj);
        }

        
        resolve(new SuccessfulModel({
            list: ans
        }, "获取好友请求列表成功"));
    })
}

module.exports = {
    handleSearchUser,
    handleFriendReq,
    handleReqList
}