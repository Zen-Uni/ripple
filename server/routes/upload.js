/**
 * @description some apis about file upload
 */

const router = require("koa-router")();
const koaForm = require('formidable-upload-koa');
const { uploadAvatar } = require("../controller/upload");
const { parseToken } = require("../utils/jwt");

router.prefix("/api/upload");

router.post("/avatar", koaForm(), async (ctx, next) => {
    const files = ctx.req.files["upImg"];
    const token = ctx.headers.authorization;
    const { data } = await parseToken(token);
    const { name, size, path, type } = files
    ctx.body = await uploadAvatar({
        name,
        type,
        size,
        filePath: path,
        email: data.email
    });
})


module.exports = router;