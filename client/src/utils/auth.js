/**
 * @description 请求验证中间件
 * @auth Uni
 * @since 1.0
 */

const auth = {
    isAuthenticated: false,    // default value: false
    
    signin(callback) {
        auth.isAuthenticated = true
        // simulate: 模拟接口请求，异步
        setTimeout(callback, 100)
    },

    signout(callback) {
        auth.isAuthenticated = false

        // simulate: 模拟接口请求，异步
        setTimeout(callback, 100)
    },

    getAuth() {
        return this.isAuthenticated
    }
}


export {
    auth
}