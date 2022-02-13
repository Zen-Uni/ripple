module.exports = (io, socket) => {
    const handleLogoutUser = () => {
        socket.disconnect(true)
    }
    socket.on('user:logout', handleLogoutUser)
}
