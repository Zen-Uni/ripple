const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

// Uni require:
const cors = require('koa2-cors')
const jwt = require('koa-jwt')
const { jwtRightVerify, secret } = require("./utils/jwt")


const index = require('./routes/index')
const users = require('./routes/users')
const uploads = require("./routes/upload");

// error handler
onerror(app)


app.use(cors({
  origin: "*",  // 允许 所有的都可以跨域
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 50000,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Uni use middlewares
app.use(jwtRightVerify)
app.use(jwt({
  secret
}).unless({
  path: [/^\/api\/user\//, /^\/avatar\//]
}))




// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/upload'))
// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(uploads.routes(), uploads.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
