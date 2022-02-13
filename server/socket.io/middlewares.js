const { CODES_SOCKET_IO } = require('./const/codes')
const { verify, gainJwtSub } = require('../utils/jwt')
const { User, Member } = require('../database/models')
const {
    Types: { ObjectId },
} = require('../database')

const auth = async (socket, next) => {
    let {
        handshake: {
            headers: { authorization: jwt },
        },
    } = socket
    if (jwt === undefined) {
        const e = new Error('Unauthorized')
        e.data = {
            code: CODES_SOCKET_IO.AUTH_UNAUTHORIZED,
            msg: 'JWT缺失',
        }
        next(e)
        return
    }
    jwt = jwt.replace('Bearer ', '')
    if (!(await verify(jwt))) {
        const e = new Error('Forbidden')
        e.data = {
            code: CODES_SOCKET_IO.AUTH_FORBIDDEN,
            msg: 'JWT校验失败',
        }
        next(e)
        return
    }
    socket.sub = await gainJwtSub(jwt)
    if ((await User.findById(socket.sub)) === null) {
        const e = new Error('Forbidden')
        e.data = {
            code: CODES_SOCKET_IO.AUTH_FORBIDDEN,
            msg: '该用户未注册',
        }
        return
    }
    await next()
}

const rooms = async (socket, next) => {
    const { sub } = socket
    socket.join('user:' + sub)
    ;(
        await Member.find({
            member: new ObjectId(sub),
            status: 1,
        })
    ).forEach((v) => {
        socket.join('group:' + v.group.toString())
    })
    await next()
}

module.exports = (io) => {
    io.use(auth)
    io.use(rooms)
}
