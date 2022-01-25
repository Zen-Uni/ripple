/**
 * @description /file 路由
 * @author Hans
 * @since 1.0
 */

const router = require('koa-router')()
const multer = require('@koa/multer')
const { singleImg, multipleImg } = require('../controllers/file')

router.prefix('/file')

router.post('/img', multer().single('file'), singleImg)
router.post(
    '/imgs',
    multer().fields([
        {
            name: 'file',
        },
    ]),
    multipleImg,
)

module.exports = router
