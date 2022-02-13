const { SignJWT, jwtVerify } = require('jose')
const { Buffer } = require('buffer')
const { createSecretKey } = require('crypto')

const JWT_SHARED_KEY = createSecretKey(Buffer.from('ripple-shared-key'))

const sign = (userId) =>
    new SignJWT({})
        .setProtectedHeader({
            alg: 'HS256',
            typ: 'JWT',
        })
        .setSubject(userId)
        .setExpirationTime('7d') // TODO 调短过期时间
        .sign(JWT_SHARED_KEY)

const verify = async (jwt) => {
    try {
        return !!(await jwtVerify(jwt, JWT_SHARED_KEY))
    } catch (e) {
        return false
    }
}

const gainJwtSub = async (jwt) => {
    const {
        payload: { sub },
    } = await jwtVerify(jwt, JWT_SHARED_KEY)
    return sub
}

module.exports = { sign, verify, gainJwtSub }
