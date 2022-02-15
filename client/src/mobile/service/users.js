/**
 * @description /users 相关接口
 * @author Uni
 * @since 1.0
 */

import Fetch from ".";

const fetch = new Fetch('/users')

// auth verify request
export const fetchAuth = fetch.get('/auth')

// get request
export const fetchCaptcha = fetch.get('/captcha')


// post request
export const fetchRegister = fetch.post('/register')
export const fetchLogin = fetch.post('/login')
export const fetchUploadImg = fetch.post('/upload')
