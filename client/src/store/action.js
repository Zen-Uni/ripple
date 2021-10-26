/**
 * @description action
 */


export const TYPE = {
    userInfo: "userInfo",
    updateAvatar: "updateAvatar"
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