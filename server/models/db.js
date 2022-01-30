/**
 * @description Mongoose 连接 MongoDB
 * @author Uni
 * @since 1.0
 */

const mongoose = require('mongoose')
const { CONNECT_URL_DEV, CONNECT_URL_PRD } = require('../config/config')

let env = process.env.NODE_ENV !== 'production' ? CONNECT_URL_DEV : CONNECT_URL_PRD

mongoose.connect(env)

module.exports = mongoose