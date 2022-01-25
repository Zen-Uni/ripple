/**
 * @description 前端接口api, 封装axios, 支持链式调用
 * @author Hans
 * @since 1.0
 */

import axios from 'axios'

export class RequestApi {
    constructor() {
        this.wrapped = axios.create()
        this.url = null
    }
    withAuth() {
        // TODO 设置拦截器
        this.wrapped.interceptors.response.use(
            (res) => res,
            (e) => {
                const { status } = e.response
                switch (status) {
                    case 401:
                        return Promise.reject(401)
                    case 403:
                        return Promise.reject(403)
                    default:
                        return Promise.reject(e)
                }
            },
        )
        return this
    }
    setUrl(url) {
        this.url = url
        return this
    }
    async get(params) {
        const res = await this.wrapped.get(this.url, {
            params,
        })
        return res.data
    }
    async post(data) {
        const res = await this.wrapped.post(this.url, data)
        return res.data
    }
}
