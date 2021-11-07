/**
 * @description about user search friends, add friends and so on
 */

const { UserModel, TipModel, SocketModel, FriendModel } = require("../db");

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
            resolve(new ErrorModel("The user does not exist"));
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
                resolve(new SuccessfulModel({sid}, "A friend request has been sent"));
           } catch (err){
                console.log(err);
                resolve(new ErrorModel("Failed to send a friend request"));
           }
        } else {
            resolve(new ErrorModel("The other is already a good friend"));
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


const handleMakeFriend = (token, femail) => {
    const { data } = parseToken(token);
    const { email } = data;
    return new Promise(async(resolve, reject) => {
        const res = await FriendModel.findOne({
            email
        }).exec();

        if( res === null ) {
            const relation = new FriendModel({
                email,
                femail
            });
            await relation.save();
        } else {
            const femailList = res.femail;
            femailList.push(femail);
            await FriendModel.updateOne({
                email
            }, {
                femail: femailList
            });
        }

        const res2 = await FriendModel.findOne({
            email: femail
        }).exec();

        if (res2 === null) {
            const relation = new FriendModel({
                email: femail,
                femail: email
            });
            await relation.save();
        } else {
            const femailList = res2.femail;
            femailList.push(email);
            await FriendModel.updateOne({
                email: femail
            }, {
                femail: femailList
            });
        }

       try {
            await TipModel.updateMany({
                fromEmail: femail,
                toEmail: email
            }, {
                status: 2
            });
            const tip = new TipModel({
                fromEmail: email,
                toEmail: femail,
                status: 2
            });
            await tip.save();
            resolve(new SuccessfulModel("Friend Added successfully"));
       } catch (err) {
           console.log(err);
           resolve(new ErrorModel("Failed to add friends"));
       }

    })
}


// 获取好友列表
const handleFriendList = (token) => {
    const { data } = parseToken(token);
    const { email } = data;

    return new Promise(async(resolve, reject) => {
        const res = await FriendModel.findOne({email}).exec();
        if (res === null) {
            resolve(new SuccessfulModel({
                list: []
            }))
        } else {
            const { femail } = res;
            const list = [];
            for (const item of femail) {
                const { username, avatar } = await UserModel.findOne({
                    email: item       
                }).exec();
                const obj = {
                    email: item,
                    username,
                    avatar
                }
                list.push(obj);
            }
            resolve(new SuccessfulModel({
                list
            }));
        }
       
    })
}

module.exports = {
    handleSearchUser,
    handleFriendReq,
    handleReqList,
    handleMakeFriend,
    handleFriendList
}