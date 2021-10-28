/**
 * @description reducer
 */

import fetchEmit from "../socket";
import { TYPE } from "./action";

const defaultState = {
    username: "",
    email: "",
    avatar: "",
    req: false
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

    return state;
}


export default reducer;