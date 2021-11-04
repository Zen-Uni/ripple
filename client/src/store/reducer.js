/**
 * @description reducer
 */

import fetchEmit from "../socket";
import { TYPE } from "./action";

const defaultState = {
    username: "",
    email: "",
    avatar: "",
    req: false,
    friendList: [],
    conversation: false,
    // 存储当前聊天对象的 email
    currentChat: "",
    message: [],
    chatAvatar: ""
}

const serialize = state => {
    return JSON.parse(JSON.stringify(state));
}

const reducer = (state = defaultState, action) => {

    if (action.type === TYPE.userInfo) {
        const newState = serialize(state);
        newState.email = action.data.email; 
        newState.username = action.data.username;
        newState.avatar = action.data.avatar;
        fetchEmit("storeid", newState.email);
        return newState;
    }

    if (action.type === TYPE.updateAvatar) {
        const newState = serialize(state);
        newState.avatar = action.data;

        return newState;
    }

    if (action.type === TYPE.updateReq) {
        const newState = serialize(state);
        
        newState.req = action.data;

        if (newState.req) {
            console.log("kkkkkkkkkko")
        }
        return newState;
    }

    // update friend list
    if (action.type === TYPE.updateFriendList) {
        const newState = serialize(state);
        newState.friendList = action.data;

        return newState;
    }

    // update chat object
    if (action.type === TYPE.updateCurrentChat) {
        const newState = serialize(state);
        newState.currentChat = action.data;

        return newState;
    }

    if (action.type === TYPE.getMessageHistory) {
        const newState = serialize(state);
        newState.message = action.data;

        return newState;
    }

    if (action.type === TYPE.updateChatAvatar) {
        const newState = serialize(state);
        newState.chatAvatar = action.data;

        return newState
    }

    if (action.type === TYPE.updateMessage) {
        const newState = serialize(state);
        newState.message.push(action.data);

        return newState;
    }

    return state;
}


export default reducer;