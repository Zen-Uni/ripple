const mongoose = require('mongoose')

mongoose.connect('mongodb://ripple-mongodb/ripple').then(() => {
    console.log('Ripple-backend已连接MongoDB...')
})
mongoose.connection.on('error', (e) => {
    throw e
})
mongoose.connection.on('disconnected', (e) => {
    console.error('MongoDB disconnected...')
    throw e
})

module.exports = mongoose
