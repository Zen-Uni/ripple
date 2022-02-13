const router = require('koa-router')()
const { handlePostCaptcha } = require('../controllers/captchas')

router.prefix('/api/captchas')

router.post('/', handlePostCaptcha)

module.exports = router
