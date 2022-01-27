/**
 * @description 与 users 相关的控制器
 * @author Uni
 * @since 1.0
 */

const transporter = require("../utils/mailer");
const creatCaptcha = require("../utils/captcha");
const CODE = require("../utils/const");
const mailreg = require("../utils/mailreg");
const createDebug = require("debug");
const User = require("../models/User");
const Cache = require("../models/Cache");
const jwt = require("../utils/jwt");
const crypto = require("crypto");

let registe = (email, password, username) =>
  new Promise((resolve, reject) => {
    new User({
      email: email,
      password: password,
      username: username,
      createDate: new Date(),
    }).save((err) => {
      if (!err) {
        resolve(1);
      } else {
        reject(err);
      }
    });
  });

let checkCaptcha = (email) =>
  new Promise((resolve, reject) => {
    Cache.find({ email: email, createdAt: { $gte: 1 } }, (err, docs) => {
      if (err) reject(err);
      else {
        resolve(docs.pop());
      }
    });
  });

class UsersCtl {
  index(ctx, next) {
    ctx.body = "这是 users 的根路由";
  }

  /**
   * @description auth & login & register & captcha
   * @author Airbo
   * @since 1.0
   */
  //TODO 统一verifyParams校验数据格式不正确后返回的信息

  auth(ctx, next) {
    ctx.header.verifyParams({
      email: {
        authorization: "string",
        require: true,
      },
    });
    if (1) {
      ctx.status = 200;
      ctx.body = {
        msg: "token 验证成功",
        code: "<Auth>",
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        msg: "token 验证失败",
        code: "<Auth>",
      };
    }
  }

  login(ctx, next) {
    ctx.verifyParams({
      email: {
        type: "string",
        require: true,
      },
      password: {
        type: "string",
        require: true,
      },
    });
    if (1) {
      ctx.status = 200;
      ctx.body = {
        msg: "登录成功",
        data: "<token>",
        code: "<User>",
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        msg: "登录失败",
        code: "<User>",
      };
    }
  }

  async register(ctx, next) {
    ctx.verifyParams({
      email: {
        type: "string",
        require: true,
      },
      password: {
        type: "string",
        require: true,
      },
      username: {
        type: "string",
        require: true,
      },
      captcha: {
        type: "string",
        require: true,
      },
    });
    let { email, password, username, captcha } = ctx.request.body;
    let resCont;
    const debug = createDebug("user:register");

    try {
      if (mailreg(email)) {
        let doc = await checkCaptcha(email);
        if (doc == undefined) {
          debug(`this email do not have captcha: ${email}`);
          return (resCont = {
            msg: "无验证码",
            code: CODE.USERCAPTCHA_STOP_NOCAPTCHA,
          });
        }
        if (captcha == doc.captcha) {
          const psdMd5 = crypto
            .createHash("md5")
            .update(password)
            .digest("hex");
            console.log(psdMd5)
          await registe(email, psdMd5, username, captcha)
            .then((res) => {
              if (res == 1) {
                resCont = {
                  msg: "注册成功",
                  data: "Bear "+jwt(email),
                  code: CODE.SUCCESS,
                };
              }
              debug(`registerSuccessful,userInfo: ${(email, username)}`);
            })
            .catch((err) => {
              resCont = {
                msg: "注册失败",
                code: CODE.USERREGISTER_FAIL_CAUGHT,
              };
              debug(`注册失败, ${err}`);
            });
        } else {
          resCont = {
            msg: "验证码错误或过期",
            code: CODE.USERREGISTER_FAIL_CAPTCHAWRONG,
          };
          debug(`registerSuccessful,userInfo: ${(email, username)}`);
        }
      } else {
        resCont = {
          msg: "错误的邮箱地址",
          code: CODE.PARAMTER_ERROR_NOTEMAIL,
        };
        debug(`inputEmail: ${email} is not a email adress`);
      }
      console.log("try", resCont);
    } catch (err) {
      resCont = {
        msg: "注册失败",
        code: CODE.USERREGISTER_FAIL_CAUGHT,
      };
      debug(`Caught err: ${err}`);
    } finally {
      ctx.status = 200;
      ctx.body = resCont;
      console.log("final", resCont);
      debug(`resCont: ${JSON.stringify(resCont)}`);
    }
  }

  async captcha(ctx, next) {
    ctx.verifyParams({
      email: {
        type: "string",
        require: true,
      },
    });

    let { email } = ctx.request.body;
    let resCont;
    const debug = createDebug("user:captcha");

    try {
      let doc = await checkCaptcha(email);
      if (doc && new Date() - doc.createdAt < 1000 * 60) {
        resCont = {
          msg: "请勿多次请求验证码",
          code: CODE.USERCAPTCHA_STOP_SNEDTOFAST,
        };
        debug(`adventure: ${JSON.stringify(doc)}`);
      } else {
        let captcha = creatCaptcha();
        new Cache({
          email: email,
          captcha: captcha,
          createdAt: new Date(),
        }).save((err) => {
          if (err) return console.error(err);
        });
        if (mailreg(email)) {
          let mailCofig = {
            from: '"AirboZH" <airbozh@qq.com>', // sender address
            to: email, // list of receivers
            subject: "[Ripple] 欢迎注册Ripple", // Subject line
            html: `<p>您好，你正在注册Ripple聊天室，您的验证码是<b>${captcha}</b>（5分钟后过期）</p>`, // html body
          };
          await transporter.sendMail(mailCofig);
          resCont = {
            msg: "验证码发送成功",
            code: CODE.SUCCESS,
          };
          debug(`mailCofig: ${JSON.stringify(mailCofig)}`);
        } else {
          resCont = {
            msg: "错误的邮箱地址",
            code: CODE.PARAMTER_ERROR_NOTEMAIL,
          };
          debug(`inputEmail: ${email} is not a email adress`);
        }
      }
    } catch (err) {
      resCont = {
        msg: "验证码发送失败",
        code: CODE.USERCAPTCHA_SENDFAIL_CAUGHT,
      };
      debug(`Caught err: ${err}`);
    } finally {
      ctx.status = 200;
      ctx.body = resCont;
      debug(`resCont: ${JSON.stringify(resCont)}`);
    }
  }
}

module.exports = new UsersCtl();
