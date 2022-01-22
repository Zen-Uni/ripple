## 教程
> 这次更新是以最小粒度更新 Koa2 方面的脚手架（即更新内容是所有 Node 开发的同学要用到的，后续可以根据自己选择增加内容）

## 做了什么？

### 使脚手架结构清晰

将项目结构分成了三层：
- routes: 接口路由
- controllers: 存放控制器，用于处理请求和响应
- models: 存放 ORM 模型，书写 Schema（这个需要 Node 开发的同学自己去填充内容，以达到熟悉 MongoDB 以及 mongoose 的效果）

#### 编写脚本批量注册路由

在 Koa2 的官方文档中写到以下方式去注册路由中间件
```js
    // 引入相关路由模块
    const users = require('./routes/users')
    // 注册路由
    app.use(users.routes(), users.alloweMethods())
```

但是如果我们有很多的路由相关的文件，那么这就会变得十分麻烦，我们需要写很多这样的引入代码和注册代码

所以，我写了一个脚本自动地、批量地去处理路由文件的注册，后续 Node 开发组的同学无需再在 App.js 文件中处理路由，只需在 /routes 文件夹中尽情创建路由文件即可。

```js
    /**
     * @description 批量读取路由文件，自动化注册中间件
     * @author Uni
     * @since 1.0
     */

    const fs = require('fs')

    module.exports = app => {
    fs.readdirSync(__dirname).forEach(file => {
        if (file === 'index.js') return  // 因为批处理文件放到了 /routes/index.js 中，所以 需要特殊判断以下
        const router = require(`./${file}`)
        app.use(router.routes()).use(router.allowedMethods())
    })
    }
```

#### 以更好地方式组织控制器 
此次控制器的处理我采用面向对象的方式使同类控制器功能聚合，例如：

```js
/**
 * @description 与 users 相关的控制器
 * @author Uni
 * @since 1.0
 */

class UsersCtl {
    index(ctx, next) {
        ctx.body = "这是 users 的根路由"
    }

    bar(ctx, next) {
        ctx.body = "这是 /users/bar "
    }

    handleError(ctx, next) {
        const id = ctx.params.id
        if (id > 10) ctx.throw(412, "条件错误：输入的 id 应该小于等于 10")

        ctx.body = `输入大于 10 的 id 试试康, 当前 id 为: ${id}`
    }

    handleParameter(ctx, next) {
        ctx.verifyParams({
            username: {
                type: 'string',
                require: true
            },
            password: {
                type: 'string',
                require: true
            }
        })

        ctx.body =  ctx.request.body
    }
}

module.exports = new UsersCtl()
```

这样子的化，能够更加内聚控制器的同时，解耦 routes 和 controller 之间的多于逻辑。在 routes 中的表现如下：

```js
/**
 * @description /users 路由文件夹，示例
 * @author Uni
 * @since 1.0
 */

const router = require('koa-router')()
const { index, bar, handleError, handleParameter } = require('../controllers/users')


router.prefix('/users')

router.get('/', index)
router.get('/:id', handleError)
router.get('/bar', bar)

router.post('/param', handleParameter)


module.exports = router
```

### 请求、响应友好

#### 如何使用 Koa2 内置的方法抛出错误
我们可以采用 `ctx.throw` 这个方法对错误异常进行主动抛出，例如：

```js
    // 详细可以结合我写的控制器示例来看
    ctx.throw(412, "412 状态码为先决条件错误")
    ctx.throw(404, "Not Found")
```

#### 加入第三方中间件，使得我们的错误信息更加友好

在脚手架中，我引入了 `koa-json-error` 这个 `npm` 包。它能够让我们的错误响应成一个详细、友好的 `json` 格式。
因为这个包默认会返回抛出错误的堆栈信息，所以在响应的时候，我做了一层处理即如果是生产环境则将堆栈信息屏蔽。本脚手架约定 `npm start` 为生产环境, `npm run dev` 为开发环境。已配置好响应钩子，请尽情开发。
```js
app.use(error({
  postFormat: (err, {
    stack,
    ...rest
  }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))
```

#### 对请求参数进行更友好的校验
我们可以使用 `koa-parameter` 对请求信息进行格式校验

```js
    // App.js 中注册中间件
    const parameter = require('koa-parameter')
    app.use(parameter(app))
```

```js
    // 在控制器中对请求信息进行格式校验，例如 UserCtl 中的 handleParameter 方法
    handleParameter(ctx, next) {
        // 校验请求体中参数的数据类型、以及是否必要，可在 postman 中进行尝试
        ctx.verifyParams({
            username: {
                type: 'string',
                require: true
            },
            password: {
                type: 'string',
                require: true
            }
        })

        ctx.body =  ctx.request.body
    }
```

## One more thing
最近一直在忙这重构公司的项目，所以忘了 Ripple 后端 Node 组这一块的脚手架搭建，我以为我已经传了，不好意思了伙伴们，耽误你们进度了。
今晚趁着好没有更新 commit 所以写了一下这个 README 方便大家理解。
祝开发愉快