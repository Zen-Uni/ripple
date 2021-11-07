/**
 * @description handle network request and response
 */
import axios from 'axios';
import { getItem } from './localStorage';

const ROOT = "http://localhost:8080";

export const root = ROOT + "/api";
export const avatarRoot = ROOT + "/avatar"
const fetch = (method, path, data) => {
    return new Promise((resolve, reject) => {
        axios[method](root + path, data)
        .then(res => {
            resolve(res.data);
        })
    })
}

// axios prefix
export const configureReq = () => {
    const token = getItem("token");
    // console.log(token);
    if (token) {
        axios.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${token}`
            return config
        })
    }
}

// email check
export const reqEmailCheck = async data => {
    return await fetch("post", "/user/email-check", data);
}

// register
export const reqRegister = async data => {
    return await fetch("post", "/user/register", data);
}

// login
export const reqLogin = async data => {
    return await fetch("post", "/user/login", data);
}

// token check
export const reqTokenCheck = async () => {
    return await fetch("get", '/user/token-check');
}

// upload avatar
export const uploadAvatar = async (data) => {
    return await fetch("post", '/upload/avatar', data);
}

export const findUser = async (data) => {
    return await fetch("post", "/user/find", data);
}

export const reqAddUser = async (data) => {
    return await fetch("post", "/friend/request", data);
}


// 获取好友请求列表
export const reqAddList = async () => {
    return await fetch("get", "/friend/req-list");
}


export const reqMakeFriend = async data => {
    return await fetch('post', "/friend/make-friends", data);
}

export const reqFriendList = async () => {
    return await fetch('get', '/friend/friend-list');
}

export const reqMessageHistory = async (data) => {
    return await fetch('post', '/friend/get-message', data);
}