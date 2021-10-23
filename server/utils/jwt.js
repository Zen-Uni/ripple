/**
 * @description JWT module: dispatch token and verify the token
 */

const jwt = require('jsonwebtoken')
const { ErrorModel, SuccessfulModel }  = require('../utils/ResultModel')

// secret salt
const secret = "RIPPLE_TOKEN"

// verify token
const jwtRightVerify = async (ctx, next) => {
    return next().catch(err => {
        if (err.status === 401) {
            ctx.body = new ErrorModel("token 验证失败")
        } else {
            throw err
        }
    })
}

// dispatch token
const dispatchToken = email => {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({ email }, secret, {
            notBefore: 0,
            expiresIn: 60 * 60 * 24 * 7
        })
        resolve(token)
    })
}

// parse token
const parseToken = token => {
    if (!token) {
        return new ErrorModel("解析 token 失败")
    }

    return {
        code: 0,
        data: jwt.verify(token.split(' ')[1], secret)
    }
}

module.exports = {
    jwtRightVerify,
    dispatchToken,
    parseToken,
    secret
}