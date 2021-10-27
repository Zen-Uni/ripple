/**
 * @description reducer
 */

import fetchEmit from "../socket";
import { TYPE } from "./action";

const defaultState = {
    username: "",
    email: "",
    avatar: ""
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

    return state;
}


export default reducer;