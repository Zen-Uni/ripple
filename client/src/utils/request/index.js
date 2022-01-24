/**
 * @description 前端接口api, 封装axios, 支持链式调用
 * @author Hans
 * @since 1.0
 */

import axios from 'axios'

export class RequestApi {
    constructor(oldInstance) {
        if (arguments.length === 0) {
            this.wrapped = axios.create()
            this.url = null
            return
        }
        if (oldInstance instanceof RequestApi) {
            this.wrapped = axios.create()
            this.url = oldInstance.url
            return
        }
    }
    withAuth() {
        // TODO 设置拦截器
        const newInstance = new RequestApi(this)
        this.wrapped.interceptors.response.use(
            (res) => res,
            (e) => {
                const { status } = e.response.status
                switch (status) {
                    case 401:
                        return new Promise.reject(401)
                    case 403:
                        return new Promise.reject(403)
                    default:
                        return new Promise.reject('default')
                }
            },
        )
        return newInstance
    }
    setUrl(url) {
        const newInstance = new RequestApi(this)
        newInstance.url = url
        return newInstance
    }
    async get(params) {
        const res = await this.wrapped.get(this.url, {
            params,
        })
        return res.data
    }
    async post(data) {
        const res = await this.wrapped.post(this.url, {
            data,
        })
        return res.data
    }
}
