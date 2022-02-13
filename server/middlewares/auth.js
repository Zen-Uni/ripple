/**
 * @description jwt鉴权中间件
 * @author Hans
 * @since 1.0
 */

const { verify, gainJwtSub } = require('../utils/jwt')
const { User } = require('../database/models')

const urlWhiteList = [
    '/test/newUser',
    '/test/newUserToken/:userId',
    '/test/newGroup',
    '/test/becomeNewMember',
].map((v) => '/api' + v)

const checkUrlWhiteList = (url) => {
    for (const allowableUrl of urlWhiteList) {
        let strRegExp = ''
        allowableUrl.split(':').forEach((v, i) => {
            if (i % 2 === 0) {
                strRegExp += v
                return
            }
            strRegExp += '(.)+/'
        })
        strRegExp = '^' + strRegExp.replace(/\/$/g, '(/)?') + '$'
        if (new RegExp(strRegExp).test(url)) return true
    }
    return false
}

module.exports = async (ctx, next) => {
    let {
        header: { authorization: jwt },
    } = ctx
    if (checkUrlWhiteList(ctx.url)) {
        await next()
        return
    }
    if (jwt === undefined) {
        ctx.status = 401
        return
    }
    jwt = jwt.replace('Bearer ', '')
    if (!(await verify(jwt))) {
        ctx.status = 403
        return
    }
    ctx.sub = await gainJwtSub(jwt)
    if ((await User.findById(ctx.sub)) === null) {
        ctx.status = 401
        return
    }
    await next()
}

// TODO 自动续签
