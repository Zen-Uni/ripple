/**
 * @description 与 token 相关的工具
 * @author Uni
 * @since 1.0
 */

const jsonwebtoken = require('jsonwebtoken')
const { SECRET } = require('../config/config')

const createToken = (id, username) => jsonwebtoken.sign({ id, username }, SECRET, { expiresIn: '1d' })


module.exports = {
    createToken
}