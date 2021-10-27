/**
 * @description path: /api/user, about user login, register and none-token service
 */

const { handleSearchUser } = require('../controller/friend')
const { emailCheck, userRegister, userLogin, tokenCheck } = require('../controller/sign')
// const { dispatchToken } = require('../utils/jwt')

const router = require('koa-router')()

router.prefix('/api/user')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})


// user email check - throttle
router.post('/email-check', async (ctx, next) => {
    const { email } = ctx.request.body;
    const res = await emailCheck(email);
    ctx.body = res;
})

// user register
router.post('/register', async (ctx, next) => {
  const { email, username, password } = ctx.request.body;

  const userMsg = {
    email, username, password
  };

  ctx.body = await userRegister(userMsg);
})


// user login
router.post('/login', async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const userMsg = {email, password};
  ctx.body = await userLogin(userMsg);
})


// token check
router.get('/token-check', async (ctx, next) => {
  const token = ctx.headers.authorization;
  console.log(token);
  ctx.body = await tokenCheck(token);
})


// find user
router.post('/find', async (ctx, next) => {
  const { email } = ctx.request.body;
  ctx.body =  await handleSearchUser(email);
})

// TODO：好友请求
router.post('/friend-request', async (ctx, next) => {
  
})


module.exports = router
