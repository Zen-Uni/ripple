const fs = require('fs')

module.exports = (io, socket) => {
    fs.readdirSync(__dirname).forEach((file) => {
        if (file === 'index.js') return
        require(`./${file}`)(io, socket)
    })
}
