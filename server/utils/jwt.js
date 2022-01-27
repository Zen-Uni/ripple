/**
 * @description jwt
 * @author Airbo
 * @since 1.0
 */
const jwt = require('jsonwebtoken')


module.exports = (email)=>jwt.sign({email: email}, 'Ripple', { expiresIn: '1h' });