/**
 * @description handle network request and response
 */
import axios from 'axios';
import { getItem } from './localStorage';


const root = "http://localhost:8080/api";

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
    console.log(token);
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