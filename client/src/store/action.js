/**
 * @description action
 */

import { reqFriendList } from "../fetch"


export const TYPE = {
    userInfo: "userInfo",
    updateAvatar: "updateAvatar",
    updateReq: "updateReq",
    updateFriendList: "updateFriendList",
    updateCurrentChat: "updateCurrentChat",
    getMessageHistory: "getMessageHistory",
    updateChatAvatar: "updateChatAvatar",
    updateMessage: "updateMessage",
    updateChatUsername: "updateChatUsername"
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

// 更新当前聊天对象
export const updateCurrentChatAction = (data) => {
    return {
        type: TYPE.updateCurrentChat,
        data
    }
}

// 获取历史聊天记录
export const getMessageHistoryAction = (data) => {
    return {
        type: TYPE.getMessageHistory,
        data
    }
}

// 更新聊天聊天对象头像
export const updateChatAvatarAction = (data) => {
    return {
        type: TYPE.updateChatAvatar,
        data
    }
}

// 更新聊天记录
export const updateMessage = data => {
    return {
        type: TYPE.updateMessage,
        data
    }
}

// 更新聊天对象昵称
export const updateChatUsernameAction = data => {
    return {
        type: TYPE.updateChatUsername,
        data
    }
}