/**
 * @description 前端对 token 的处理
 * @author Uni
*/


import axios from 'axios'


const site = "RIPPLE_UNI"

export const storeToken = token => {
    window.localStorage.setItem(site, token)
}

export const getToken = () => {
    return window.localStorage.getItem(site)
}

export const configReq = () => {
    const token = getToken()
    console.log(token)
    if (token) {
        axios.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${token}`
            return config
        })
        
    } 
}

export const removeToken = () => {
    return window.localStorage.removeItem(site)
}