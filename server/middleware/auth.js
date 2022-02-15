/**
 * @description 鉴权相关的中间件
 * @author Uni
 * @since 1.0
 */
const jwt = require('koa-jwt')
const { SECRET } = require('../config/config')

// 校验 token
const auth = jwt({ secret: SECRET })


// 校验用户权限
const checkOwner = async (ctx, next) => {
    if (ctx.params.id !== ctx.state.user.id)  {
        ctx.throw(403, "没有操作权限")
    }
    await next()
} 


module.exports = {
    auth,
    checkOwner
}