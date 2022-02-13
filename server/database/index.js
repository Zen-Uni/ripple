require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI).then(() => {
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
