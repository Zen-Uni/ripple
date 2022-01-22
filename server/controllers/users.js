/**
 * @description 与 users 相关的控制器
 * @author Uni
 * @since 1.0
 */

class UsersCtl {
    index(ctx, next) {
        ctx.body = "这是 users 的根路由"
    }

    bar(ctx, next) {
        ctx.body = "这是 /users/bar "
    }


    handleError(ctx, next) {
        const id = ctx.params.id
        if (id > 10) ctx.throw(412, "条件错误：输入的 id 应该小于等于 10")

        ctx.body = `输入大于 10 的 id 试试康, 当前 id 为: ${id}`
    }

    handleParameter(ctx, next) {
        ctx.verifyParams({
            username: {
                type: 'string',
                require: true
            },
            password: {
                type: 'string',
                require: true
            }
        })

        ctx.body =  ctx.request.body
    }
}

module.exports = new UsersCtl()