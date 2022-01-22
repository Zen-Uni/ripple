const Koa = require('koa')
const app = new Koa()
const error = require('koa-json-error')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const parameter = require('koa-parameter')
const routing = require('./routes')
// const users = require('./routes/users')

// error handler
onerror(app)
app.use(error({
  postFormat: (err, {
    stack,
    ...rest
  }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(parameter(app))

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
// app.use(users.routes(), users.allowedMethods())
routing(app)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
