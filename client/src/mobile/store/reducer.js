/**
 * @description reducer
 * @author Uni
 * @since 1.0
 */

import { TYPE } from "./action"

// 获取默认随机头像
const getDefaultAvatar = () => {
    const n = Math.floor(Math.random() * 3) + 1
    return `${process.env.PUBLIC_URL}/avatar/avatar${n}.jpeg`
}

// 序列化
const serialize = state => {
    return JSON.parse(JSON.stringify(state))
}

const defaultState = {
    id: '',
    username: '',
    email: '',
    avatar_url: getDefaultAvatar(),
    headline: ''
}

const reducer = (state = defaultState, action) => {

    switch (action.type) {
        case TYPE.authVerify: {
            const { id, username, email, avatar_url, headline } = action.data
            const newState = serialize(state)
            return {
                ...newState,
                id, 
                username,
                email,
                avatar_url,
                headline
            }
        }
        default:
            return state
    }
}

export default reducer