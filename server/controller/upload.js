/**
 * @description upload file function
 */

const { ErrorModel, SuccessfulModel  } = require('../utils/ResultModel')
const path = require('path')
const fse = require('fs-extra')
const { UserModel } = require('../db')

// 图片最大体积 1M
const MAX_SIZE = 1024 * 1024 * 1024

// 设置目的目录
const DIR = path.join(__dirname, '..', 'upload/', 'avatar')

console.log(DIR);

const updateAvatar =  (email, url) => {
    return new Promise((resolve, reject) => {
       UserModel.findOneAndUpdate({email}, {
           avatar: url
       }, (err, data) => {
           if (err)  {
               console.log(err);
               resolve(new ErrorModel("Profile picture update failed"))
           } else {
               resolve(new SuccessfulModel({
                   avatar: url
               },"Profile picture updated successfully"))
           }
       })
    })
}

const uploadAvatar = async ({
    name,
    type,
    size,
    filePath,
    email
}) => {

    if (size > MAX_SIZE) {
        await fse.remove(filePath)
        return new ErrorModel("图片体积过大，超过 1M")
    }

    // 移动到服务器控制区域
    const fileName = Date.now() + '.' + name
    const distFilePath = path.join(DIR, fileName);
    await fse.move(filePath, distFilePath)

    // 返回路由
    const url = '/' + fileName

    return  await updateAvatar(email, url);
    // return res;
}


module.exports = {
    uploadAvatar
}