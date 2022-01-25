/**
 * @description 与 file 相关的控制器
 * @author Hans
 * @since 1.0
 */

// TODO 大文件的自动分割和断点续传
// TODO 确定文件存储路径和返回路径

const fs = require('fs/promises')
const path = require('path')
const { CODE_FILE } = require('../const/code')

const gainRandomStr = (len) =>
    new Array(10)
        .fill(null)
        .map(() => Math.random().toString(36).slice(-1))
        .join('')

const storeFile = (dir, data, extname) =>
    new Promise((resolve, reject) => {
        const file = path.join(dir, gainRandomStr(10) + extname)
        fs.writeFile(file, data, {
            flag: 'wx',
        })
            .then(() => {
                resolve(file)
            })
            .catch((e) => {
                if (e && e.code === 'EEXIST') storeFile(dir, data, extname)
                else reject(e)
            })
    })

class FileCtl {
    async singleImg(ctx, next) {
        const STORAGE_DIR = path.join('public', 'img')
        await storeFile(
            STORAGE_DIR,
            ctx.file.buffer,
            path.extname(ctx.file.originalname),
        )
            .then((file) => {
                ctx.body = {
                    code: CODE_FILE.SUCCESS,
                    msg: '图片上传成功',
                    data: {
                        // TODO host外置
                        url: file,
                    },
                }
            })
            .catch((e) => {
                console.error(e)
                ctx.body = {
                    code: CODE_FILE.ERROR_OTHER,
                    msg: '图片上传失败',
                }
            })
    }
    async multipleImg(ctx, next) {
        const STORAGE_DIR = path.join('public', 'img')
        console.log(ctx.files.file)
        await Promise.all(
            ctx.files.file.map(
                (ele) =>
                    new Promise((resolve, reject) => {
                        storeFile(
                            STORAGE_DIR,
                            ele.buffer,
                            path.extname(ele.originalname),
                        ).then((file) => {
                            resolve(file)
                        })
                    }),
            ),
        )
            .then((urls) => {
                ctx.body = {
                    code: CODE_FILE.SUCCESS,
                    msg: `${ctx.files.file.length}张图片上传成功`, // TODO 上传失败的处理
                    data: {
                        // TODO host外置
                        urls,
                    },
                }
            })
            .catch((e) => {
                console.error(e)
                ctx.body = {
                    code: CODE_FILE.ERROR_OTHER,
                    msg: '图片上传失败',
                }
            })
    }
}

module.exports = new FileCtl()
