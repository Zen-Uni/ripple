/**
 * @description some functions about socket
 */

const { SocketModel, MessageModel } = require("../db")
const { SuccessfulModel } = require("../utils/ResultModel")

const handleStoreSocket = (email, sid) => {
    return new Promise(async(resolve, reject) => {
        const res = await SocketModel.findOne({email}).exec();
        if (res == null) {
            const Msg = new SocketModel({
                email,
                sid
            })
            await Msg.save();
            resolve(new SuccessfulModel("已存储 socket 信息"));
        } else {
            await SocketModel.updateOne({
                email
            }, {
                sid
            });
            resolve(new SuccessfulModel("已更新 socket 信息"))
        }
    })
}


const handleReqMessage = (email, femail) => {
    const arr = [];
    arr.push(email); arr.push(femail);
    arr.sort();
    const to = arr[0] + arr[1];
    console.log('to ----', to);
    return new Promise(async(resolve, reject) => {
      
        const res = await MessageModel.find({
            to
        }).exec();
        console.log(res);
        
        resolve(new SuccessfulModel({
            message: res
        }));
    })
}

module.exports = {
    handleStoreSocket,
    handleReqMessage
}
