/**
 * @description 与 users 相关的控制器
 * @author Uni
 * @since 1.0
 */
const { User, Captcha } = require("../models/index");
const {
  md5Crypto,
  Restful,
  checkIntegrity,
  sendMail,
  isUndef,
  signToken,
} = require("../utils/tools");
const upload = require("../utils/upload");
const validator = require("validator");
class UsersCtl {
  async captcha(ctx, next) {
    try {
      const { email } = ctx.query;
      if (!validator.isEmail(email)) {
        ctx.body = new Restful(0, "邮箱发送失败,请校验邮箱正确性", 10001);
        ctx.response.status = 412;
        return next();
      }

      const _captcha = md5Crypto(`${email}-${Date.now().toString()}`).slice(
        0,
        6
      );

      const existedCaptcha = await Captcha.findOne({ email: email }).then();
      if (existedCaptcha) {
        existedCaptcha.captcha = _captcha;
        await existedCaptcha.save();
        // await sendMail(email, _captcha);
        ctx.body = new Restful(1, "验证码获取成功", existedCaptcha);
        ctx.response.status = 200;
        return next();
      }
      const captcha = await Captcha.create({
        email: email,
        captcha: _captcha,
        createAt: new Date(),
      });
      // await sendMail(email, _captcha);
      ctx.body = new Restful(1, "验证码获取成功", captcha);
      ctx.response.status = 200;
      next();
    } catch (e) {
      console.log(e);
      ctx.body = new Restful(0, "common error " + e.toString(), 10000);
      ctx.response.status = 500;
      next();
    }
  }

  async register(ctx, next) {
    try {
      const { username, password, captcha, email } = ctx.request.body;
      if (
        !checkIntegrity(ctx.request.body, [
          "username",
          "password",
          "captcha",
          "email",
        ]) ||
        !validator.isEmail(email)
      ) {
        ctx.body = new Restful(0, "参数格式错误", 10001);
        ctx.response.status = 412;
        return next();
      }
      const existedCaptcha = await Captcha.findOne({ email: email }).then();
      if (existedCaptcha.captcha !== captcha) {
        ctx.body = new Restful(0, "验证码错误", 10002);
        ctx.response.status = 404;
        return next();
      }

      const existedUser = await User.findOne({ email: email }).then();
      if (existedUser) {
        ctx.body = new Restful(0, "邮箱已被占用", 10003);
        ctx.response.status = 409;
        return next();
      }

      const md5Password = md5Crypto(password);
      await User.create({
        username: username,
        email: email,
        password: md5Password,
        createAt: new Date(),
      });
      const token = signToken(email);
      ctx.body = new Restful(1, "注册成功", { token: token });
      ctx.response.status = 200;
      next();
    } catch (e) {
      console.log(e);
      ctx.body = new Restful(0, "common error " + e.toString(), 10000);
      ctx.response.status = 500;
      next();
    }
  }

  async login(ctx, next) {
    try {
      const { password, email } = ctx.request.body;
      if (
        !checkIntegrity(ctx.request.body, ["email", "password"]) ||
        !validator.isEmail(email)
      ) {
        ctx.body = new Restful(0, "参数格式错误", 10001);
        ctx.response.status = 412;
        return next();
      }
      const existedUser = await User.findOne({ email: email }).then();
      if (
        isUndef(existedUser) ||
        existedUser._doc.password !== md5Crypto(password)
      ) {
        ctx.body = new Restful(0, "用户名或密码错误", 10004);
        ctx.response.status = 200;
        return next();
      }
      const token = signToken(email);
      const resUser = existedUser._doc;
      delete resUser.password;
      ctx.body = new Restful(1, "登录成功", { ...resUser, token });
      ctx.response.status = 200;
      next();
    } catch (e) {
      console.log(e);
      ctx.body = new Restful(0, "common error " + e.toString(), 10000);
      ctx.response.status = 500;
      next();
    }
  }

  async uploadAvatar(ctx, next) {
    let err = await upload
      .single("file")(ctx, next)
      .then((res) => res)
      .catch((err) => err);
    if (err) {
      ctx.body = new Restful(0, err.message, 10006);
    }
    ctx.body = new Restful(1, "图像地址分发成功", ctx.file);
   // next();
    // const tmp = upload.single('file')
    // let x = tmp(ctx,next)
    // console.log(x)
  }

  handleError(ctx, next) {
    const id = ctx.params.id;
    if (id > 10) ctx.throw(412, "条件错误：输入的 id 应该小于等于 10");

    ctx.body = `输入大于 10 的 id 试试康, 当前 id 为: ${id}`;
  }

  handleParameter(ctx, next) {
    ctx.verifyParams({
      username: {
        type: "string",
        require: true,
      },
      password: {
        type: "string",
        require: true,
      },
    });

    ctx.body = ctx.request.body;
  }
}

module.exports = new UsersCtl();
