/**
 * @description /users 路由文件夹，示例
 * @author Uni
 * @since 1.0
 */

const router = require("koa-router")();
const {
  index,
  login,
  register,
  captcha,
  auth,
} = require("../controllers/users");

router.prefix("/users");

router.get("/", index);
router.get('/auth',auth)

router.post("/login", login);
router.post("/register", register);
router.post("/captcha", captcha);

module.exports = router;
