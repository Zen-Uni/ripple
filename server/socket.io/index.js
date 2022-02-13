const { Server } = require('socket.io')
const initMiddlewares = require('./middlewares')

let io

const gainIo = () => io

const init = (server) => {
    io = new Server(server)
    initMiddlewares(io)
    io.on('connection', (socket) => {
        console.log('用户上线: ' + socket.sub)
        console.log(socket.rooms)
        require('./handlers')(io, socket)
    })
}

module.exports = {
    init,
    gainIo,
}
