/**
 * @description 请求验证中间件
 * @auth Uni
 * @since 1.0
 */






const auth = {
    isAuthenticated: false,    // default value: false
    
    signin(callback) {
        auth.isAuthenticated = true
        callback()
    },

    signout(callback) {
        auth.isAuthenticated = false
        callback()
    }
}


export {
    auth
}