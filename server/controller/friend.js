/**
 * @description about user search friends, add friends and so on
 */

const { UserModel } = require("../db");
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


module.exports = {
    handleSearchUser,

}