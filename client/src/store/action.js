/**
 * @description action
 */

import { reqFriendList } from "../fetch"


export const TYPE = {
    userInfo: "userInfo",
    updateAvatar: "updateAvatar",
    updateReq: "updateReq",
    updateFriendList: "updateFriendList"
}

// 更新全局用户信息
export const userInfoAction =  data => {
    return {
        type: TYPE.userInfo,
        data
    }
}

// 更新用户头像
export const updateAvatarAction = data => {
    return {
        type: TYPE.updateAvatar,
        data
    }
}

// 更新消息提示 （好友请求）
export const updateReqAction = () => {
    return {
        type: TYPE.updateReq,
        data: true
    }
}

// 更新好友列表 (在此请求)
export const updateFriendListAction = () => {
    return new Promise(async(resolve, reject) => {
        const { data } = await reqFriendList()
        const { list } = data;

        const action = {
            type: TYPE.updateFriendList,
            data: list
        };

        resolve(action);
    })

}