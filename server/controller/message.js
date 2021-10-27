/**
 * @description some functions about socket
 */

const { SocketModel } = require("../db")
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

module.exports = {
    handleStoreSocket
}
